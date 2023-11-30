import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import "./signin.css";
import logo from "../../Resources/Images/bostonValetLogo.png";
import Header from "../../Header/Header";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useStateValue } from "../../stateprovider/Stateprovider";

function EmployeeSignin() {
  let navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [{}, dispatch] = useStateValue();
  /// TARGETS THE PASSWORD/////
  const handlePasswordChange = (event) => {
    console.log(event.target.value);
    setPassword(event.target.value);
  };
  /// TARGETS THE USERNAME/////
  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };
  //// HANDLES THE SIGN IN BUTTON//////
  const handleSignIn = async (e) => {
    e.preventDefault();
    if (userName == "" || password == "") {
      setError("Please fill out all fields");
      return;
    }
    try {
      // Fetch user data from the database based on the provided username
      const userQuerySnapshot = await db
        .collection("users")
        .where("username", "==", username)
        .get();

      if (!userQuerySnapshot.empty) {
        const userData = userQuerySnapshot.docs[0].data();
        const userEmail = userData.email;

        // Sign in with the retrieved email and password
        signInWithEmailAndPassword(auth, userEmail, password)
          .then((userCredential) => {
            if (userCredential) {
              const user = userCredential.user;
              const userId = user.uid;

              setUserName(userData.name);
              setLastName(userData.lastname);

              // Fetch user data from the database based on the user's UID
              db.collection("users")
                .doc(userId)
                .get()
                .then((doc) => {
                  if (doc.exists) {
                    const userData = doc.data();

                    // Dispatch the user data to the global state
                    dispatch({
                      type: "SET_USER",
                      user: {
                        uid: user.uid,
                        email: user.email,
                        displayName: user.displayName,
                        // Add other user properties from userData as needed
                      },
                    });

                    // Save user data to localStorage for persistence
                    localStorage.setItem("user", JSON.stringify(user));
                    // Log the user data
                    console.log("User Data:", {
                      uid: user.uid,
                      email: user.email,
                      displayName: user.displayName,
                      // Add other user properties from userData as needed
                    });
                    // Check the user role and navigate accordingly
                    const role = userData.role;

                    if (role === "admin") {
                      navigate("/dashboard");
                    } else if (role === "employee") {
                      navigate("/form", {
                        state: {
                          firstName: userData.name,
                          lastName: userData.lastName,
                        },
                      });
                    } else {
                      // Handle other roles or cases as needed
                      // console.error("Unsupported role:", role);
                      setError("Unsupported role");
                    }
                  } else {
                    // console.error("User data not found");
                    setError("User data not found");
                  }
                })
                .catch((error) => {
                  console.error("Error fetching user data:", error);
                  setError("Error fetching data");
                });
            }
          })
          .catch((error) => {
            let errorMessage = "User not found";

            if (error.code === "auth/user-not-found") {
              errorMessage = "User not found";
            }

            if (error.code === "auth/wrong-password") {
              errorMessage = "User not found";
            }

            setError(errorMessage);
          });
      } else {
        setError("User not found.");
      }
    } catch (error) {
      // console.error("Error searching for user:", error);
      setError("Error searching for user");
    }
  };

  return (
    <div className="home">
      <div className="employeeSignin ">
        <div className=" container login_container ">
          <div className="signin_box ">
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
            <div className="errors">{error && <p>{error}</p>}</div>
            <Button variant="primary" onClick={handleSignIn}>
              Login
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeSignin;
