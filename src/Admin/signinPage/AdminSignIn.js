import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

import "./adminsignin.css";

function AdminSignIn() {
  let navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signIn = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        if (userCredential) navigate("/adminsignin/dashboard");
      })
      .catch((error) => alert(error.message));
  };

  // const register = (e) => {
  //   e.preventDefault();
  //   createUserWithEmailAndPassword(auth, email, password)
  //     .then((userCredential) => {
  //       if (userCredential) navigate("/");
  //     })
  //     .catch((error) => {
  //       const errorMessage = error.message;
  //       alert(errorMessage);
  //     });
  // };

  return (
    <div className="adminSignIn">
      <div className=" container login_container">
        <div>
          {" "}
          <h1>Login</h1>
          <br />
          <Form.Control
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <br />
          <Form.Control
            type="text"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <Button variant="primary" onClick={signIn}>
            Login
          </Button>
          {/* <button className="login_register_Button" onClick={register}>
            Create your Amazon account
          </button> */}
        </div>
      </div>
    </div>
  );
}

export default AdminSignIn;
