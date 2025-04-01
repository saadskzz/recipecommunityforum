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
    // Container div with flex wrap
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
    margin:20,
    gap:10
     
    }}>
      {recipes.map(recipe => (
        <Link 
          key={recipe.id} 
          to={`/dashboard/airesponse/${recipe._id}`} 
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <div style={{ 
            width: '300px', 
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            boxShadow: '0px 4px 6px rgba(0,0,1,0.9)' // added shadow to outer card container
          }}>
            <div style={{ 
                display:'flex',
                flexDirection:'column',
                justifyContent:'end',
                alignItems:'center',
              width: '100%', 
              height:'200px',
              boxShadow: '0px 4px 6px rgba(29, 29, 31, 0.9)', // existing shadow remains here
              backgroundImage: `url(${recipe.image_url || defaultImage})`, 
              backgroundSize: 'cover', 
              backgroundPosition: 'center' 
            }}>
            <p style={{  backgroundColor: 'black', width:'100%', color:'white', textAlign:'center', padding:10, fontSize:18, fontWeight:400, opacity:0.8 }}>{recipe.title}</p>
            </div>
           
          </div>
        </Link>
      ))}
    </div>
  );
}

export default UserRecipes;
