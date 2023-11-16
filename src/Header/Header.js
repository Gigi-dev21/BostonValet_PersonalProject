import React from "react";
import logo from "../Resources/Images/bostonValetLogo.png";
import "./header.css";
import Button from "react-bootstrap/Button";

function Header() {
  return (
    <div>
      <div className="header">
        <div className="header_container container">
          <img className="headerlogoImage" src={logo} alt="" />

          <Button variant="primary">Logout</Button>
        </div>
      </div>
    </div>
  );
}

export default Header;
