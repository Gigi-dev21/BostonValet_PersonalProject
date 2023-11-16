import React, { useEffect, useState } from "react";
import Header from "../../Header/Header";
import { db } from "../../firebase";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";

function Places() {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    // Fetch places data from the database
    db.collection("places")
      .get()
      .then((querySnapshot) => {
        const placesData = [];
        querySnapshot.forEach((doc) => {
          // Add a validation check if needed
          placesData.push({ id: doc.id, placeName: doc.data().placeName });
        });
        // Update state with the fetched data
        setPlaces(placesData);
      })
      .catch((error) => {
        console.error("Error fetching places data:", error);
      });
  }, []);
  console.log(places);
  return (
    <div>
      <Header />
      <div className="container">
        <div className="title lists">
          <h1>Places</h1>
          <AddIcon fontSize="large" />
        </div>

        {places.map((place) => (
          <div>
            <div className="lists">
              <div key={place.id}>{place.placeName}</div>
              <EditIcon />
            </div>
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Places;
