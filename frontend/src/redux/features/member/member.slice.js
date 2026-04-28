import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../utils/api";

const initialState = {
	data: [],
	loading: false,
	isFetching: false, // for fetchAllMembers
	isDeleting: false, // for deleteMember
	isError: false,
	isSuccess: false,
	error: null
};
export const fetchAllMembers = createAsyncThunk(
	"member/fetchAllMembers",
	async (thunkAPI) => {
		try {
			const response = await api.get(`/membership`);
			return response.data;
		} catch (error) {
			return thunkAPI.rejectWithValue(error.response.data);
		}
	}
);
export const addMember = createAsyncThunk(
	"member/addMember",
	async (thunkAPI) => {
		try {
			const response = await api.post(`/membership`);
			return response.data;
		} catch (error) {
			return thunkAPI.rejectWithValue(error.response.data);
		}
	}
);
export const updateMember = createAsyncThunk(
	"member/updateMember",
	async (memberId, thunkAPI) => {
		console.log(memberId, "member/updateMember");
		try {
			const response = await api.patch(`/membership/${memberId}`);
			return response.data;
		} catch (error) {
			return thunkAPI.rejectWithValue(error.response.data);
		}
	}
);
export const deleteMember = createAsyncThunk(
	"member/deleteMember",
	async (memberId, thunkAPI) => {
		console.log(memberId, "member/deleteMember");
		try {
			const response = await api.delete(`/membership/${memberId}`);
			return response.data;
		} catch (error) {
			return thunkAPI.rejectWithValue(error.response.data);
		}
	}
);
export const memberSlice = createSlice({
	name: "member",
	initialState,
	reducers: {
		clearState: () => initialState,
		clearSuccess: (state) => {
			state.isSuccess = false;
		}
	},
	extraReducers: (builder) => {
		//get member
		builder.addCase(fetchAllMembers.pending, (state) => {
			state.isFetching = true;
		});
		builder.addCase(fetchAllMembers.fulfilled, (state, action) => {
			state.isFetching = false;
			state.isSuccess = true;
			state.data = action.payload;
		});
		builder.addCase(fetchAllMembers.rejected, (state, action) => {
			state.isFetching = false;
			state.error = action.payload.error;
			state.isError = false;
		});
		//add member
		builder.addCase(addMember.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(addMember.fulfilled, (state, action) => {
			state.isLoading = false;
			state.isSuccess = true;
			state.data = action.payload;
		});
		builder.addCase(addMember.rejected, (state, action) => {
			state.isLoading = false;
			state.error = action.payload.error;
			state.isError = false;
		});

		//update member
		builder.addCase(updateMember.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(updateMember.fulfilled, (state, action) => {
			state.isLoading = false;
			state.isSuccess = true;
			const itemIndex = state.data.findIndex(
				(item) => item._id === action.payload._id
			);
			if (itemIndex !== -1) {
				state.data = state.data.splice(itemIndex, 1, action.payload);
			}
		});
		builder.addCase(updateMember.rejected, (state, action) => {
			state.isLoading = false;
			state.error = action.payload.error;
			state.isError = false;
		});

		// delete member
		builder.addCase(deleteMember.pending, (state) => {
			console.log("deleteMember.pending", state.isLoading);
			state.isDeleting = true;
			state.isError = false;
			state.isSuccess = false;
		});

		builder.addCase(deleteMember.fulfilled, (state, action) => {
			const id = action.meta.arg;

			state.isDeleting = false;
			state.isSuccess = true;

			if (state.data) {
				state.data = state.data.filter((item) => item._id !== id);
			}
		});

		builder.addCase(deleteMember.rejected, (state, action) => {
			state.isDeleting = false;
			state.isSuccess = false;
			state.isError = true;
			state.error = action.payload?.error ?? "Something went wrong.";
		});
	}
});
export const { clearState, clearSuccess } = memberSlice.actions;
export default memberSlice.reducer;
