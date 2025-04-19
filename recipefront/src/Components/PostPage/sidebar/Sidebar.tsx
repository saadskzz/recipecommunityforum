import { useState } from 'react'
import './sidebar.css'
import { Link } from 'react-router-dom'
import { FiHome, FiBookmark, FiUsers, FiUser, FiSettings, FiBook, FiHeart, FiMessageCircle } from 'react-icons/fi'
import { MdOutlineFoodBank } from 'react-icons/md'

function Sidebar() {
  const [activeItem, setActiveItem] = useState<string>('Home')

  const handleItemClick = (item: string) => {
    setActiveItem(item)
  }

  const navItems = [
    { name: 'Home', icon: <FiHome size={20} />, path: '/dashboard/home' },
    { name: 'Discover Recipes', icon: <MdOutlineFoodBank size={20} />, path: '/dashboard/forum/allposts' },
    { name: 'My Cookbook', icon: <FiBook size={20} />, path: '/dashboard/userrecipes' },
    { name: 'Favorites', icon: <FiHeart size={20} />, path: '/dashboard/forum/bookmarkposts' },
    { name: 'Following', icon: <FiUsers size={20} />, path: '/dashboard/forum/followed' },
    { name: 'Community', icon: <FiMessageCircle size={20} />, path: '/dashboard/forum' },
    { name: 'Profile', icon: <FiUser size={20} />, path: '/dashboard/profile' },
  ]

  return (
    <aside className="sidebar">
      <div className='sidebar-content'>
        <header className='sidebar-head'>
          <MdOutlineFoodBank size={24} />
          <div className='sidebar-p'>
            <p>Recipe Community</p>
          </div>
        </header>
        <main className='sidebar-main'>
          <nav className='nav-menu'>
            {navItems.map((item) => (
              <Link to={item.path} key={item.name}>
                <div 
                  className={`sidebar-item ${activeItem === item.name ? 'active' : ''}`}
                  onClick={() => handleItemClick(item.name)}
                >
                  <span className="item-icon">{item.icon}</span>
                  <span className="item-name">{item.name}</span>
                </div>
              </Link>
            ))}
          </nav>
        </main>
      </div>
      <div className='settings'>
        <Link to={'/dashboard/settings'}>
          <div className="sidebar-item">
            <span className="item-icon"><FiSettings size={20} /></span>
            <span className="item-name">Settings</span>
          </div>
        </Link>
      </div>
    </aside>
  )
}

export default Sidebar