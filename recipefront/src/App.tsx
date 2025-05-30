import './App.css'
import Login from './Components/Auth/Login'
import SignUp from './Components/Auth/SignUp'
import { Provider } from 'react-redux'
import store from './store/store'
import {  Route, Routes, Navigate } from 'react-router-dom'
import ForumPage from './Components/PostPage/Forum/ForumPage'
import ProtectedRoute from './Components/ProtectedRoute'
import { ThemeProvider } from './contexts/ThemeContext'
import ProfileWhole from './Components/Profile/ProfileWhole'

import DashboardLayout from './Components/layout/DashboardLayout'
import GetPosts from './Components/PostPage/Post/GetPosts'
import FollowedPost from './Components/PostPage/Post/FollowedPost'
import BookmarkedPosts from './Components/PostPage/Post/BookmarkedPosts'
import PostByCategory from './Components/PostPage/Post/PostByCategory'
import UserProfile from './Components/Profile/UserProfile'
import HomePage from './Components/Home/ChatPage'
import RecipeSearchHome from './Components/Home/RecipeSearchHome'
import Settings from './Settings/Settings'
import Airesponse from './Components/Home/Airesponse'
import UserRecipes from './Components/Home/UserRecipes'

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <Routes>
          <Route path='/signup' element={ <SignUp/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/dashboard' element={<ProtectedRoute><DashboardLayout/></ProtectedRoute>}>
          <Route path='home' element={<RecipeSearchHome/>}/>
          <Route path='airesponse/:id' element={<Airesponse/>}/>
          <Route path='userrecipes' element={<UserRecipes/>}/>
          <Route path='forum' element={<ForumPage />} >
          
          </Route>
          <Route path='settings' element={<Settings/>}/>
          <Route path='profile' element={<ProfileWhole/>}/>
          <Route path='profile/:userId' element={<UserProfile/>}/>
        
          </Route>
         
          <Route path='/' element={<Navigate to="/login" />} />
        </Routes>
      </ThemeProvider>
    </Provider>
  )
}

export default App
