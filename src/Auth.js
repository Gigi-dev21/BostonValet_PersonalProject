// AuthUtils.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebase";

export const useAuth = () => {
  const [userName, setUserName] = useState("");
  const [lastName, setLastName] = useState("");
  const navigate = useNavigate();

  const handleSignOut = () => {
    // Clear any user-related state
    setUserName("");

    setLastName("");
    // Clear local storage
    localStorage.removeItem("userName");
    localStorage.removeItem("lastName");
    // Redirect to the home page or another appropriate page
    navigate("/employeesignin");
  };

  return { userName, lastName, setUserName, setLastName, handleSignOut };
};
