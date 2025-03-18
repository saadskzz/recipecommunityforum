import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../Slices/authSlice";
import authverifyReducer from "../Slices/authverify"; 
import { discussionsApi } from "../Slices/discussionsApi";
import {postsApi} from "../Slices/postSlice"

const store = configureStore({
    reducer:{
        [authApi.reducerPath] : authApi.reducer,
        [postsApi.reducerPath] : postsApi.reducer,
        [discussionsApi.reducerPath]: discussionsApi.reducer,
        authverify: authverifyReducer, 
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(authApi.middleware,postsApi.middleware,discussionsApi.middleware),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
export default store