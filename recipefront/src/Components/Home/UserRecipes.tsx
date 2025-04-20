import { Link, useNavigate } from 'react-router-dom';
import { useGetUsersRecipeQuery, useCreateRecipeMutation } from '../../Slices/recipeApi';
import defaultImage from '../../../initialprofile.jpg';
import { Card, Row, Col, Typography, Skeleton, Empty, Button, Modal, Input, Form } from 'antd';
import { FiEdit2, FiClock, FiStar, FiSearch } from 'react-icons/fi';
import './recipe.css';
import { useState } from 'react';

const { Title, Text } = Typography;

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

function UserRecipes() {
  const { data: recipes, isLoading, error } = useGetUsersRecipeQuery(undefined);
  const [createRecipe, { isLoading: isCreating }] = useCreateRecipeMutation();
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

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

  // Modal component - positioned outside all conditional returns
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

  if (isLoading) return (
    <>
      {renderSkeleton()}
      {recipeModal}
    </>
  );
  
  if (error) return (
    <>
      <div className="error-container">
        <Title level={4}>Error Loading Recipes</Title>
        <Text type="danger">{(error as any).message}</Text>
        <Button type="primary">Try Again</Button>
      </div>
      {recipeModal}
    </>
  );
  
  if (!recipes || recipes.length === 0) return (
    <>
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
      {recipeModal}
    </>
  );

  return (
    <div className="my-recipes-container">
      <div className="page-header">
        <Title level={2}>My Recipes</Title>
        <Button 
          type="primary" 
          icon={<FiEdit2 />}
          onClick={showModal}
          loading={isCreating}
        >
          Create New Recipe
        </Button>
      </div>

      <Row gutter={[24, 24]}>
        {recipes.map((recipe: Recipe) => (
          <Col xs={24} sm={12} md={8} lg={6} key={recipe.id}>
            <Link 
              to={`/dashboard/airesponse/${recipe._id}`} 
              style={{ textDecoration: 'none' }}
            >
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
              </Card>
            </Link>
          </Col>
        ))}
      </Row>

      {recipeModal}
    </div>
  );
}

export default UserRecipes;
