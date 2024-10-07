"use client";
import React, { useState } from "react";
import AutoCompleteGoogle from "./AutoCompleteGoogle";

function LocationDropdown({ locationFilter = [], setLocationFilter }) {
  const [location, setLocation] = useState(false);

  const handleSelectLocation = (e) => {
    setLocationFilter(e);
  };

  const openLocation = (event) => {
    event.preventDefault();
    setLocation(location ? false : true);
  };
  return (
    <div className="location-drop">
      <a
        // onClick={openLocation}
        className="btn btn-location text-left"
        href="#"
        role="button"
        id="location-drop-id"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        {" "}
        Location{" "}
      </a>
      <ul
        className="dropdown-menu location-drop-list w-auto"
        aria-labelledby="location-drop-id"
      >
        <form>
          <AutoCompleteGoogle
            select={locationFilter}
            setSelect={handleSelectLocation}
          />
        </form>
      </ul>
    </div>
  );
}

export default React.memo(LocationDropdown);
