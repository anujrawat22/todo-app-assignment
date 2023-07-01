import React from 'react'
import { Link } from 'react-router-dom'

function UserNavbar() {
  return (
    <nav>
      <ul>
        <Link to="/tasks">Login</Link>
      </ul>
      <ul>
        <Link to="/login">Login</Link>
      </ul>
      <ul>
        <Link to="/signup">Signup</Link>
      </ul>
    </nav>
  )
}

export default UserNavbar