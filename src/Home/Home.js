import React from "react";
import "./home.css";
import logo from "../Resources/Images/bostonValetLogo.png";
import { Link, useNavigate } from "react-router-dom";
function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">
      <div className="logo-container">
        <div className="logo">
          <img className="logoImage" src={logo} alt="" />
          <h1></h1>
          <button
            className="adminbutton button"
            onClick={() => {
              navigate("/adminsignin");
            }}
          >
            Admin
          </button>
          <button
            className="button"
            onClick={() => {
              navigate("/employeesignin");
            }}
          >
            Employee
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
