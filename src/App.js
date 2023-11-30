import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./Home/Home";
import "./Resources/bootstrap.css";
import Resturants from "./Resturants/Resturants";
// import AdminSignIn from "./Admin/signinPage/AdminSignIn";
import SignIn from "./Employee/Signin/SignIn";
import Dashboard from "./Admin/Dashboard/Dashboard";
import Createemployee from "./Admin/Dashboard/Createemployee";
import Table from "./Admin/Dashboard/Table";
import Forms from "./Employee/Form/Forms";
import EmployeeLists from "./Admin/Dashboard/EmployeeLists";
import Data from "./Admin/Dashboard/Data";
import Places from "./Admin/Dashboard/Places";
import { useContext, useEffect, useState } from "react";
import Header from "./Header/Header";
import Error from "./error/Error";
import { useLocation } from "react-router-dom";
import { auth } from "./firebase";
import { useStateValue } from "./stateprovider/Stateprovider";
import { useNavigate } from "react-router-dom";

function App() {
  const location = useLocation();
  let navigate = useNavigate();
  const [{ user }, dispatch] = useStateValue();

  // useEffect(() => {
  //   // will only run once when the app component loads...

  //   // Initially set the user state to null
  //   dispatch({
  //     type: "SET_USER",
  //     user: null,
  //   });

  //   // Listen for changes in authentication state
  //   const unsubscribe = auth.onAuthStateChanged((authUser) => {
  //     console.log("THE USER IS >>> ", authUser);

  //     if (authUser) {
  //       // the user just logged in / the user was logged in

  //       dispatch({
  //         type: "SET_USER",
  //         user: authUser,
  //       });
  //     } else {
  //       dispatch({
  //         type: "SET_USER",
  //         user: null,
  //       });
  //     }
  //   });

  //   // Cleanup function to unsubscribe from the listener when the component unmounts
  //   return () => {
  //     unsubscribe();
  //   };
  // }, []);
  useEffect(() => {
    console.log("Before useEffect");
    // ... existing code

    // Add console logs within the useEffect
    const storedUser = JSON.parse(localStorage.getItem("user"));
    console.log("Stored User:", storedUser);
    console.log("Current User:", user);

    if (storedUser && storedUser !== user) {
      console.log("Updating User State");
      dispatch({
        type: "SET_USER",
        user: storedUser,
      });
    }
  }, [dispatch]);

  return (
    <div className="App">
      <Routes>
        {/* <Route path="/" element={<Home />}></Route> */}
        {/* <Route path="/adminsignin" element={<AdminSignIn />}></Route> */}
        <Route path="/error" element={<Error />}></Route>
        <Route
          path="/dashboard"
          element={
            <>
              <Dashboard />
            </>
          }
        ></Route>
        <Route
          path="/dashboard/employeelist"
          element={<EmployeeLists />}
        ></Route>
        <Route
          path="/dashboard/display/:year/:place"
          element={<Data />}
        ></Route>
        <Route path="/dashboard/places" element={<Places />}></Route>
        <Route path="/createemployee" element={<Createemployee />}></Route>
        <Route path="/tables" element={<Table />}></Route>

        <Route path="/" element={<SignIn />}></Route>
        <Route
          path="/form"
          element={
            <>
              <Header />
              <Forms />
            </>
          }
        ></Route>
      </Routes>
    </div>
  );
}

export default App;
