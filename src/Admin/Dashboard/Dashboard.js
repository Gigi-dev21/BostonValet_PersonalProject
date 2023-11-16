import React from "react";
import "./dashboard.css";
import logo from "../../Resources/Images/bostonValetLogo.png";
import Header from "../../Header/Header";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useNavigate } from "react-router-dom";
function Dashboard() {
  let navigate = useNavigate();

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
            <div>Create employee</div>
            <ArrowForwardIosIcon className="arrows" />
          </div>

          <div
            className="dd"
            onClick={() => {
              navigate("/dashboard/employeelist");
            }}
          >
            <div href="/tables">View Employee Lists</div>
            <ArrowForwardIosIcon className="arrows" />
          </div>
          <div
            className="dd"
            onClick={() => {
              navigate("/dashboard/data");
            }}
          >
            <div>View Data</div>
            <ArrowForwardIosIcon className="arrows" />
          </div>
          <div
            className="dd"
            onClick={() => {
              navigate("/dashboard/places");
            }}
          >
            <div>View Places</div>
            <ArrowForwardIosIcon className="arrows" />
          </div>
        </div>
        <div className="sidebar_data">hiiii</div>
      </div>
    </div>
  );
}

export default Dashboard;
