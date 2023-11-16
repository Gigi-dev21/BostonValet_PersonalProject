import React, { useEffect, useState } from "react";
import Header from "../../Header/Header";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";

function EmployeeLists() {
  const [users, setUsers] = useState([]);
  const [employeeCount, setEmployeeCount] = useState(0);

  useEffect(() => {
    // Fetch all users data from the database
    db.collection("users")
      .get()
      .then((querySnapshot) => {
        const userData = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          // Add a validation check for username and password
          if (data.username && data.password) {
            userData.push({ id: doc.id, ...data });
          }
        });
        // Update the component state with all users' data
        setUsers(userData);
        setEmployeeCount(userData.length);
      })
      .catch((error) => {
        console.error("Error fetching users data:", error);
      });
  }, []);

  const handleRemoveCredentials = (userId) => {
    // Update user record in the database to remove username and password
    db.collection("users")
      .doc(userId)
      .update({
        username: null,
        password: null,
      })
      .then(() => {
        // Update the state to remove the user from the list
        setUsers(users.filter((user) => user.id !== userId));
        alert("User removed successfully.");
      })
      .catch((error) => {
        alert("Error removing user");
      });
  };

  return (
    <div className="employeeLists">
      <Header />
      <div className="employeeLists_container container">
        {/* <h1>Employee Lists</h1> */}
        <h1>Total Employees: {employeeCount}</h1>
        {users.map((user) => (
          <div key={user.id}>
            <div className="emolyeLists">
              <div>
                <li>
                  {user.name} {user.lastname}
                </li>
              </div>
              <div onClick={() => handleRemoveCredentials(user.id)}>
                <EditIcon />
              </div>
            </div>

            <hr />
          </div>
        ))}
      </div>
    </div>
  );
}

export default EmployeeLists;
