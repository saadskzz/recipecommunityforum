import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const commentsApi = createApi({
  reducerPath: 'commentsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/engagement/",
    prepareHeaders: async (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }
      return headers
    }
  }),
  tagTypes: ['Comments'],
  endpoints: (builder) => ({
    getPostComments: builder.query({
      query: (postId) => `postcomments/${postId}`,
      providesTags: ['Comments']
    }),
    createComment: builder.mutation({
      query: (comment) => ({
        url: `/${comment.postId}/createcomment`,
        method: 'POST',
        body: comment
      }),
      invalidatesTags: ['Comments']
    }),
    deleteComment: builder.mutation({
      query: (commentId) => ({
        url: `/${commentId}/deletecomment`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Comments']
    })
  })
})

export const { useGetPostCommentsQuery, useCreateCommentMutation, useDeleteCommentMutation } = commentsApi;
