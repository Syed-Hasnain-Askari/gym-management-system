import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../utils/api";

const initialState = {
	member: [],
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
	async (data, thunkAPI) => {
		try {
			const response = await api.post(`/membership`, data);
			return response.data;
		} catch (error) {
			return thunkAPI.rejectWithValue(error.response.data);
		}
	}
);
export const updateMember = createAsyncThunk(
	"member/updateMember",
	async (data, thunkAPI) => {
		try {
			const response = await api.patch(`/membership/${data.memberId}`, data);
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
			console.log(action.payload, "fetchAllMembers.fulfilled");
			state.isFetching = false;
			state.isSuccess = true;
			state.member = action.payload.result;
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
			console.log(action.payload, "addMember.fulfilled");
			state.isLoading = false;
			state.isSuccess = true;
			state.member = [...state.member, action.payload.result];
		});
		builder.addCase(addMember.rejected, (state, action) => {
			console.log(action.payload, "addMember.rejected");
			state.isLoading = false;
			state.error = action.payload.error;
			state.isError = false;
		});

		//update member
		builder.addCase(updateMember.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(updateMember.fulfilled, (state, action) => {
			const { _id } = action.payload.result;
			state.isLoading = false;
			state.isSuccess = true;

			const itemIndex = state.member?.findIndex((item) => item._id === _id);
			console.log(itemIndex, "itemIndex");
			if (itemIndex !== -1) {
				state.member[itemIndex] = action.payload.result; // ✅ correct
			}
		});
		builder.addCase(updateMember.rejected, (state, action) => {
			console.log(action.payload, "updateMember.rejected");
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

			if (state.member) {
				state.member = state.member?.filter((item) => item._id !== id);
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
