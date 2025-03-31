import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../Slices/authSlice";
import authverifyReducer from "../Slices/authverify"; 
import { discussionsApi } from "../Slices/discussionsApi";
import { postsApi } from "../Slices/postSlice";
import { commentsApi } from "../Slices/commentSlice"; // Import commentsApi
import {recipeApi} from '../Slices/recipeApi'
const store = configureStore({
    reducer:{
        [authApi.reducerPath] : authApi.reducer,
        [postsApi.reducerPath] : postsApi.reducer,
        [discussionsApi.reducerPath]: discussionsApi.reducer,
        [commentsApi.reducerPath]: commentsApi.reducer, 
        [recipeApi.reducerPath]: recipeApi.reducer,
        // Add commentsApi reducer
        authverify: authverifyReducer, 
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            authApi.middleware,
            postsApi.middleware,
            discussionsApi.middleware,
            commentsApi.middleware,// Add commentsApi middleware
            recipeApi.middleware
        ),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
export default store