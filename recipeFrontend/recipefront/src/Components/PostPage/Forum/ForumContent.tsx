import CreatePost from "../Post/CreatePost"
import GetPosts from "../Post/getPosts"
import {ThunderboltFilled,UserOutlined,BookFilled,BookOutlined} from '@ant-design/icons'
import './forumContent.css'
import CategoryCard from "../DiscussionCategory/CategoryCard"
import { ArrowUpward } from "@mui/icons-material"
import { Link, Outlet } from "react-router-dom"
import { useState } from "react"

function ForumContent() {
    const [activeItem, setActiveItem] = useState<string>('allposts')

  const handleItemClick = (item: string) => {
    setActiveItem(item)
  }
  return (
    <div style={{display:'flex'}}>
      <div className="forumContent-post">
        <h1>Forum</h1>
       
       <CreatePost/>
        <h1>Posts</h1>
        <Outlet />
      </div>
      <div style={{display:'flex',flexDirection:'column'}}>
        <div className="content-select">
          <Link to={'allposts'}>
            <p onClick={() => handleItemClick('allposts')} 
               style={{color: activeItem === 'allposts' ? "#773CBD" : "#142139"}}>
              <ThunderboltFilled /> All Post
            </p>
          </Link>
          <Link to={'followed'}>
            <p onClick={() => handleItemClick('followed')}
               style={{color: activeItem === 'followed' ? "#773CBD" : "#142139"}}>
              <UserOutlined /> Followed
            </p>
          </Link>
          <Link to={'bookmarkposts'}>
            <p onClick={() => handleItemClick('bookmarkposts')}
               style={{color: activeItem === 'bookmarkposts' ? "#773CBD" : "#142139"}}>
              <BookOutlined /> Bookmarks
            </p>
          </Link>
        </div>
        <CategoryCard />
      </div>
    </div>
  )
}

export default ForumContent