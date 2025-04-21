import React, { useState } from 'react';
import { Typography, Input, Button, Card, Row, Col, Avatar, Tag, Empty, Modal, Form, Skeleton, Dropdown, Menu, Popconfirm } from 'antd';
import { FiSearch, FiClock, FiStar, FiEdit2, FiMoreVertical, FiTrash2 } from 'react-icons/fi';
import { useNavigate, Link } from 'react-router-dom';
import { useGetUsersRecipeQuery, useCreateRecipeMutation, useDeleteRecipeMutation } from '../../Slices/recipeApi';
import defaultImage from '../../../initialprofile.jpg';
import heroImage from '../../../public/homeBg.jpg';
import './recipe.css';
import './aistyle.css';
import './recipe-search.css';

const { Title, Text } = Typography;
const { Search } = Input;

// Quick search suggestions
const searchSuggestions = [
  { id: 1, text: 'Low carb lunch recipes' },
  { id: 2, text: 'High-protein vegetarian dinner' },
  { id: 3, text: 'Recipes with banana and oats' },
  { id: 4, text: 'One-pot healthy meals' },
];

// Define Recipe type based on the data structure
interface Recipe {
  id: string | number;
  _id: string;
  title: string;
  image_url?: string;
  cookTime?: string;
  rating?: number;
  description?: string;
}

function RecipeSearchHome() {
  const { data: recipes, isLoading, error } = useGetUsersRecipeQuery(undefined);
  const [createRecipe, { isLoading: isCreating }] = useCreateRecipeMutation();
  const [deleteRecipe] = useDeleteRecipeMutation();
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [searchQuery, setSearchQuery] = useState('');

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleCreateRecipe = async () => {
    try {
      const values = await form.validateFields();
      const response = await createRecipe({ name: values.recipeName || "New Recipe" }).unwrap();
      setIsModalVisible(false);
      form.resetFields();
      navigate(`/dashboard/airesponse/${response.data._id}`);
    } catch (error) {
      console.error('Error creating recipe:', error);
    }
  };

  const handleSearch = async (query: string) => {
    try {
      const response = await createRecipe({ name: query }).unwrap();
      navigate(`/dashboard/airesponse/${response.data._id}`);
    } catch (error) {
      console.error('Error creating recipe from search:', error);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSearch(suggestion);
  };

  const handleDeleteRecipe = async (id: string) => {
    try {
      await deleteRecipe(id).unwrap();
      // No need to refresh the list as the API has invalidateTags
    } catch (error) {
      console.error('Error deleting recipe:', error);
    }
  };

  // Modal component
  const recipeModal = (
    <Modal
      title="Create New Recipe"
      open={isModalVisible}
      onCancel={handleCancel}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleCreateRecipe}
      >
        <Form.Item
          name="recipeName"
          label="Recipe Name"
          rules={[{ required: true, message: 'Please enter the recipe name' }]}
        >
          <Input 
            prefix={<FiSearch />} 
            placeholder="Enter recipe name" 
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isCreating}>
            Create Recipe
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );

  const renderSkeleton = () => {
    return (
      <Row gutter={[24, 24]}>
        {[1, 2, 3, 4].map(idx => (
          <Col xs={24} sm={12} md={8} lg={6} key={idx}>
            <Card>
              <Skeleton.Image style={{ width: '100%', height: 180 }} active />
              <Skeleton active paragraph={{ rows: 2 }} />
            </Card>
          </Col>
        ))}
      </Row>
    );
  };

  return (
    <div className="recipe-home-container">
      {/* Hero Section with Search */}
      <div className="recipe-search-hero">
        <div className="recipe-search-content">
          <Title level={2} style={{ color: 'white', marginBottom: '20px' }}>Hungry for something healthy?</Title>
          
          <div className="chat-container">
            <div className="chat-header">
              <Avatar src={defaultImage} style={{ marginRight: '12px' }} />
              <div>
                <Text strong>Ask me anything!</Text>
                <Text style={{ display: 'block', fontSize: '14px', color: '#666' }}>I'll find the perfect recipe for you</Text>
              </div>
            </div>
            
            <Search
              placeholder="What recipe are you looking for?"
              enterButton={<FiSearch />}
              size="large"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onSearch={handleSearch}
              style={{ marginBottom: '16px' }}
            />
            
            <div>
              <Text style={{ display: 'block', fontSize: '14px', marginBottom: '8px' }}>Try searching:</Text>
              <div className="search-suggestions">
                {searchSuggestions.map(suggestion => (
                  <Tag 
                    key={suggestion.id} 
                    className="search-suggestion-tag"
                    onClick={() => handleSuggestionClick(suggestion.text)}
                  >
                    {suggestion.text}
                  </Tag>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* My Recipes Section */}
      <div className="my-recipes-section">
        <div className="page-header">
          <Title level={3}>My Recipes</Title>
          <Button 
            type="primary" 
            icon={<FiEdit2 />}
            onClick={showModal}
            loading={isCreating}
          >
            Create New Recipe
          </Button>
        </div>
        
        {isLoading ? (
          renderSkeleton()
        ) : error ? (
          <div className="error-container">
            <Title level={4}>Error Loading Recipes</Title>
            <Text type="danger">{(error as any).message}</Text>
            <Button type="primary">Try Again</Button>
          </div>
        ) : !recipes || recipes.length === 0 ? (
          <div className="empty-recipes">
            <Empty
              description="You haven't created any recipes yet"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
            <Button 
              type="primary" 
              style={{ marginTop: 16 }}
              onClick={showModal}
              loading={isCreating}
            >
              Create Your First Recipe
            </Button>
          </div>
        ) : (
          <Row gutter={[24, 24]}>
            {recipes.map((recipe: Recipe) => (
              <Col xs={24} sm={12} md={8} lg={6} key={recipe.id}>
                <Card 
                  hoverable
                  cover={
                    <div className="recipe-image-container">
                      <img 
                        alt={recipe.title} 
                        src={recipe.image_url || defaultImage} 
                        className="recipe-image"
                      />
                    </div>
                  }
                  className="recipe-card"
                  extra={
                    <Dropdown
                      overlay={
                        <Menu>
                          <Menu.Item key="delete">
                            <Popconfirm
                              title="Are you sure you want to delete this recipe?"
                              onConfirm={() => handleDeleteRecipe(recipe._id)}
                              okText="Yes"
                              cancelText="No"
                            >
                              <div style={{ color: 'red' }}>
                                <FiTrash2 style={{ marginRight: '8px' }} />
                                Delete
                              </div>
                            </Popconfirm>
                          </Menu.Item>
                        </Menu>
                      }
                      trigger={['click']}
                    >
                      <FiMoreVertical style={{ cursor: 'pointer' }} />
                    </Dropdown>
                  }
                >
                  <Link 
                    to={`/dashboard/airesponse/${recipe._id}`} 
                    style={{ textDecoration: 'none' }}
                  >
                    <Title level={4} className="recipe-title">{recipe.title}</Title>
                    <div className="recipe-meta">
                      {recipe.cookTime && (
                        <span><FiClock /> {recipe.cookTime}</span>
                      )}
                      {recipe.rating && (
                        <span><FiStar /> {recipe.rating}</span>
                      )}
                    </div>
                    {recipe.description && (
                      <Text className="recipe-description">{recipe.description}</Text>
                    )}
                  </Link>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>
      
      {recipeModal}
    </div>
  );
}

export default RecipeSearchHome; 