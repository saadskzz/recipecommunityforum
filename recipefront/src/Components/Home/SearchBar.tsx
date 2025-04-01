import { ArrowRightOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import { useState } from 'react';
import { useCreateRecipeMutation } from '../../Slices/recipeApi'; 
import { useNavigate } from 'react-router-dom';

const { TextArea } = Input;

function SearchBar() {
  const [instructions, setInstructions] = useState('');
  const [createRecipe, { isLoading }] = useCreateRecipeMutation();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!instructions.trim()) {
      console.warn('Please enter a recipe name');
      return;
    }
    try {
      const response = await createRecipe({ name: instructions }).unwrap();
      console.log('Created recipe:', response.data);
      navigate(`/dashboard/airesponse/${response.data._id}`);
    } catch (error) {
      console.error('Error creating recipe:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="searchbar">
      <TextArea
        rows={2}
        name="instructions"
        placeholder="Enter a recipe name (e.g., Chicken Curry)"
        value={instructions}
        onChange={(e) => setInstructions(e.target.value)}
        onKeyPress={handleKeyPress}
        style={{
          border: 'none',
          outline: 'none',
          boxShadow: 'none',
        }}
      />
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <ArrowRightOutlined
          onClick={!isLoading ? handleSubmit : undefined}
          className="enter-search-icon"
          style={{
            color: instructions ? 'white' : 'rgb(176,176,172)',
            fontWeight: 'bold',
            backgroundColor: instructions ? '#4D99A3' : 'rgb(238,238,234)',
            padding: '10px',
            fontSize: 15,
            borderRadius: '50%',
            marginTop: 20,
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.5 : 1,
          }}
        />
      </div>
    </div>
  );
}

export default SearchBar;