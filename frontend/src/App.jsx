import { useState } from 'react'
import './App.css'
import { BrowserRouter } from 'react-router-dom'
import AllRoutes from './AllRoutes'
function App() {

  return (
    <>
    <BrowserRouter>
    <AllRoutes/>
    </BrowserRouter>

    </>
  )
}

export default App
8