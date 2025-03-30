
import React from 'react';
import './Airesponse.css';
import recipeImage from '../../../initialprofile.jpg'; 

const Airesponse: React.FC = () => {
  return (
    <div className="recipe-page">
     
     

   
      <h1 className="recipe-title">Hara Bhara Kabab</h1>

   <div style={{display:'flex',alignContent:'center',alignItems:'center'}}>
      <img src={recipeImage} style={{height:"30%",width:'30%'}} alt="Hara Bhara Kabab" className="recipe-image" />

     
      <p className="recipe-description" style={{marginLeft:20}}>
        A delicious and healthy vegetarian snack made with spinach, peas, and
        potatoes, spiced to perfection and shallow-fried for a crispy finish.
      </p>

      </div>
     
      <h2>Ingredients</h2>
      <ul className="ingredients-list">
        <li>
          <strong>2 cups</strong> spinach, blanched and finely chopped
        </li>
        <li>
          <strong>1 cup</strong> green peas, boiled and mashed
        </li>
        <li>
          <strong>2 medium</strong> potatoes, boiled and mashed
        </li>
        <li>
          <strong>1 tsp</strong> ginger, grated
        </li>
        <li>
          <strong>1 tsp</strong> green chili, finely chopped
        </li>
        <li>
          <strong>2 tbsp</strong> gram flour (besan), roasted
        </li>
        <li>
          <strong>1 tsp</strong> chaat masala
        </li>
        <li>
          <strong>1 tsp</strong> cumin powder
        </li>
        <li>
          <strong>Salt</strong> to taste
        </li>
        <li>
          <strong>2 tbsp</strong> oil, for shallow frying
        </li>
      </ul>

     
      <h2>Method</h2>
      <ol className="method-list">
        <li>
          In a large mixing bowl, combine the blanched spinach, mashed peas,
          and mashed potatoes.
        </li>
        <li>
          Add grated ginger, chopped green chili, roasted gram flour, chaat
          masala, cumin powder, and salt. Mix well to form a uniform mixture.
        </li>
        <li>
          Divide the mixture into equal portions and shape each portion into a
          flat, round patty.
        </li>
        <li>
          Heat oil in a non-stick pan over medium heat. Shallow fry the patties
          until golden brown and crispy on both sides, about 3-4 minutes per
          side.
        </li>
        <li>
          Remove from the pan and drain excess oil on paper towels. Serve hot
          with mint chutney or yogurt dip.
        </li>
      </ol>

      {/* Nutritional Information */}
      <h2>Nutritional Information</h2>
      <table className="nutrition-table">
        <thead>
          <tr>
            <th>Nutrient</th>
            <th>Amount per serving</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Calories</td>
            <td>150 kcal</td>
          </tr>
          <tr>
            <td>Protein</td>
            <td>5g</td>
          </tr>
          <tr>
            <td>Fat</td>
            <td>7g</td>
          </tr>
          <tr>
            <td>Carbohydrates</td>
            <td>18g</td>
          </tr>
        </tbody>
      </table>

     
      
    </div>
  );
};

export default Airesponse;