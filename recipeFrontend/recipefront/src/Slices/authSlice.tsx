import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:3000/auth", // Fixed the base URL
        prepareHeaders: async (headers) => {
            const token = localStorage.getItem("token");
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        }
    }),
    tagTypes: ['Following', 'User', 'Bookmark'],
    endpoints: (builder) => ({
        followUser: builder.mutation({
            query: (userIdToFollow) => ({
                url: `/follow/${userIdToFollow}`,
                method: 'PATCH'
            }),
            invalidatesTags: (result) => [{ type: 'Following', id: result._id }],
        }),
        unfollowUser: builder.mutation({
            query: (userIdToUnfollow) => ({
                url: `/unfollow/${userIdToUnfollow}`,
                method: 'PATCH'
            }),
            invalidatesTags: (result) => [{ type: 'Following', id: result._id }],
        }),
        signUpUser: builder.mutation({
            query: (userData) => ({
                url: '/signup',
                method: 'POST',
                body: userData
            }),
            invalidatesTags: ['User'],
        }),
        loginUser: builder.mutation({
            query: (credentials) => ({
                url: '/login',
                method: 'POST',
                body: credentials
            }),
            invalidatesTags: ['User'],
        }),
        getFollowing: builder.query({
            query: (userId) => ({
                url: `/${userId}/following`,
                method: 'GET'
            }),
            providesTags: (result) => 
                Array.isArray(result) ? result.map(({ id }) => ({ type: 'Following', id })) : [],
        }),
        getFollowers: builder.query({
            query: (userId) => ({
                url: `/${userId}/followers`,
                method: 'GET'
            }),
            providesTags: (result) => 
                Array.isArray(result) ? result.map(({ id }) => ({ type: 'Following', id })) : [],
        }),
        logout: builder.mutation({
            query: () => ({
                url: '/logout',
                method: 'POST'
            }),
            invalidatesTags: ['User'],
        }),
        bookmarkPost: builder.mutation({
            query: (postId) => ({
                url: '/bookmarkpost',
                method: 'PATCH',
                body: { postId }
            }),
            invalidatesTags: ['Bookmark'],
        }),
        showBookmarkPost: builder.query({
            query: () => ({
                url: '/showbookmark',
                method: 'GET'
            }),
            providesTags: ['Bookmark'],
        }),
        unBookmarkPost: builder.mutation({
            query: (postId) => ({
                url: '/unbookmarkpost',
                method: 'PATCH',
                body: { postId }
            }),
            invalidatesTags: ['Bookmark'],
        }),
        uploadProfilePic: builder.mutation({
            query: (formData) => ({
                url: '/uploadprofilepic',
                method: 'PATCH',
                body: formData
            }),
            invalidatesTags: ['User'],
        }),
        uploadCoverPic: builder.mutation({
            query: (formData) => ({
                url: '/uploadcoverpic',
                method: 'PATCH',
                body: formData
            }),
            invalidatesTags: ['User'],
        }),
        getCurrentUser: builder.query({
            query: () => ({
              url: '/currentuserdata', // Adjust this endpoint based on your backend
              method: 'GET',
            }),
            providesTags: ['User'],
        })
    })
});

export const {
    useSignUpUserMutation,
    useLoginUserMutation,
    useFollowUserMutation,
    useUnfollowUserMutation,
    useGetFollowingQuery,
    useGetFollowersQuery,
    useLogoutMutation,
    useBookmarkPostMutation,
    useShowBookmarkPostQuery,
    useUnBookmarkPostMutation,
    useUploadProfilePicMutation,
    useUploadCoverPicMutation,
    useGetCurrentUserQuery
} = authApi;