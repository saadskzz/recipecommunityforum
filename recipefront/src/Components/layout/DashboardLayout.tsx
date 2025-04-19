import Sidebar from '../PostPage/sidebar/Sidebar'
import { Outlet } from 'react-router-dom'
import './dashboardlayout.css'
import { useState } from 'react'
import { Input } from 'antd'

const { Search } = Input

const DashboardLayout = () => {
  const [searchValue, setSearchValue] = useState('')

  const handleSearch = (value: string) => {
    console.log('Search:', value)
    setSearchValue(value)
  }

  return (
    <div className='pageContainer'>
      <div className='sidebar-container'>
        <Sidebar/>
      </div>
      <div className='content-container'>
        <header className='dashboard-header'>
          <div className='logo-section'>
            <h1>RecipeCommunity</h1>
          </div>
          <div className='search-section'>
            <Search 
              placeholder="Search for recipes..." 
              allowClear 
              enterButton="Search" 
              size="large" 
              onSearch={handleSearch} 
              style={{ width: 400 }}
            />
          </div>
          <div className='header-actions'>
            <button className='create-recipe-btn'>+ New Recipe</button>
          </div>
        </header>
        <main className='main-content'>
          <Outlet/>
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout