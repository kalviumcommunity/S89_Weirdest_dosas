import React from 'react'
import {Routes,Route} from 'react-router-dom';
import About from './About'
import Navbar from './components/navbar';
import AddEntityPage from './components/AddEntityPage';
import EditEntityPage from './components/EditEntityPage';

const AllRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path='/about' element={< About/>}/>
        <Route path='/add-entity' element={<AddEntityPage/>}/>
        <Route path='/edit-entity/:id' element={<EditEntityPage/>}/>
      </Routes>
    </div>
  )
}

export default AllRoutes
