import { configureStore } from "@reduxjs/toolkit";

import memberReducer from "../redux/features/member/member.slice";
export const store = configureStore({
	reducer: {
		member: memberReducer
	}
});
