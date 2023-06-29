import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav>
      <ul>
        <Link to="/login">Login</Link>
      </ul>
      <ul>
        <Link to="/signup">Signup</Link>
      </ul>
    </nav>
  );
};

export default Navbar;
