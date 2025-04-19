import React, { useState, useCallback, useEffect } from 'react';
import CustomInput from '../../CustomInput';
import '../Post/addpost.css';
import { Input, message, Select, Button, Upload as AntUpload, Divider, Typography } from 'antd';
import { useCreatePostMutation } from '../../../Slices/postSlice';
import { useGetAllDiscussionsQuery } from '../../../Slices/discussionsApi';
import CustomButton from '../../CustomButton';
import { useDropzone } from 'react-dropzone';
import { PlusOutlined, UploadOutlined, DeleteOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Title, Text } = Typography;
const { Option } = Select;

interface CategoryFields {
  _id: string;
  discussionCategory: string;
}

interface AddPostProps {
  onCancel: () => void;
  onSuccess: () => void;
  onError: (errorMessage: string) => void;
}

function AddPost({ onCancel, onSuccess, onError }: AddPostProps) {
  const [title, setTitle] = useState('');
  const [ingredientsList, setIngredientsList] = useState<string[]>(['']);
  const [instructions, setInstructions] = useState('');
  const [recipeimg, setRecipeimg] = useState<File | null>(null);
  const [selectedDiscussionCategory, setSelectedDiscussionCategory] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState('');

  const { data: categories = [], error, isLoading } = useGetAllDiscussionsQuery(undefined);
  const [createPost, { isLoading: isSubmitting }] = useCreatePostMutation();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles[0]) {
      setRecipeimg(acceptedFiles[0]);
      message.success(`File ${acceptedFiles[0].name} uploaded successfully`);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    maxFiles: 1
  });

  const resetForm = () => {
    setTitle('');
    setIngredientsList(['']);
    setInstructions('');
    setRecipeimg(null);
    setSelectedDiscussionCategory('');
    setSuccessMessage('');
  };

  const handleAddIngredient = () => {
    setIngredientsList([...ingredientsList, '']);
  };

  const handleRemoveIngredient = (index: number) => {
    const newIngredients = [...ingredientsList];
    newIngredients.splice(index, 1);
    setIngredientsList(newIngredients.length ? newIngredients : ['']);
  };

  const handleIngredientChange = (index: number, value: string) => {
    const newIngredients = [...ingredientsList];
    newIngredients[index] = value;
    setIngredientsList(newIngredients);
  };

  const handleCreateRecipe = async () => {
    if (!title) {
      message.error('Recipe title is required');
      return;
    }
    
    if (!selectedDiscussionCategory) {
      message.error('Please select a category');
      return;
    }

    // Filter out empty ingredients
    const filteredIngredients = ingredientsList.filter(item => item.trim() !== '');

    const formData = new FormData();
    formData.append('title', title);
    
    if (filteredIngredients.length > 0) {
      formData.append('ingredients', JSON.stringify(filteredIngredients));
    }
    
    if (instructions) {
      formData.append('instructions', instructions);
    }
    
    formData.append('discussionCategory', selectedDiscussionCategory);
    
    if (recipeimg) {
      formData.append('recipeimg', recipeimg);
    }
    
    try {
      await createPost(formData).unwrap();
      message.success('Recipe created successfully');
      resetForm();
      onSuccess();
    } catch (error) {
      console.error('Error:', error);
      message.error('Failed to create recipe. Please try again.');
      onError('Failed to create recipe. Please try again.');
    }
  };

  useEffect(() => {
    if (categories.length) {
      setSelectedDiscussionCategory(categories[0]._id);
    }
  }, [categories]);

  return (
    <div className='recipe-form-container'>
      <Title level={3} className="form-title">Create New Recipe</Title>
      
      <div className="form-section">
        <Text strong>Recipe Title</Text>
        <Input
          placeholder="Enter your recipe title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          size="large"
          className="form-input"
        />
      </div>

      <div className="form-section">
        <Text strong>Category</Text>
        <Select
          placeholder="Select a category"
          value={selectedDiscussionCategory}
          onChange={setSelectedDiscussionCategory}
          style={{ width: '100%' }}
          size="large"
          className="form-select"
        >
          {categories.map((category: CategoryFields) => (
            <Option key={category._id} value={category._id}>
              {category.discussionCategory}
            </Option>
          ))}
        </Select>
      </div>
      
      <div className="form-section">
        <div className="section-header">
          <Text strong>Ingredients</Text>
          <Button 
            type="link" 
            icon={<PlusOutlined />} 
            onClick={handleAddIngredient}
            className="add-btn"
          >
            Add Ingredient
          </Button>
        </div>
        
        <div className="ingredients-list">
          {ingredientsList.map((ingredient, index) => (
            <div key={index} className="ingredient-item">
              <Input
                placeholder="Enter ingredient"
                value={ingredient}
                onChange={(e) => handleIngredientChange(index, e.target.value)}
                style={{ flex: 1 }}
              />
              {ingredientsList.length > 1 && (
                <Button 
                  type="text" 
                  danger 
                  icon={<DeleteOutlined />}
                  onClick={() => handleRemoveIngredient(index)}
                />
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="form-section">
        <Text strong>Instructions</Text>
        <TextArea
          rows={6}
          value={instructions}
          placeholder="Provide step-by-step cooking instructions"
          onChange={(e) => setInstructions(e.target.value)}
          className="form-textarea"
        />
      </div>
      
      <div className="form-section">
        <Text strong>Recipe Image</Text>
        <div {...getRootProps()} className={`image-upload-area ${isDragActive ? 'active' : ''}`}>
          <input {...getInputProps()} />
          {recipeimg ? (
            <div className="image-preview-container">
              <img 
                src={URL.createObjectURL(recipeimg)} 
                alt="Recipe Preview" 
                className="image-preview"
              />
              <Button 
                type="text" 
                danger 
                icon={<DeleteOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  setRecipeimg(null);
                }}
                className="remove-image-btn"
              />
            </div>
          ) : (
            <div className="upload-placeholder">
              <UploadOutlined className="upload-icon" />
              <Text>Drop an image here, or click to select a file</Text>
              <Text type="secondary">Supports JPG, PNG (max 5MB)</Text>
            </div>
          )}
        </div>
      </div>

      <Divider />
      
      <div className="form-actions">
        <Button 
          size="large" 
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button 
          type="primary" 
          size="large" 
          onClick={handleCreateRecipe}
          loading={isSubmitting}
        >
          Create Recipe
        </Button>
      </div>
    </div>
  );
}

export default AddPost;