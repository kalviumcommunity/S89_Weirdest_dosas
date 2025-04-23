import React from 'react'
import {Routes,Route} from 'react-router-dom';
import About from './About'
import Navbar from './components/navbar';
import AddEntityPage from './components/AddEntityPage';

const AllRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path='/about' element={< About/>}/>
        <Route path='/add-entity' element={<AddEntityPage/>}/>
      </Routes>
    </div>
  )
}

export default AllRoutes
