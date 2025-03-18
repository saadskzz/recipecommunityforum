import './App.css'
import Login from './Components/Auth/Login'
import SignUp from './Components/Auth/SignUp'
import { Provider } from 'react-redux'
import store from './store/store'
import {  Route, Routes, Navigate } from 'react-router-dom'
import ForumPage from './Components/PostPage/Forum/ForumPage'
import ProtectedRoute from './Components/ProtectedRoute'
import Profile from './Components/Profile/Profile'
import ProfileWhole from './Components/Profile/ProfileWhole'
import MyPosts from './Components/PostPage/Post/myPosts'
import DashboardLayout from './Components/layout/DashboardLayout'
import GetPosts from './Components/PostPage/Post/getPosts'
import FollowedPost from './Components/PostPage/Post/FollowedPost'
import BookmarkedPosts from './Components/PostPage/Post/BookmarkedPosts'

function App() {
  return (
    <Provider store={store}>
      
        <Routes>
          <Route path='/signup' element={ <SignUp/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/dashboard' element={<ProtectedRoute><DashboardLayout/></ProtectedRoute>}>
          
          <Route path='forum' element={<ForumPage />} >
          <Route path='allposts' element={<GetPosts/>}/>
          <Route path='followed' element={<FollowedPost/>}/>
          <Route path='bookmarkposts' element={<BookmarkedPosts/>}/>
          </Route>
          <Route path='profile' element={<ProfileWhole/>}/>
      
          </Route>
        
          <Route path='/' element={<Navigate to="/login" />} />
          
         


       </Routes>
    
    </Provider>
  )
}

export default App
