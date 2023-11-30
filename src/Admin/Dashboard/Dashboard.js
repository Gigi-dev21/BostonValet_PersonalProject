import React, { useContext, useEffect, useState } from "react";
import "./dashboard.css";
import logo from "../../Resources/Images/bostonValetLogo.png";
import Header from "../../Header/Header";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { useNavigate } from "react-router-dom";
import ViewData from "./ViewData";
import { StateContext } from "../../stateprovider/Stateprovider";

function Dashboard() {
  let navigate = useNavigate();
  const [{ user }, dispatch] = useContext(StateContext);
  // Check if there is no user, and handle accordingly

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="Dashboard">
      <Header />
      <div className="sidebar">
        {" "}
        <div>
          <div
            className="dd"
            onClick={() => {
              navigate("/createemployee");
            }}
          >
            <div>Create Users</div>
            <KeyboardArrowRightIcon className="arrows" />
          </div>
          <div
            className="dd"
            onClick={() => {
              navigate("/dashboard/employeelist");
            }}
          >
            <div href="/tables">View Employee Lists</div>
            <KeyboardArrowRightIcon className="arrows" />
          </div>{" "}
          <div
            className="dd"
            onClick={() => {
              navigate("/dashboard/places");
            }}
          >
            <div>View Places</div>
            <KeyboardArrowRightIcon className="arrows" />
          </div>
          {/* <div
            className="dd"
            onClick={() => {
              navigate("/dashboard/data");
            }}
          >
            <div>View Data</div>
            <ArrowForwardIosIcon className="arrows" />
          </div> */}
          <ViewData />
        </div>
        {/* <div className="sidebar_data">hiiii</div> */}
      </div>
    </div>
  );
}

export default Dashboard;
