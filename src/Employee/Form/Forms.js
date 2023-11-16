import React, { useEffect, useState } from "react";
import "./Form.css";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import Header from "../../Header/Header";
import Form from "react-bootstrap/Form";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { db } from "../../firebase";
import { useLocation } from "react-router-dom";

function Forms() {
  //bringing the username from the empolyee sign in page//
  const location = useLocation();
  const userName = location.state && location.state.userName;

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
  const [note, setNote] = useState("");
  const [selectedRestaurant, setSelectedRestaurant] = useState("Place name");

  useEffect(() => {
    if (userName) {
      console.log(userName);
    }
  }, [userName]);
  useEffect(() => {
    console.log(selectedRestaurant);
  }, [selectedRestaurant]);
  // console.log(endingTicket);
  // console.log(ticketNumber);
  // console.log(vips);
  // console.log(hosted);
  // console.log(creditCards);
  // console.log(CCTips);
  // console.log(totalCash);
  // console.log(totalCars);
  // console.log(note);

  // resturant lists///
  const restaurants = [
    "Abe & louis",
    "Eddi V",
    "Fogo de chao",
    "Moo",
    "Naksan",
    "Toscano",
  ];
  // updating the selected resturant to the variable SelectedRestaurant
  const handleRestaurantSelect = (restaurant) => {
    setSelectedRestaurant(restaurant);
  };

  //// HANDLES CLICK BUTTON////
  const handleClick = () => {
    const dataToInsert = {
      date,
      endingTicket,
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
    };

    db.collection("Data")
      .add(dataToInsert)
      .then((docRef) => {
        alert("Data inserted successfully with ID:", docRef.id);
        // You can perform additional actions after successful insertion
      })
      .catch((error) => {
        console.error("Error inserting data:", error);
      });
  };

  return (
    <div>
      <div className="header1">
        <Header />
      </div>

      <div className="container form_container">
        {userName ? <h1>Welcome {userName}!</h1> : <p>Loading...</p>}

        <br />
        <DropdownButton
          id="dropdown-basic-button"
          title={selectedRestaurant}
          onSelect={(eventKey, event) => handleRestaurantSelect(eventKey)}
        >
          {restaurants.map((restaurant, index) => (
            <Dropdown.Item key={index} eventKey={restaurant}>
              {restaurant}
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
          onChange={(e) => setEndingTicket(e.target.value)}
        />
        <br />
        <Form.Control
          type="text"
          placeholder="Ticket number"
          onChange={(e) => setTicketNumber(e.target.value)}
        />
        <br />
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
        <br />
        <Button className="submitInfoButton" onClick={handleClick}>
          Submit
        </Button>
      </div>
    </div>
  );
}

export default Forms;
