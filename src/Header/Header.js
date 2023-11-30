import React, { useContext, useEffect, useState } from "react";
import logo from "../Resources/Images/bostonValetLogo.png";
import "./header.css";
import Button from "react-bootstrap/Button";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { StateContext } from "../stateprovider/Stateprovider";

function Header() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [{ user }, dispatch] = useContext(StateContext);

  const signOut = () => {
    auth
      .signOut()
      .then(() => {
        // Dispatch an action to reset the user in the global state
        dispatch({
          type: "SET_USER",
          user: null,
        });

        // Redirect or perform other actions after sign-out
        navigate("/"); // Replace "/login" with your desired redirect path
      })
      .catch((error) => {
        // console.error("Error signing out:", error);

        // Handle the error, for example, set an error state
        setError("Error signing out. Please try again.");
      });
  };

  return (
    <div>
      <div className="header">
        <div className="header_container container">
          <img className="headerlogoImage" src={logo} alt="" />

          <Button variant="primary" onClick={signOut}>
            Logout
          </Button>
          {error}
        </div>
      </div>
    </div>
  );
}

export default Header;
