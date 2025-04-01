import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetRecipeByIdQuery } from '../../Slices/recipeApi'; // Adjust import based on your setup
import './Airesponse.css';
import recipeImage from '../../../initialprofile.jpg';

const Airesponse = () => {
  const { id } = useParams<{ id: string }>();
  const { data: recipe, isLoading, error } = useGetRecipeByIdQuery(id);

  if (isLoading) return <div>Loading recipe...</div>;
  if (error) return <div>Error loading recipe: {error.message}</div>;
  if (!recipe) return <div>No recipe found.</div>;

  return (
    <div className="recipe-page">
      <h1 className="recipe-title">{recipe.title}</h1>
      <div style={{ display: 'flex', alignContent: 'center', alignItems: 'center' }}>
        <img
          src={recipe.image_url || recipeImage}
          style={{ height: '30%', width: '30%' }}
          alt={recipe.title}
          className="recipe-image"
        />
        <p className="recipe-description" style={{ marginLeft: 20 }}>
          {recipe.description}
        </p>
      </div>
      <h2>Ingredients</h2>
      <ul className="ingredients-list">
        {recipe.ingredients.map((ingredient, index) => (
          <li key={index}>{ingredient}</li>
        ))}
      </ul>
      <h2>Method</h2>
      <ol className="method-list">
        {recipe.instructions.split('\n').map((step, index) => (
          <li key={index}>{step}</li>
        ))}
      </ol>
      {recipe.nutritional_info && (
        <>
          <h2>Nutritional Information</h2>
          {typeof recipe.nutritional_info === 'string' ? (
            <p>{recipe.nutritional_info}</p>
          ) : (
            <table className="nutrition-table">
              <thead>
                <tr>
                  <th>Nutrient</th>
                  <th>Amount per serving</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(recipe.nutritional_info).map(([key, value], index) => (
                  <tr key={index}>
                    <td>{key}</td>
                    <td>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
};

export default Airesponse;