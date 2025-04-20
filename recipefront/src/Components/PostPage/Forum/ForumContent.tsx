import CreatePost from "../Post/CreatePost"
import {ThunderboltFilled, UserOutlined, BookOutlined, AppstoreOutlined} from '@ant-design/icons'
import './forumContent.css'
import CategoryCard from "../DiscussionCategory/CategoryCard"
import { useState } from "react"
import GetPosts from "../Post/GetPosts"
import FollowedPost from "../Post/FollowedPost"
import BookmarkedPosts from "../Post/BookmarkedPosts"

function ForumContent() {
    const [activeItem, setActiveItem] = useState<string>('allposts')
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

    const handleItemClick = (item: string) => {
      setActiveItem(item)
      // Reset category selection when switching tabs
      setSelectedCategory(null)
    }
    
    const handleCategorySelect = (categoryId: string) => {
      setSelectedCategory(categoryId === selectedCategory ? null : categoryId)
    }
  
  return (
    <div className="forum-container">
      <div className="forum-header-section">
        <h1 className="forum-title">Recipe Community Forum</h1>
        
        <div className="tab-navigation">
          <div 
            className={`nav-tab ${activeItem === 'allposts' ? 'active-nav-tab' : ''}`}
            onClick={() => handleItemClick('allposts')}>
            <ThunderboltFilled /> All Posts
          </div>
          
          <div 
            className={`nav-tab ${activeItem === 'followed' ? 'active-nav-tab' : ''}`}
            onClick={() => handleItemClick('followed')}>
            <UserOutlined /> Followed
          </div>
          
          <div 
            className={`nav-tab ${activeItem === 'bookmarkposts' ? 'active-nav-tab' : ''}`}
            onClick={() => handleItemClick('bookmarkposts')}>
            <BookOutlined /> Bookmarks
          </div>
        </div>
      </div>
      
      <div className="forum-content-wrapper">
        <div className="categories-section">
          <div className="category-header">
            <AppstoreOutlined /> Categories
          </div>
          <CategoryCard onCategorySelect={handleCategorySelect} selectedCategory={selectedCategory} />
        </div>
        
        <div className="main-content">
          <CreatePost/>
          
          <div className="posts-container">
            {activeItem === 'allposts' && <GetPosts categoryId={selectedCategory} />}
            {activeItem === 'followed' && <FollowedPost />}
            {activeItem === 'bookmarkposts' && <BookmarkedPosts />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForumContent