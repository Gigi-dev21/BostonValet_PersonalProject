import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import "./employesignin.css";
import { useStateValue } from "../../stateprovider/Stateprovider";

function EmployeeSignin() {
  let navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSignIn = (event) => {
    event.preventDefault();

    // Retrieve user data by the entered username
    db.collection("users")
      .where("username", "==", username)
      .get()
      .then((querySnapshot) => {
        if (querySnapshot.size === 1) {
          // User found, now check the password
          querySnapshot.forEach((doc) => {
            const userData = doc.data();
            if (userData.password === password) {
              // Successful sign-in
              // alert("Sign-in successful");
              setUser(userData.name);
              console.log(userData.name);

              setTimeout(() => {
                navigate("/employeesignin/form", {
                  state: { userName: userData.name },
                });
              }, 0);
            } else {
              setError("Invalid password or username");
            }
          });
        } else {
          setError("User not found");
        }
      })
      .catch((error) => {
        console.error("Error during sign-in:", error);
      });
  };

  useEffect(() => {
    if (user) {
      console.log(user);
    }
  }, [user]);

  return (
    <div className="employeeSignin">
      <div className=" container login_container">
        <div>
          {" "}
          <h1>Login</h1>
          <br />
          <Form.Control
            type="text"
            placeholder="Username"
            value={username}
            onChange={handleUsernameChange}
          />
          <br />
          <Form.Control
            type="text"
            value={password}
            placeholder="Password"
            onChange={handlePasswordChange}
          />
          <br />
          {error && <p>{error}</p>}
          <Button variant="primary" onClick={handleSignIn}>
            Login
          </Button>
        </div>
      </div>
    </div>
  );
}

export default EmployeeSignin;
