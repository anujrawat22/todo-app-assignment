import React from 'react'
import { Route,  Routes } from 'react-router-dom'
import Tasks from '../pages/Tasks'
import Login  from '../pages/Login'
import Signup from '../pages/Signup'

const AllRoutes = () => {
  return (
  <Routes>
    <Route path='/taks'  element={<Tasks/>}/>
    <Route path='/login' element={<Login/>}  />
    <Route path='/signup' element={<Signup/>} />
  </Routes>
  )
}

export default AllRoutes