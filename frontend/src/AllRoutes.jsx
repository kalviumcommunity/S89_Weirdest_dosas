import React from 'react'
import {Routes,Route} from 'react-router-dom';
import About from './About'

const AllRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={< About/>}/>
      </Routes>
    </div>
  )
}

export default AllRoutes
