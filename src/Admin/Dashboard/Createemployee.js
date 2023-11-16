import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import randomstring from "randomstring";
import Header from "../../Header/Header";

function Createemployee() {
  let navigate = useNavigate();

  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  //CREATES UNIQUE ID//
  function generateUserId() {
    const { v4: uuidv4 } = require("uuid");
    return uuidv4();
  }

  // HANDLES CREATE USERNAME AND PASSWORD BUTTON///
  const handleGenerateCredentials = () => {
    // Generate a random number
    const randomNum = Math.floor(1000 + Math.random() * 9000); // Generates a 4-digit random number

    // Combine the user's name with the random number to create the username
    const generatedUsername = `${name}${randomNum}`;

    // Generate a random password
    const randomPassword = randomstring.generate(12); // Change the length as needed

    // Update the username and password in state
    setUsername(generatedUsername);
    setPassword(randomPassword);
  };

  // HANDLES THE CREATE BUTTON///
  const handleRegister = () => {
    const userId = generateUserId();

    const user = {
      name: name,
      username: username,
      password: password,
      lastname: lastName,
    };

    // Function to check if a user with the same first name and last name already exists
    const checkUserExists = async (firstName, lastName) => {
      const usersSnapshot = await db.collection("users").get();

      return usersSnapshot.docs.some((doc) => {
        const userData = doc.data();
        return userData.name === firstName && userData.lastname === lastName;
      });
    };

    // Check if a user with the same first name and last name already exists
    checkUserExists(user.name, user.lastname).then((userExists) => {
      if (userExists) {
        alert("User with the same first name and last name already exists.");
        return; // Stop further execution
      }
      db.collection("users")
        .doc(userId)
        .set(user)
        .then(() => {
          alert("User registered successfully.");
          navigate("/adminsignin/dashboard");
        })
        .catch((error) => {
          console.error("Error registering user:", error);
        });
    });
  };

  return (
    <div>
      <Header />
      <div className="createemployee">
        <div className=" container login_container ">
          <div>
            <h1>Create employee</h1>
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
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default Createemployee;
