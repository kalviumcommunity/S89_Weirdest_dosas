import React from 'react'
import {Routes,Route} from 'react-router-dom';
import About from './About'
import AddEntityPage from './components/AddEntityPage';
import EditEntityPage from './components/EditEntityPage';
import Login from './Login';
import SignUp from './signUp';
import UserData from './UserData';
import Home from './Home';


const AllRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/about' element={<About/>}/>
        <Route path='/add-entity' element={<AddEntityPage/>}/>
        <Route path='/edit-entity/:id' element={<EditEntityPage/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<SignUp/>}/>
        <Route path='/users' element={<UserData/>}/>
      </Routes>
    </div>
  )
}

export default AllRoutes
