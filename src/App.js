import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./Home/Home";
import "./Resources/bootstrap.css";
import Resturants from "./Resturants/Resturants";
import AdminSignIn from "./Admin/signinPage/AdminSignIn";
import EmployeeSignin from "./Employee/Signin/EmployeeSignin";
import Dashboard from "./Admin/Dashboard/Dashboard";
import Createemployee from "./Admin/Dashboard/Createemployee";
import Table from "./Admin/Dashboard/Table";
import Forms from "./Employee/Form/Forms";
import EmployeeLists from "./Admin/Dashboard/EmployeeLists";
import Data from "./Admin/Dashboard/Data";
import Places from "./Admin/Dashboard/Places";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/adminsignin" element={<AdminSignIn />}></Route>
        <Route path="/adminsignin/dashboard" element={<Dashboard />}></Route>
        <Route
          path="/dashboard/employeelist"
          element={<EmployeeLists />}
        ></Route>
        <Route path="/dashboard/data" element={<Data />}></Route>
        <Route path="/dashboard/places" element={<Places />}></Route>
        <Route path="/createemployee" element={<Createemployee />}></Route>
        <Route path="/tables" element={<Table />}></Route>
        <Route path="/employeesignin" element={<EmployeeSignin />}></Route>
        <Route path="/employeesignin/form" element={<Forms />}></Route>
      </Routes>
    </div>
  );
}

export default App;
