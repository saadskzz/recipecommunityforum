import { Link } from 'react-router-dom';
import { useGetUsersRecipeQuery } from '../../Slices/recipeApi';
import defaultImage from '../../../initialprofile.jpg';
import { Card, Row, Col, Typography, Skeleton, Empty, Button } from 'antd';
import { FiEdit2, FiClock, FiStar } from 'react-icons/fi';
import './recipe.css';

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

  if (isLoading) return renderSkeleton();
  
  if (error) return (
    <div className="error-container">
      <Title level={4}>Error Loading Recipes</Title>
      <Text type="danger">{(error as any).message}</Text>
      <Button type="primary">Try Again</Button>
    </div>
  );
  
  if (!recipes || recipes.length === 0) return (
    <div className="empty-recipes">
      <Empty
        description="You haven't created any recipes yet"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
      <Button type="primary" style={{ marginTop: 16 }}>
        Create Your First Recipe
      </Button>
    </div>
  );

  return (
    <div className="my-recipes-container">
      <div className="page-header">
        <Title level={2}>My Recipes</Title>
        <Button type="primary" icon={<FiEdit2 />}>
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
    </div>
  );
}

export default UserRecipes;
