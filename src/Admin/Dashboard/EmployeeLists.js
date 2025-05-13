import React, { useContext, useEffect, useState } from "react";
import Header from "../../Header/Header";
import { db, auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import EditIcon from "@mui/icons-material/Edit";
import Modal from "react-bootstrap/Modal";
import AdminLists from "./AdminLists";
import DeleteIcon from "@mui/icons-material/Delete";
import { StateContext } from "../../stateprovider/Stateprovider";

function EmployeeLists() {
  let navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [employeeCount, setEmployeeCount] = useState(0);
  const [selectedUserName, setSelectedUserName] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [{ user }, dispatch] = useContext(StateContext);

  // HANDLES MODAL///
  const [show, setShow] = useState(false);

  // handels when delete button is clicked////
  const handleShow = (userId, userName) => {
    setSelectedUserId(userId);
    setSelectedUserName(userName);
    console.log(userId);
    console.log(userName);
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
  };

  // FETCHES THE EMPLOYE DATA///
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const querySnapshot = await db
  //         .collection("users")
  //         .where("role", "==", "employee")
  //         .get();

  //       const userData = [];

  //       querySnapshot.forEach((doc) => {
  //         const { name, lastName } = doc.data(); // Destructure name and lastname
  //         userData.push({
  //           id: doc.id,
  //           name,
  //           lastName, // Include the lastname property
  //         });
  //       });

  //       setUsers(userData);
  //       setEmployeeCount(userData.length);
  //     } catch (error) {
  //       console.error("Error fetching users data:", error);
  //     }
  //   };

  //   fetchData();
  // }, []);

  const fetchData = async () => {
    try {
      const querySnapshot = await db
        .collection("users")
        .where("role", "==", "employee")
        .get();

      const userData = querySnapshot.docs.map((doc) => {
        const { name, lastName } = doc.data();
        return {
          id: doc.id,
          name,
          lastName,
        };
      });

      console.log("Fetched data successfully:", userData);

      setUsers(userData);
      setEmployeeCount(userData.length);
    } catch (error) {
      console.error("Error fetching users data:", error);
      // Handle error as needed
    }
  };

  // HANDLES THE DELETE USER//////
  // Handles the deletion of a user's credentials
  // const handleRemoveCredentials = async (userId) => {
  //   console.log("Deleting user with ID:", userId);

  //   try {
  //     // Get the current authenticated user
  //     const currentUser = auth.currentUser;

  //     // Delete the user's authentication credentials
  //     await currentUser.delete();

  //     // Delete the user's data in Firestore
  //     await db.collection("users").doc(userId).delete();
  //     console.log("User and credentials deleted successfully!");
  //     fetchData();
  //     handleClose();
  //   } catch (error) {
  //     console.error("Error deleting user:", error.message); // Log detailed error message
  //     // Handle error (show a message to the user, etc.)
  //   }
  // };
  // const handleRemoveCredentials = async (userId) => {
  //   console.log("Deleting user with ID:", userId);

  //   try {
  //     // Get the current authenticated user
  //     const currentUser = auth.currentUser;

  //     // Delete the user's authentication credentials
  //     await currentUser.delete();

  //     // Delete the user's data in Firestore
  //     await db.collection("users").doc(userId).delete();

  //     console.log("User and credentials deleted successfully!");

  //     // Fetch updated user data
  //     await fetchData();

  //     handleClose();
  //   } catch (error) {
  //     console.error("Error deleting user:", error.message);
  //     // Handle error (show a message to the user, etc.)
  //   }
  // };
  const handleRemoveCredentials = async (userId) => {
    console.log("Deleting user with ID:", userId);

    try {
      // Delete the user's data in Firestore
      await db.collection("users").doc(userId).delete();

      console.log("User data deleted successfully!");

      // Fetch updated user data
      await fetchData();

      // Get the current authenticated user
      const currentUser = auth.currentUser;

      // Delete the user's authentication credentials
      // await currentUser.delete();

      console.log("User credentials deleted successfully!");

      handleClose();
    } catch (error) {
      console.error("Error deleting user:", error.message);
      // Handle error (show a message to the user, etc.)
    }
  };
  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="employeeLists">
      <Header />
      <AdminLists />
      <div className="employeeLists_container container">
        {/* <h1>Employee Lists</h1> */}
        <h1>Total Employees: {employeeCount}</h1>
        {users.map((user) => (
          <div key={user.id}>
            <div className="emolyeLists">
              <div>
                <li>
                  {user.name} {user.lastName}
                </li>
              </div>
              <div
                onClick={() =>
                  handleShow(user.id, `${user.name} ${user.lastName}`)
                }
              >
                <DeleteIcon />
              </div>
            </div>
            <Modal
              show={show}
              // closes the modal when clicked outside the modal
              onHide={handleClose}
              keyboard={true}
              centered
              className="centered_element"
            >
              <Modal.Title className="ModalTitle text-center">
                <h5>
                  Are you sure you want to delete the user {selectedUserName}?
                </h5>
              </Modal.Title>
              <br />
              <div
                style={{
                  display: "flex",
                  justifyContent: "normal",
                  width: "40%",
                  alignItems: "center",
                  margin: "0 auto",
                }}
              >
                <Button
                  className="deleteButton"
                  onClick={() => handleRemoveCredentials(selectedUserId)}
                >
                  Yes
                </Button>
                <Button className="deleteButton" onClick={() => handleClose()}>
                  No
                </Button>
              </div>

              <br />
            </Modal>
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
}

export default EmployeeLists;
