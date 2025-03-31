import React from 'react';
import { Link } from 'react-router-dom';
import { useGetUsersRecipeQuery } from '../../Slices/recipeApi';
import defaultImage from '../../../initialprofile.jpg';

function UserRecipes() {
  const { data: recipes, isLoading, error } = useGetUsersRecipeQuery(undefined);

  if (isLoading) return <div>Loading recipes...</div>;
  if (error) return <div>Error loading recipes: {error.message}</div>;
  if (!recipes || recipes.length === 0) return <div>No recipes found.</div>;

  return (
    <div>
      {recipes.map(recipe => (
        <Link 
          key={recipe.id} 
          to={`/dashboard/airesponse/${recipe._id}`} 
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', margin:20 }}>
            <img src={recipe.image_url || defaultImage} alt={recipe.title} style={{ width:'30%', height:200 }} />
            <p>{recipe.title}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default UserRecipes;