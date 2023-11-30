import React, { useContext, useEffect, useRef, useState } from "react";
import Header from "../../Header/Header";
import { db } from "../../firebase";
import { useNavigate, useParams } from "react-router-dom";
import Table from "react-bootstrap/Table";
import { parseISO, format, startOfWeek, endOfWeek } from "date-fns";
import "./data.css";
import SearchButton from "./SearchBar";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import SearchBar from "./SearchBar";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { StateContext } from "../../stateprovider/Stateprovider";

function Data({ groupedData }) {
  let navigate = useNavigate();
  const scrollToRef = useRef(null);
  const [yearData, setYearData] = useState([]);
  const { year, place } = useParams();
  const [selectedItem, setSelectedItem] = useState(null);
  const [editedField, setEditedField] = useState("");
  const [editedValue, setEditedValue] = useState("");
  const [blinkItemId, setBlinkItemId] = useState(null);
  const [blink, setBlink] = useState(false);
  const [error, seterror] = useState("");
  const [{ user }, dispatch] = useContext(StateContext);

  const fetchData = async () => {
    try {
      const querySnapshot = await db.collection("Data").get();
      const data = [];

      querySnapshot.forEach((doc) => {
        const item = doc.data();
        const itemWitdId = { ...item, id: doc.id }; // Include tde document ID
        const itemYear = new Date(item.date).getFullYear();

        // Check botd year and place conditions
        if (
          itemYear.toString() === year.toString() &&
          item.selectedRestaurant === place
        ) {
          // Add tde item witd ID to tde data array if it matches tde selected year and place
          data.push(itemWitdId);
        }
      });

      // Filter data based on the search date
      // const searchData = data.filter((item) => {
      //   return item.date === searchDate; // Update this condition based on your data structure
      // });

      setYearData(data);
      // onSearch(searchData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // console.log(yearData.selectedPlacePrice);

  useEffect(() => {
    fetchData();
  }, [year, place]);

  const sortedYearData = yearData.sort((a, b) => {
    const dateA = parseISO(a.date);
    const dateB = parseISO(b.date);
    return dateA - dateB;
  });

  // Function to group data by week
  const groupDataByWeek = () => {
    const groupedData = {};
    sortedYearData.forEach((item) => {
      const weekStart = startOfWeek(parseISO(item.date));
      const weekEnd = endOfWeek(parseISO(item.date));
      const weekKey = `${weekStart}-${weekEnd}`;

      if (!groupedData[weekKey]) {
        groupedData[weekKey] = [];
      }

      groupedData[weekKey].push(item);
    });

    return groupedData;
  };

  const groupedWeekData = groupDataByWeek();

  // ///////
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleClose = () => {
    setShow(false);
    setEditedValue("");
    seterror("");
  };

  // HANDLES WHEN tdE VALUES ARE CLICKED///
  const handletdClick = (params) => {
    // Set tde edited field and value
    console.log(params.field);
    console.log(params.value);
    console.log(params.id);

    setEditedField(params.field);
    setEditedValue(params.value || "");

    // Set tde selected item
    setSelectedItem(params);

    // Open tde modal
    handleShow();
  };

  //// HANDLES THE CHANGED/EDITED DATA/////
  const handleSaveChanges = () => {
    if (!selectedItem || !editedField) {
      console.error("No selected item or edited field to save changes.");
      return;
    }

    // Assuming editedValue is the value you want to validate
    if (editedField !== "note" && isNaN(editedValue)) {
      seterror("Edited value must be a number.");
      return;
    }

    // console.log("Selected item ID:", selectedItem.id);

    const updateData = {};
    updateData[editedField] = editedValue;

    db.collection("Data")
      .doc(selectedItem.id)
      .update({
        ...updateData,
      })
      .then(() => {
        console.log("Document successfully updated!");
        fetchData();
        handleClose();
        setBlinkItemId(selectedItem.id);
        setBlink(true);

        // Reset tde blink effect and ID after 3 seconds
        setTimeout(() => {
          setBlink(false);
          setBlinkItemId(null);
        }, 3000);
      })
      .catch((error) => {
        console.error("Error updating document: ", error);
      });
  };

  /// CALCULATE STHE SUM/////
  const calculateSum = (data, field) => {
    return data.reduce((sum, item) => {
      const value = parseFloat(item[field]);
      console.log(`Adding ${field}: ${sum} + ${value} = ${sum + value}`);
      return sum + value;
    }, 0);
  };

  const formatAsCurrency = (value) => {
    // Use Intl.NumberFormat to format the value as currency
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    });

    // Return the formatted value
    return formatter.format(value);
  };

  return (
    <div className="Data">
      <Header />
      <div className="search_container">
        <h1 className="placeAndYear">
          {place} {year}
        </h1>

        {/* <SearchBar onSearch={onSearch} groupedWeekData={groupedWeekData} /> */}
        {/* <SearchBar
        // onSearch={onSearch}
        // setSearchDate={setSearchDate}
        // setScrollTarget={setScrollTarget}
        /> */}
      </div>

      <div>
        {Object.entries(groupedWeekData).map(([weekKey, weekData]) => (
          <div key={weekKey}>
            <h2 className="weekname">
              {format(startOfWeek(parseISO(weekData[0].date)), "MMMM d")} -{" "}
              {format(endOfWeek(parseISO(weekData[0].date)), "MMMM d, yyyy")}
            </h2>
            <Table responsive striped="columns">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>User Name</th>
                  <th>Ticket Number</th>
                  <th>VIPs</th>
                  <th>Credit Cards</th>
                  <th>Hosted</th>
                  <th>Total Cars</th>
                  <th>CC Tips</th>
                  <th>Misc Exp$</th>
                  <th>Total cash</th>
                  <th>Price</th>
                  <th>Note</th>
                </tr>
              </thead>
              <tbody>
                {weekData.map((item, index) => (
                  <tr key={index}>
                    <td
                      className={
                        blink &&
                        blinkItemId === item.id &&
                        editedField === "date"
                          ? "blink-cell"
                          : ""
                      }
                      onClick={() =>
                        handletdClick({
                          field: "date",
                          value: item.date,
                          id: item.id,
                        })
                      }
                    >
                      {format(parseISO(item.date), "EEE, MMM d", {
                        timeZone: "America/New_York",
                      })}
                    </td>
                    <td>{item.userName}</td>
                    <td
                      className={
                        blink &&
                        blinkItemId === item.id &&
                        editedField === "ticketNumber"
                          ? "blink-cell"
                          : ""
                      }
                      onClick={() =>
                        handletdClick({
                          field: "ticketNumber",
                          value: item.ticketNumber,
                          id: item.id,
                        })
                      }
                    >
                      {item.ticketNumber}
                    </td>

                    <td
                      className={
                        blink &&
                        blinkItemId === item.id &&
                        editedField === "vips"
                          ? "blink-cell"
                          : ""
                      }
                      onClick={() =>
                        handletdClick({
                          field: "vips",
                          value: item.vips,
                          id: item.id,
                        })
                      }
                    >
                      {item.vips}
                    </td>
                    <td
                      className={
                        blink &&
                        blinkItemId === item.id &&
                        editedField === "creditCards"
                          ? "blink-cell"
                          : ""
                      }
                      onClick={() =>
                        handletdClick({
                          field: "creditCards",
                          value: item.creditCards,
                          id: item.id,
                        })
                      }
                    >
                      {item.creditCards}
                    </td>
                    <td
                      className={
                        blink &&
                        blinkItemId === item.id &&
                        editedField === "hosted"
                          ? "blink-cell"
                          : ""
                      }
                      onClick={() =>
                        handletdClick({
                          field: "hosted",
                          value: item.hosted,
                          id: item.id,
                        })
                      }
                    >
                      {item.hosted}
                    </td>

                    <td
                      className={
                        blink &&
                        blinkItemId === item.id &&
                        editedField === "totalCars"
                          ? "blink-cell"
                          : ""
                      }
                      onClick={() =>
                        handletdClick({
                          field: "totalCars",
                          value: item.totalCars,
                          id: item.id,
                        })
                      }
                    >
                      {item.totalCars}
                    </td>

                    <td
                      className={
                        blink &&
                        blinkItemId === item.id &&
                        editedField === "ccTips"
                          ? "blink-cell"
                          : ""
                      }
                      onClick={() =>
                        handletdClick({
                          field: "ccTips",
                          value: item.ccTips,
                          id: item.id,
                        })
                      }
                    >
                      {formatAsCurrency(item.ccTips)}
                    </td>
                    <td
                      className={
                        blink &&
                        blinkItemId === item.id &&
                        editedField === "miscExpense"
                          ? "blink-cell"
                          : ""
                      }
                      onClick={() =>
                        handletdClick({
                          field: "miscExpense",
                          value: item.miscExpense,
                          id: item.id,
                        })
                      }
                    >
                      {formatAsCurrency(item.miscExpense)}
                    </td>
                    <td
                      className={
                        blink &&
                        blinkItemId === item.id &&
                        editedField === "totalCash"
                          ? "blink-cell"
                          : ""
                      }
                      onClick={() =>
                        handletdClick({
                          field: "totalCash",
                          value: item.totalCash,
                          id: item.id,
                        })
                      }
                    >
                      {formatAsCurrency(item.totalCash)}
                    </td>
                    <td>{formatAsCurrency(item.selectedPlacePrice)}</td>
                    <td
                      className={
                        blink &&
                        blinkItemId === item.id &&
                        editedField === "note"
                          ? "blink-cell"
                          : ""
                      }
                      onClick={() =>
                        handletdClick({
                          field: "note",
                          value: item.note,
                          id: item.id,
                        })
                      }
                    >
                      {item.note}
                    </td>
                  </tr>
                ))}
              </tbody>
              {/* TOTALS */}
              <tbody>
                <tr className="total">
                  <th>Total</th>
                  <th></th>
                  <th></th>
                  <th>{calculateSum(weekData, "vips")}</th>
                  <th>
                    {" "}
                    {/* Credit Cards:  */}
                    {calculateSum(weekData, "creditCards")}
                  </th>
                  <th>
                    {/* Hosted: */}
                    {calculateSum(weekData, "hosted")}
                  </th>
                  <th>
                    {/* Total Cars: */}
                    {calculateSum(weekData, "totalCars")}
                  </th>
                  <th>
                    {/* CCTIPSs: */}
                    {formatAsCurrency(calculateSum(weekData, "ccTips"))}
                  </th>
                  <th>
                    {" "}
                    {/* Misc Expense:  */}
                    {formatAsCurrency(calculateSum(weekData, "miscExpense"))}
                  </th>
                  <th>
                    {/* Total Cash:{" "} */}
                    {formatAsCurrency(calculateSum(weekData, "totalCash"))}
                  </th>
                  <th></th>
                  <th></th>
                </tr>
              </tbody>
            </Table>
          </div>
        ))}
      </div>
      {/* Render tde modal */}
      <Modal
        show={show}
        onHide={handleClose}
        keyboard={true}
        centered
        className="centered_element"
      >
        <Modal.Title className="ModalTitle text-center">
          <h5>Edit</h5>
        </Modal.Title>
        <br />
        <Form.Control
          type="text"
          value={editedValue}
          placeholder="Please enter new value"
          onChange={(e) => {
            setEditedValue(e.target.value);
          }}
          className="inputs"
        />
        <br />
        <div className="errors" style={{ textAlign: "center" }}>
          {error}
        </div>
        <br />
        <div className="yesNoButtons">
          <Button onClick={handleSaveChanges}>Submit</Button>
        </div>

        <br />
      </Modal>
      {/* <SearchBar onSearch={handleSearch} onClear={handleClearSearch} /> */}
    </div>
  );
}

export default Data;
