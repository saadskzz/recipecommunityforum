import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define interface for Recipe object
interface Recipe {
    _id: string;
    name: string;
    // Add other properties as needed
}

// Define the recipe API slice
export const recipeApi = createApi({
    // Unique key for this API slice in the Redux store
    reducerPath: "recipeApi",
    
    // Configure the base query with the API base URL and authentication headers
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:3000/askai", // Base URL for recipe endpoints
        prepareHeaders: (headers) => {
            // Retrieve the token from localStorage
            const token = localStorage.getItem("token");
            if (token) {
                // Set the Authorization header with the Bearer token
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        }
    }),
    
    // Define tag types for cache invalidation
    tagTypes: ['Recipe'],
    
    // Define the endpoints for recipe operations
    endpoints: (builder) => ({
        // Mutation to create a new recipe
        createRecipe: builder.mutation({
            query: (recipeData) => ({
                url: '/createrecipe',
                method: 'POST',
                body: recipeData // Expects an object with at least a 'name' field
            }),
            // Invalidate the 'Recipe' tag to refetch the list of recipes
            invalidatesTags: ['Recipe'],
        }),
        
        // Query to fetch all recipes
        getRecipes: builder.query({
            query: () => ({
                url: '/getrecipes',
                method: 'GET'
            }),
            // Provide tags for caching: one for each recipe and a general 'Recipe' tag
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ _id }: { _id: string }) => ({ type: 'Recipe', id: _id })),
                        { type: 'Recipe' }
                    ]
                    : [{ type: 'Recipe' }],
        }),
        
        // Query to fetch a single recipe by ID
        getRecipeById: builder.query({
            query: (id) => ({
                url: `/getonerecipe/${id}`,
                method: 'GET'
            }),
            // Provide a tag specific to this recipe's ID
            providesTags: (result, error, id) => [{ type: 'Recipe', id }],
        }),

        // New endpoint: fetch recipes for a specific user
        getUsersRecipe: builder.query({
            query: () => ({
                url: '/getusersrecipe',
                method: 'GET'
            }),
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ _id }: { _id: string }) => ({ type: 'Recipe', id: _id })),
                        { type: 'Recipe' }
                    ]
                    : [{ type: 'Recipe' }],
        }),
        deleteRecipe: builder.mutation({
            query: (id) => ({
                url: `/deleterecipe/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Recipe'],
        })
    })
});

// Export the auto-generated hooks for use in React components
export const {
    useCreateRecipeMutation,
    useGetRecipesQuery,
    useGetRecipeByIdQuery,
    useGetUsersRecipeQuery,
    useDeleteRecipeMutation
} = recipeApi;