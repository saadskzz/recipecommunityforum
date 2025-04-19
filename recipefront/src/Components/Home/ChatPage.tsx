import './aistyle.css'
import './recipe.css'
import { useEffect, useState } from 'react'
import { Card, Row, Col, Typography, Tag, Divider, Button } from 'antd'
import { FiClock, FiUser, FiHeart, FiBookmark } from 'react-icons/fi'

const { Title, Text } = Typography

// Mock data - replace with API calls in production
const featuredRecipes = [
  {
    id: 1,
    title: 'Homemade Pizza',
    author: 'ChefMaria',
    description: 'Delicious homemade pizza with a crispy crust and fresh toppings.',
    cookTime: '45 mins',
    likes: 128,
    image: 'https://source.unsplash.com/random/300x200/?pizza'
  },
  {
    id: 2,
    title: 'Chocolate Brownies',
    author: 'DessertKing',
    description: 'Fudgy chocolate brownies that are perfect for any occasion.',
    cookTime: '30 mins',
    likes: 96,
    image: 'https://source.unsplash.com/random/300x200/?brownies'
  },
  {
    id: 3,
    title: 'Vegetable Stir Fry',
    author: 'HealthyEats',
    description: 'Quick and healthy vegetable stir fry with a delicious sauce.',
    cookTime: '20 mins',
    likes: 75,
    image: 'https://source.unsplash.com/random/300x200/?stirfry'
  },
  {
    id: 4,
    title: 'Salmon with Asparagus',
    author: 'SeafoodLover',
    description: 'Perfectly cooked salmon with fresh asparagus and lemon sauce.',
    cookTime: '25 mins',
    likes: 112,
    image: 'https://source.unsplash.com/random/300x200/?salmon'
  }
]

const categories = [
  { name: 'Breakfast', count: 124 },
  { name: 'Lunch', count: 156 },
  { name: 'Dinner', count: 204 },
  { name: 'Desserts', count: 189 },
  { name: 'Vegan', count: 98 },
  { name: 'Quick & Easy', count: 176 }
]

function HomePage() {
  return (
    <div className='home-container'>
      <section className='hero-section'>
        <div className='hero-content'>
          <Title level={1}>Discover & Share Amazing Recipes</Title>
          <Text>Join our community of food lovers and find your next favorite dish</Text>
          <Button type="primary" size="large" className='browse-button'>
            Browse Recipes
          </Button>
        </div>
      </section>

      <section className='featured-section'>
        <div className='section-header'>
          <Title level={3}>Featured Recipes</Title>
          <Button type="link">View All</Button>
        </div>
        
        <Row gutter={[24, 24]}>
          {featuredRecipes.map(recipe => (
            <Col xs={24} sm={12} md={8} lg={6} key={recipe.id}>
              <Card 
                hoverable
                cover={<img alt={recipe.title} src={recipe.image} className="recipe-card-image" />}
                className="recipe-card"
              >
                <Title level={4} className="recipe-title">{recipe.title}</Title>
                <div className="recipe-meta">
                  <span><FiUser /> {recipe.author}</span>
                  <span><FiClock /> {recipe.cookTime}</span>
                </div>
                <Text className="recipe-description">{recipe.description}</Text>
                <div className="recipe-actions">
                  <Button type="text" icon={<FiHeart />}>{recipe.likes}</Button>
                  <Button type="text" icon={<FiBookmark />} />
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      <Divider />

      <section className='categories-section'>
        <Title level={3}>Recipe Categories</Title>
        <div className='categories-container'>
          {categories.map(category => (
            <div className='category-item' key={category.name}>
              <Card hoverable className="category-card">
                <Title level={4}>{category.name}</Title>
                <Text>{category.count} recipes</Text>
              </Card>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default HomePage