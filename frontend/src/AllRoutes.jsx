import React from 'react'
import {Routes,Route} from 'react-router-dom';
import About from './About'
import Navbar from './components/navbar';

const AllRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path='/about' element={< About/>}/>
      </Routes>
    </div>
  )
}

export default AllRoutes
