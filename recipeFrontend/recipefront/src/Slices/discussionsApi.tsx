// discussionSlice.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const discussionsApi = createApi({
  reducerPath: 'discussionsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/api/v1/",
    prepareHeaders: async (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    }
  }),
  tagTypes: ['Categories'],
  endpoints: (builder) => ({
    getAllDiscussions: builder.query({
      query: () => '/getdiscussioncategories',
      providesTags: ['Categories']
    }),
  })
});

export const { useGetAllDiscussionsQuery } = discussionsApi;