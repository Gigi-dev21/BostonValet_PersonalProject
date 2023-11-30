import React, { useContext, useEffect, useState } from "react";
import Header from "../../Header/Header";
import { db } from "../../firebase";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import { StateContext } from "../../stateprovider/Stateprovider";
import { useNavigate } from "react-router-dom";

function Places() {
  let navigate = useNavigate();
  const [places, setPlaces] = useState([]);
  const [newPlace, setNewPlace] = useState("");
  const [price, setPrice] = useState("");
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [newPrice, setNewPrice] = useState("");
  const [error, setError] = useState("");
  const [{ user }, dispatch] = useContext(StateContext);

  // EDIT PRICE MOODAL
  const [showEditPrice, setShowEditPrice] = useState(false);

  const handleShowEditPrice = (place) => {
    setSelectedPlace(place);
    setShowEditPrice(true);
    setError("");
  };

  const handleCloseEditPrice = () => {
    setShowEditPrice(false);
    // Clear the newPrice state when closing the modal
    setNewPrice("");
    setError("");
  };

  // ADD PLACE MOODAL
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);

  const handleClose = () => {
    setShow(false);
    setError("");
  };

  // FETCHES THE PALCES ADDED BY ADMIN///
  const fetchPlaces = () => {
    db.collection("places")
      .get()
      .then((querySnapshot) => {
        const placesData = [];
        querySnapshot.forEach((doc) => {
          const placeData = {
            id: doc.id,
            placeName: doc.data().placeName,
            price: doc.data().price, // Add this line to include the price
          };
          placesData.push(placeData);
        });
        // Sort placesData alphabetically by placeName
        placesData.sort((a, b) => a.placeName.localeCompare(b.placeName));
        setPlaces(placesData);
      })
      .catch((error) => {
        console.error("Error fetching places data:", error);
      });
  };

  useEffect(() => {
    fetchPlaces();
  }, []);

  // HANDLES THE NEW ADDED PLACE//
  const submitNewPlace = () => {
    // Check if both newPlace and price are not empty
    if (newPlace.trim() !== "" && price.trim() !== "") {
      // Check if price is a valid number
      const isValidPrice = !isNaN(price) && isFinite(price);

      if (isValidPrice) {
        // Assuming newPlace and price are state variables storing the new place name and price
        db.collection("places")
          .add({
            placeName: newPlace,
            price: Number(price), // Convert price to a number before adding to the database
          })
          .then((docRef) => {
            // Optionally, you can reset the newPlace and price states after submission
            setError("");
            setNewPlace("");
            setPrice("");
            handleClose();
            fetchPlaces();
          })
          .catch((error) => {
            setError("Error adding new place:", error);
          });
      } else {
        // Handle the case where price is not a valid number
        setError("Invalid price value");
      }
    } else {
      // Handle the case where either newPlace or price is empty
      setError("Both place name and price are required");
    }
  };

  // EDIT PRICE MODAL///
  const submitPriceChange = () => {
    // Check if newPrice is not empty and is a valid number
    const isValidNumber =
      newPrice !== "" && !isNaN(newPrice) && isFinite(newPrice);

    if (selectedPlace && isValidNumber) {
      const selectedPlaceId = selectedPlace.id;

      // Update the price in the database using the selected place's ID
      db.collection("places")
        .doc(selectedPlaceId)
        .update({ price: Number(newPrice) }) // Convert newPrice to a number before updating
        .then(() => {
          // Handle success, close the modal, or perform any other actions
          // console.log("Price updated successfully");
          setError("");
          handleCloseEditPrice();
          fetchPlaces();
        })
        .catch((error) => {
          // Handle error
          setError("Error updating price:", error);
        });
    } else if (newPrice === "") {
      // Handle the case where newPrice is empty
      setError("Please enter the new price");
    } else {
      // Handle the case where newPrice is not a valid number
      setError("Invalid price value");
    }
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPlaceId, setSelectedPlaceId] = useState(null);

  const handleShowDelete = (placeId) => {
    setSelectedPlaceId(placeId); // Set the selected place ID here
    setShowDeleteModal(true);
  };
  const handleCloseDelete = () => {
    setShowDeleteModal(false);
    setSelectedPlaceId(null); // Reset the selected place ID when closing the modal
  };
  const handleRemovePlace = async () => {
    try {
      if (!selectedPlaceId) {
        console.error("No selected place ID");
        return;
      }

      // Assuming you have a function to delete a place from your database
      await db.collection("places").doc(selectedPlaceId).delete();
      // Close the modal after deletion
      handleCloseDelete();
      // After successful deletion, you may want to fetch and update the places list
      // using your fetchPlaces function or a similar mechanism
      fetchPlaces();
    } catch (error) {
      console.error("Error removing place:", error);
      // Handle the error as needed
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div>
      <Header />
      <div className="container">
        <div className="title lists">
          <h1>Places</h1>
          <div onClick={handleShow}>
            <AddIcon fontSize="large" />
          </div>
        </div>

        {places.map((place) => (
          <div key={place.id}>
            <div className="lists">
              <span>{place.placeName}</span>
              <div className="editButtons">
                <div
                  className="edit_icon"
                  onClick={() => handleShowEditPrice(place)}
                >
                  <span>${place.price}</span>
                  <EditIcon />
                </div>
                <div onClick={() => handleShowDelete(place.id)}>
                  <DeleteIcon />
                </div>
              </div>
            </div>
            <hr />
          </div>
        ))}
      </div>
      {/* ADD PALCE MODAL */}
      <Modal
        show={show}
        // closes the modal when clicked outside the modal
        onHide={handleClose}
        keyboard={true}
        centered
        className="centered_element"
      >
        <Modal.Header>
          <Modal.Title className="contactTitle text-center">
            <h1> Add Place</h1>
          </Modal.Title>
        </Modal.Header>
        <br />
        <Modal.Body>
          <Form.Control
            type="text"
            placeholder="Place Name"
            onChange={(e) => setNewPlace(e.target.value)}
          />
          <br />
          <Form.Control
            type="text"
            placeholder="Price"
            onChange={(e) => setPrice(e.target.value)}
          />
          <br />
          <div
            className="errors"
            style={{ textAlign: "center", marginBottom: "13px" }}
          >
            {error}
          </div>
          <Button
            className="submitInfoButton newplaceBuuton"
            onClick={submitNewPlace}
          >
            Submit
          </Button>
        </Modal.Body>
      </Modal>

      {/* EDIT PRICE MODAL */}
      <Modal
        show={showEditPrice}
        // closes the modal when clicked outside the modal
        onHide={handleCloseEditPrice}
        keyboard={true}
        centered
        className="centered_element"
      >
        <Modal.Header>
          <Modal.Title className="contactTitle text-center">
            <h1> Edit Place</h1>
          </Modal.Title>
        </Modal.Header>
        <br />
        <Modal.Body>
          <Form.Control
            type="text"
            placeholder="New price"
            onChange={(e) => setNewPrice(e.target.value)}
          />
          <br />
          <div
            className="errors"
            style={{ textAlign: "center", marginBottom: "13px" }}
          >
            {error}
          </div>

          <Button
            className="submitInfoButton newplaceBuuton"
            onClick={submitPriceChange}
          >
            Submit
          </Button>
        </Modal.Body>
      </Modal>

      {/* DELETE PALCE MODAL */}
      <Modal
        show={showDeleteModal}
        onHide={handleClose}
        keyboard={true}
        centered
        className="centered_element"
      >
        <Modal.Title className="ModalTitle text-center">
          <h5>Are you sure you want to delete the place?</h5>
        </Modal.Title>
        <br />
        <div className="yesNoButtons">
          {" "}
          <Button
            onClick={() => handleRemovePlace(selectedPlaceId)}
            style={{ marginRight: "20px" }}
          >
            Yes
          </Button>
          <Button onClick={handleCloseDelete}>No</Button>
        </div>

        <br />
      </Modal>
    </div>
  );
}

export default Places;
