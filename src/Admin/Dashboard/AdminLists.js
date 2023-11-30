import React, { useContext, useEffect, useState } from "react";
import { db, auth } from "../../firebase";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import DeleteIcon from "@mui/icons-material/Delete";
import { StateContext } from "../../stateprovider/Stateprovider";
import { useNavigate } from "react-router-dom";

function AdminLists() {
  let navigate = useNavigate();
  const [adminUsers, setAdminUsers] = useState([]);
  const [adminCount, setAdminCount] = useState(0);
  const [selectedUserId, setSelectedUserId] = useState("");

  const [{ user }, dispatch] = useContext(StateContext);

  // FETCHES THE EMPLOYE DATA///
  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await db
          .collection("users")
          .where("role", "==", "admin")
          .get();

        const userData = [];

        querySnapshot.forEach((doc) => {
          userData.push({ id: doc.id, ...doc.data() });
        });

        setAdminUsers(userData);
        setAdminCount(userData.length);
      } catch (error) {
        console.error("Error fetching users data:", error);
      }
    };

    fetchData();
  });
  const [show, setShow] = useState(false);

  const handleShow = (userId) => {
    setSelectedUserId(userId);

    setShow(true);
  };
  const handleClose = () => {
    setShow(false);
  };

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  //   HANDLES DELETE ADMIN///
  const handleRemoveCredentials = (userId) => {
    console.log("Deleting user with ID:", userId);

    db.collection("users")
      .doc(userId)
      .delete()
      .then(() => {
        console.log("User deleted successfully!");

        // Fetch updated user data
        const fetchData = async () => {
          try {
            const querySnapshot = await db
              .collection("users")
              .where("role", "==", "admin")
              .get();

            const updatedUserData = [];

            querySnapshot.forEach((doc) => {
              const { name, lastName } = doc.data();
              updatedUserData.push({
                id: doc.id,
                name,
                lastName,
              });
            });

            setAdminUsers(updatedUserData);
            setAdminCount(updatedUserData.length); // Update the employeeCount
          } catch (error) {
            console.error("Error fetching updated users data:", error);
          }
        };

        fetchData();
        handleClose();
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
      });
  };

  return (
    <div>
      <div className="employeeLists_container container">
        {/* <h1>Employee Lists</h1> */}
        <h1>Total Admins: {adminCount}</h1>
        {adminUsers.map((user) => (
          <div key={user.id}>
            <div className="emolyeLists">
              <div>
                <li>
                  {user.name} {user.lastname}
                </li>
              </div>
              <div onClick={() => handleShow(user.id)}>
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
                <h5>Are you sure you want to delete the user ?</h5>
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

export default AdminLists;
