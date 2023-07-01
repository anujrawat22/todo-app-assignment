import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.module.css";
const Navbar = () => {
  return (
    <nav>
      <div id="logo">
        <img src='./images/png-transparent-todo-sketch-note-list-tasks-thumbnail.png' alt="" />
      </div>
      <ul>
        <li>
          <Link to="/login" className="link">
            Login
          </Link>
        </li>

        <li>
          <Link to="/signup" className="link">
            Signup
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
