import React from "react";
import { useNavigate } from "react-router-dom";

import logo from "../../assets/connectify.png";
import "./sass/navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <>
      <nav id="navbar">
        <div className="links">
          <div className="logo" onClick={() => navigate("/")}>
            <img src={logo} alt="connectify" />
          </div>
          <ul>
            <li onClick={() => navigate("/")}>Home</li>
            <li>Products</li>
            <li>About</li>
            <li>Contact us</li>
          </ul>
        </div>
        <div className="buttons">
          <button className="sign-in" onClick={() => navigate("/signin")}>
            Sign in
          </button>
          <button className="sign-up" onClick={() => navigate("/signup")}>
            Sign up
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
