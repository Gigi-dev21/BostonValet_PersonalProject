import React, { useContext, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { db, auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import randomstring from "randomstring";
import Header from "../../Header/Header";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { StateContext } from "../../stateprovider/Stateprovider";

function Createemployee() {
  let navigate = useNavigate();
  const [{ user }, dispatch] = useContext(StateContext);

  const [name, setName] = useState("");
  const [lastname, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [errors, setErrors] = useState("");

  const handleUserChange = (event) => {
    setSelectedUser(event.target.value);
  };

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  const randomstring = require("randomstring");
  // HANDLES CREATE USERNAME AND PASSWORD BUTTON///
  const handleGenerateCredentials = () => {
    // Generate a random number
    const randomNum = Math.floor(1000 + Math.random() * 9000); // Generates a 4-digit random number

    // Combine the user's name with the random number to create the username
    const generatedUsername = `${name}${lastname}${randomNum}`;

    // Generate a random password with a mix of uppercase letters, lowercase letters, numbers, and special characters
    const randomPassword = randomstring.generate({
      length: 12, // Change the length as needed
      charset:
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+",
    });

    // Update the username and password in state
    setUsername(generatedUsername);
    setPassword(randomPassword);
  };

  const checkEmailExists = async (email) => {
    // Replace with your logic to check if the email already exists
    const snapshot = await db
      .collection("users")
      .where("email", "==", email)
      .get();
    return !snapshot.empty;
  };

  const checkUsernameExists = async (username) => {
    // Replace with your logic to check if the username already exists
    const snapshot = await db
      .collection("users")
      .where("username", "==", username)
      .get();
    return !snapshot.empty;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (
      userEmail === "" ||
      name === "" ||
      lastname === "" ||
      password === "" ||
      selectedUser === ""
    ) {
      setErrors("Please enter all the required fields");
      return;
    }

    try {
      // Check if email already exists
      const emailExists = await checkEmailExists(userEmail);
      if (emailExists) {
        setErrors("Email already exists. Please use a different email.");
        return;
      }

      // Check if username already exists
      const usernameExists = await checkUsernameExists(username);
      if (usernameExists) {
        setErrors(
          "Username already exists. Please choose a different username."
        );
        return;
      }

      // Proceed with user registration
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userEmail,
        password
      );

      if (userCredential) {
        const userData = {
          name: name,
          lastName: lastname,
          username: username,
          email: userEmail,
          role: selectedUser === "1" ? "admin" : "employee",
        };
        // userCredential.user.uid create a unique identifier?/////
        await db.collection("users").doc(userCredential.user.uid).set(userData);

        console.log("User registered successfully!");
        navigate("/dashboard");
      }
    } catch (error) {
      const errorMessage = error.message;
      alert(errorMessage);
    }
  };

  return (
    <div className=" ">
      <Header />
      <div className="createemployee">
        <div className=" container login_containerS ">
          <div className="signin_box">
            <h1>Create Users</h1>
            <br />
            <div className="flieds">*All fields are required</div>
            <Form.Select
              aria-label="Default select example"
              onChange={handleUserChange}
              value={selectedUser}
            >
              <option>Select Role</option>
              <option value="1" className="roles">
                Admin
              </option>
              <option value="2" className="roles">
                Employee
              </option>
            </Form.Select>
            <br />
            <Form.Control
              type="text"
              placeholder="First Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <br />

            <Form.Control
              type="text"
              placeholder="Last Name"
              value={lastname}
              onChange={(e) => setLastName(e.target.value)}
            />

            <br />
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
            />
            <br />
            <Form.Control
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <br />
            <Form.Control
              type="text"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <br />
            {/* <button type="button" onClick={handleGenerateCredentials}>
            Generate
          </button> */}
            <div className="generateButtons">
              <div>
                <Button variant="primary" onClick={handleGenerateCredentials}>
                  Generate username and password
                </Button>
              </div>
              <br />
              <div>
                {" "}
                <Button variant="primary" onClick={handleRegister}>
                  Create
                </Button>
              </div>
            </div>
            <div className="errors" style={{ paddingTop: "10px" }}>
              {" "}
              {errors}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Createemployee;
