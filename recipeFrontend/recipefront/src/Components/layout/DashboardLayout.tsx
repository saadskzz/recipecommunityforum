import Sidebar from '../PostPage/sidebar/Sidebar'
import { Outlet } from 'react-router-dom'
import './dashboardlayout.css'

const DashboardLayout = () => {
  return (
    <div className='pageContainer'>
        <div>
         <Sidebar/>
         </div>
         <div className='main-content'>
            <Outlet/>
         </div>
    </div>
  )
}

export default DashboardLayout