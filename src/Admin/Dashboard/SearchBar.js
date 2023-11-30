import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import { startOfWeek, endOfWeek, parseISO } from "date-fns";

import "./Searchbar.css";

function SearchBar({ onSearch, setSearchDate, setScrollTarget }) {
  const [searchInput, setSearchInput] = useState("");
  const handleSearch = () => {
    setSearchDate(searchInput);
    onSearch();
    setScrollTarget(searchInput);
    setSearchInput("");
  };

  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleClearSearch = () => {
    // Clear the search input and notify the parent component
    setSearchInput("");
    setSearchDate("");
    onSearch();
  };

  return (
    <div>
      <div className="header_search">
        <input
          className="header_searchInput"
          type="date" // Use type="date" for a date input
          value={searchInput}
          onChange={handleInputChange}
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
