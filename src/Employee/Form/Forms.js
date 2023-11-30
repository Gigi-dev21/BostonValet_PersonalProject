import React, { useContext, useEffect, useState } from "react";
import "./Form.css";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import Header from "../../Header/Header";
import Form from "react-bootstrap/Form";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Modal from "react-bootstrap/Modal";
import { db } from "../../firebase";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { StateContext } from "../../stateprovider/Stateprovider";

function Forms() {
  let navigate = useNavigate();
  // declare state variables
  const [date, setDate] = useState("");
  const [endingTicket, setEndingTicket] = useState("");
  const [ticketNumber, setTicketNumber] = useState("");
  const [vips, setVips] = useState("");
  const [hosted, setHosted] = useState("");
  const [creditCards, setCreditCards] = useState("");
  const [totalCars, setTotalCars] = useState("");
  const [ccTips, setCCTips] = useState("");
  const [totalCash, setTotalCash] = useState("");
  const [miscExpense, setmiscExpense] = useState(0);
  const [note, setNote] = useState("");
  const [selectedRestaurant, setSelectedRestaurant] = useState("Place name");
  const [places, setPlaces] = useState([]);
  const [validations, setValidations] = useState("");
  const [sumitMessage, setSumitMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedPlaceId, setSelectedPlaceId] = useState(null);
  const [selectedPlacePrice, setSelectedPlacePrice] = useState(null);
  const [{ user }, dispatch] = useContext(StateContext);

  //bringing the username from the empolyee sign in page//
  const location = useLocation();
  const { firstName, lastName } = location.state ?? {};
  const userName = `${firstName} ${lastName}`;

  // HANDLES MODAL///
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);

  const handleClose = () => {
    setShow(false);
    window.location.reload();
  };

  // FETCHES THE PLACES FROM DB WHICH ADMIN ADDS
  useEffect(() => {
    if (userName) {
      console.log("First Name:", firstName);
      console.log("Last Name:", lastName);
      console.log("user Name:", userName);
      // Fetch places data from the database
      db.collection("places")
        .get()
        .then((querySnapshot) => {
          const placesData = [];
          // This is a loop that iterates over each document in the query result
          querySnapshot.forEach((doc) => {
            // Extract the id, placeName, and price fields from the document
            const data = doc.data();
            placesData.push({
              id: doc.id,
              placeName: data.placeName,
              price: data.price, // Assuming 'price' is the field in the document that represents the price
            });
          });
          // Update state with the fetched data
          placesData.sort((a, b) => a.placeName.localeCompare(b.placeName));
          setPlaces(placesData);
        })
        .catch((error) => {
          console.error("Error fetching places data:", error);
        });
    }
  }, [userName, firstName, lastName]);

  // Check if there is no user, and handle accordingly
  // useEffect(() => {
  //   // Redirect if there is no user
  //   if (!user) {
  //     navigate("/error");
  //   }
  // }, [user, navigate]);

  //// HANDLES CLICK BUTTON////
  const handleClick = () => {
    if (!userName) {
      setValidations("Please sign in agian.");
      return;
    }
    const dataToInsert = {
      date,
      ticketNumber,
      vips,
      hosted,
      creditCards,
      totalCars,
      ccTips,
      totalCash,
      note,
      selectedRestaurant,
      userName,
      selectedPlacePrice,
      miscExpense,
    };

    if (!selectedRestaurant || selectedRestaurant === "Place name") {
      setValidations("Please select place");
      return;
    }

    if (!date) {
      setValidations("Please select date");
      return;
    }

    if (!ticketNumber) {
      setValidations("Please enter an ending ticket number");
      return;
    }

    if (!creditCards) {
      setValidations("Please enter number of Credit Cards used");
      return;
    }
    if (!totalCars) {
      setValidations("Please enter total number of Cars");
      return;
    }
    if (!totalCash) {
      setValidations("Please enter total amount of cash");
      return;
    }

    const numericFields = [
      "endingTicket",
      "ticketNumber",
      "vips",
      "hosted",
      "creditCards",
      "totalCars",
      "ccTips",
      "totalCash",
      "miscExpense",
    ];

    // CHNAGES THE numericFields TO READABLE TEXT AND IF THERE IS NO ENTERTED DATA IN THE SOME OF THE INPUTS IT TAKES IT AS ZERO
    for (const field of numericFields) {
      const formattedFieldName = field
        // Chaneges the classnames to readable text
        .replace(/([A-Z])/g, " $1") // Add space before capital letters
        .replace(/^./, (str) => str.toUpperCase()); // Capitalize the first letter

      // If the field is provided but not a number, display a message
      if (dataToInsert[field] && isNaN(dataToInsert[field])) {
        setValidations(`${formattedFieldName} must be a number.`);
        return;
      }

      // Convert the field to a number or default to 0 if no data entered
      dataToInsert[field] = dataToInsert[field]
        ? Number(dataToInsert[field])
        : 0;
    }
    // INSERT TO THE DATA COLLECTION
    db.collection("Data")
      .add(dataToInsert)
      .then((docRef) => {
        setSumitMessage("Thank you! Data has been successfully submitted.");
        // make sthe modal show
        handleShow();
      })
      .catch((error) => {
        setErrorMessage(`Error inserting data: ${error}`);
      });
  };

  // when clicked on places,it sets it on setSelectedRestaurant so that we can pass the naem of the place selected when submitting the data
  const handleClickDropdownItem = (place) => {
    setSelectedRestaurant(place.placeName);
    setSelectedPlaceId(place.id); // Assuming 'id' is the unique identifier for the place
    setSelectedPlacePrice(place.price);
  };

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div>
      <div className="container form_container">
        {userName ? (
          <>
            <h1 className="capitalize-first-letter">Welcome {firstName}!</h1>

            <br />

            <DropdownButton
              id="dropdown-basic-button"
              title={selectedRestaurant || "Place name"}
            >
              {places.map((place) => (
                <Dropdown.Item
                  key={place.id}
                  eventKey={place}
                  onClick={() => handleClickDropdownItem(place)}
                  className="capitalize-first-letter "
                >
                  {place.placeName}
                </Dropdown.Item>
              ))}
            </DropdownButton>

            <br />
            <Form.Control
              type="date"
              placeholder="Date"
              onChange={(e) => setDate(e.target.value)}
            />
            <br />
            <Form.Control
              type="text"
              placeholder="Ending Ticket"
              onChange={(e) => setTicketNumber(e.target.value)}
            />
            <br />
            {/* <Form.Control
          type="text"
          placeholder="Ticket number"
          onChange={(e) => setTicketNumber(e.target.value)}
        />
        <br /> */}
            <Form.Control
              type="text"
              placeholder=" VIP's (apporved) "
              onChange={(e) => setVips(e.target.value)}
            />
            <br />
            <Form.Control
              type="text"
              placeholder="Hosted"
              onChange={(e) => setHosted(e.target.value)}
            />
            <br />
            <Form.Control
              type="text"
              placeholder="Credit Cards"
              onChange={(e) => setCreditCards(e.target.value)}
            />
            <br />
            <Form.Control
              type="text"
              placeholder="Total # of Cars"
              onChange={(e) => setTotalCars(e.target.value)}
            />
            <br />
            <Form.Control
              type="text"
              placeholder="Misc Exp$"
              onChange={(e) => setmiscExpense(e.target.value)}
            />
            <br />
            <Form.Control
              type="text"
              placeholder="CC tips (Rounded)"
              onChange={(e) => setCCTips(e.target.value)}
            />
            <br />
            <Form.Control
              type="text"
              placeholder="Total Cash Collected"
              onChange={(e) => setTotalCash(e.target.value)}
            />
            <br />

            <InputGroup className="textarea">
              <InputGroup.Text>Note or memo</InputGroup.Text>
              <Form.Control
                as="textarea"
                aria-label="With textarea"
                onChange={(e) => setNote(e.target.value)}
              />
            </InputGroup>

            {errorMessage && (
              <div style={{ color: "red", textAlign: "center" }}>
                {errorMessage}
              </div>
            )}

            <br />
            <div style={{ textAlign: "center", color: "#ff0000" }}>
              {" "}
              {validations}
            </div>
            <br />
            <Button className="submitInfoButton" onClick={handleClick}>
              Submit
            </Button>
          </>
        ) : (
          <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h2>Please sign in to access the form.</h2>
          </div>
        )}
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
          <h5>{sumitMessage}</h5>
        </Modal.Title>

        <br />
      </Modal>
    </div>
  );
}

export default Forms;
