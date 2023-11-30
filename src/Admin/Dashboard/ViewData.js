import React, { useContext, useEffect, useState } from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import "./viewData.css";
import { StateContext } from "../../stateprovider/Stateprovider";

function ViewData() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [data, setData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [showPlaces, setShowPlaces] = useState(false);
  const [arrowDirections, setArrowDirections] = useState({});
  const navigate = useNavigate();
  const [{ user }, dispatch] = useContext(StateContext);

  /// FETCHES THE DATA//////
  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await db.collection("Data").get();
        const userData = [];

        querySnapshot.forEach((doc) => {
          userData.push(doc.data());
        });

        setData(userData);
      } catch (error) {
        console.error("Error fetching users data:", error);
      }
    };

    fetchData();
  }, []);

  //   GROUPS THE FETCHED DATA BY YEAR////
  const groupDataByYear = () => {
    const groupedData = {};

    data.forEach((item) => {
      const year = new Date(item.date).getFullYear();

      if (!groupedData[year]) {
        groupedData[year] = {
          places: [],
          data: [],
        };
      }

      groupedData[year].places.push(item.selectedRestaurant);
      groupedData[year].data.push(item);
    });

    return groupedData;
  };

  const groupedData = groupDataByYear();

  // HANDLING THE CLICK EVENT WHEN YEAR IS CLICKED//
  const handleNavigate = (year) => {
    // Update the selected year
    setSelectedYear(year);
    // Toggle the places dropdown visibility
    setShowPlaces(!showPlaces);
    // Toggle arrow direction for the clicked year
    setArrowDirections((prevDirections) => {
      const newDirections = { ...prevDirections };
      newDirections[year] = newDirections[year] === "right" ? "down" : "right";
      return newDirections;
    });
  };

  //HANDLES THE DROPDOWN WHEN VIEW DATA IS CLICKED///
  const handleDropdownToggle = () => {
    // Toggle the main dropdown visibility
    setDropdownOpen(!dropdownOpen);
    // Close the places dropdown when the main dropdown is toggled
    setShowPlaces(false);
  };

  /// HANDELS THE CLICK WHEN THE PLACES ARE CLICKLED/////
  const handleNavigatePalces = (year, place) => {
    // Your logic to handle navigation or further actions with year and place
    // For example, navigate to "/dashboard/display/:year/:place"
    navigate(`/dashboard/display/${year}/${place}`);
  };

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div>
      <div className="dropdown-container">
        <div className="dd" onClick={handleDropdownToggle}>
          <div>View Data</div>
          <KeyboardArrowDownIcon
            className={`arrows ${dropdownOpen ? "open" : ""}`}
          />
        </div>
        {dropdownOpen && (
          <div className="dropdown-content">
            <div className="dropdownYears">
              {Object.keys(groupedData).map((year) => (
                <div key={year}>
                  <div onClick={() => handleNavigate(year)}>
                    <div className="yearsDiv">
                      <h6 className="years">{year}</h6>
                      {arrowDirections[year] === "right" ? (
                        <KeyboardArrowRightIcon />
                      ) : (
                        <KeyboardArrowDownIcon />
                      )}
                    </div>
                    <hr />
                  </div>

                  {selectedYear === year && showPlaces && (
                    <div className="dropdownPlaces">
                      {groupedData[year]?.places.length > 0 ? (
                        // Use a Set to keep track of unique places
                        [...new Set(groupedData[year].places)].map(
                          (place, index) => (
                            <div key={index}>
                              <p
                                className="placesName"
                                onClick={() =>
                                  handleNavigatePalces(year, place)
                                }
                              >
                                {place}
                              </p>
                            </div>
                          )
                        )
                      ) : (
                        <p>No places available for the selected year.</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewData;
