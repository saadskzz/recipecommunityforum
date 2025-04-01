import { useState } from 'react'
import './sidebar.css'
import { HomeFilled, HomeTwoTone, SettingOutlined, SettingTwoTone } from '@ant-design/icons'
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
         <Link to={'/dashboard/home'}>   <p 
              onClick={() => handleItemClick('Home')} 
              style={{background: activeItem === 'Home' ? "#CABED90A" : "",color:activeItem === 'Home' ? "white" : "#FFFFFF80"}}
            >
              Home
            </p></Link>
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
            <div className='sidebar-handle'>
       <Link to={'/dashboard/userrecipes'}>     <p 
              onClick={() => handleItemClick('User recipes')} 
              style={{background: activeItem === 'User recipes' ? "#CABED90A" : "",color:activeItem === 'User recipes' ? "white" : "#FFFFFF80"}}
            >
              User recipes
            </p> </Link>
            </div>
          </div>
        </main>
      
      </div>
      <div className='settings'>
     <Link to={'/dashboard/settings'}> <p> <SettingTwoTone twoToneColor={'white'}/><span style={{marginLeft:5}}> Settings</span></p>
     </Link>  
      </div>
    </aside>
  )
}

export default Sidebar