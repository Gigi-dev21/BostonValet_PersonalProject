import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import { startOfWeek, endOfWeek, parseISO } from "date-fns";

import "./Searchbar.css";

function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  return (
    <div>
      <div className="header_search">
        <input
          className="header_searchInput"
          type="date" // Use type="date" for a date input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div>
          <SearchIcon className="header_searchIcon" />
          <button onClick={handleSearch}>Search</button>
          {/* <button onClick={handleClear}>Clear</button> */}
        </div>
      </div>
    </div>
  );
}

export default SearchBar;
