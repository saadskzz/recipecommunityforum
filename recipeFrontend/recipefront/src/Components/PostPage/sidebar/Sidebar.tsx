import { useState } from 'react'
import './sidebar.css'
import { HomeFilled, HomeTwoTone } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import Home from '../../../../Home.svg'

function Sidebar() {
  const [activeItem, setActiveItem] = useState<string>('Forum')

  const handleItemClick = (item: string) => {
    setActiveItem(item)
  }

  return (
    <aside className="sidebar">
      <div className='sidebar-content'>
        <header className='sidebar-head' style={{ color: 'white' }}>
       <img src={Home} alt="home pic" style={{ fontSize: 20, color: 'white',marginLeft:5,marginRight:5 }} />   
          <div className='sidebar-p'>
            <p>pVSE</p>
            <p>--</p>
          </div>
        </header>
        <main className='sidebar-main'>
          <div style={{backgroundColor:'#CABED90A'}}>
           <div className='sidebar-handle'  >
            <p 
              onClick={() => handleItemClick('Home')} 
              style={{background: activeItem === 'Home' ? "#CABED90A" : "",color:activeItem === 'Home' ? "white" : "#FFFFFF80"}}
            >
              Home
            </p>
            </div>
            <div className='sidebar-handle'>
       <Link to={'/dashboard/forum/allposts'}>     <p 
              onClick={() => handleItemClick('Forum')} 
              style={{background: activeItem === 'Forum' ? "#CABED90A" : "",color:activeItem === 'Forum' ? "white" : "#FFFFFF80"}}
            >
              Forum
            </p> </Link>
            </div>
            <div className='sidebar-handle'>
      <Link to={'/dashboard/profile'}>      <p 
              onClick={() => handleItemClick('Your profile')} 
              style={{background: activeItem === 'Your profile' ? "#CABED90A" : "",color:activeItem === 'Your profile' ? "white" : "#FFFFFF80"}}
            >
              Your profile
            </p> </Link></div>
          </div>
        </main>
        {/* Additional content can go here */}
      </div>
    </aside>
  )
}

export default Sidebar