import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { authApi } from "./authSlice";

export const postsApi = createApi({
  reducerPath: 'postsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/api/",
    prepareHeaders: async (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }
      return headers
    }
  }),
  tagTypes: ['Posts'],
  endpoints: (builder) => ({
    getAllPosts: builder.query({
      query: () => ({
        url: '/getallposts',
      }),
      providesTags: ['Posts']
    }),
    getPostsByCategory: builder.query({
      query: (categoryId) => `category/${categoryId}`,
      providesTags: ['Posts'],
    }),
    createPost: builder.mutation({
      query: (cred) => ({
        url: '/createpost',
        method: 'POST',
        body: cred
      }),
      invalidatesTags: ['Posts']
    }),
    deleteSelfPost: builder.mutation({
      query: (id) => ({
        url: `/${id}/deleteselfpost`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Posts']
    }),
    getMyPosts: builder.query({
      query: () => ({
        url: '/myposts',
      }),
      providesTags: ['Posts']
    }),
    getLikedPosts: builder.query({
      query: () => ({
        url: '/likedposts',
      }),
      providesTags: ['Posts']
    }),
    likePost: builder.mutation({
      query: (id) => ({
        url: `/${id}/like`,
        method: 'POST'
      }),
      invalidatesTags: ['Posts']
    }),
    unlikePost: builder.mutation({
      query: (id) => ({
        url: `/${id}/unlike`,
        method: 'POST'
      }),
      invalidatesTags: ['Posts']
    }),
    getFollowedPosts: builder.query({
      query: () => ({
        url: '/followedposts',
      }),
      providesTags: ['Posts']
    }),
    getBookmarkedPosts: builder.query({
      query: () => ({
        url: '/bookmarkedposts',
      }),
      providesTags: ['Posts']
    }),
    getPostsByUserId: builder.query({
      query: (userId) => `userposts/${userId}`,
      providesTags: ['Posts'],
    }),
    upvotePost: builder.mutation({
      query: (id) => ({
        url: `/${id}/upvote`,
        method: 'POST',
      }),
      invalidatesTags: ['Posts'],
    }),
    downvotePost: builder.mutation({
      query: (id) => ({
        url: `/${id}/downvote`,
        method: 'POST',
      }),
      invalidatesTags: ['Posts'],
    }),
  })
})
export const {useGetAllPostsQuery, useCreatePostMutation, useDeleteSelfPostMutation, useGetMyPostsQuery, useGetLikedPostsQuery, useLikePostMutation, useUnlikePostMutation, useGetFollowedPostsQuery, useGetBookmarkedPostsQuery, useGetPostsByCategoryQuery, useGetPostsByUserIdQuery, useUpvotePostMutation, useDownvotePostMutation} = postsApi

