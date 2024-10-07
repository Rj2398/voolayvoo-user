"use client";
import LocationDropdown from "@/components/LocationDropdown";
import Slider from "@/components/Slider";
import Link from "next/link";
import { useState, useEffect } from "react";

function MapFilter({ setAppliedFilter }) {
  const [locationFilter, setLocationFilter] = useState([]);
  const [sliderValue, setSliderValue] = useState({ from: 0, to: 100 });

  // Update the filter when the location changes
  useEffect(() => {
    setAppliedFilter((prev) => ({
      ...prev,
      locationFilter: locationFilter,
    }));
  }, [locationFilter]);

  // Update the slider value (miles range) and apply the miles filter
  const handleSlider = (e) => {
    setSliderValue({ from: e.fromValue, to: e.toValue });

    setAppliedFilter((prev) => ({
      ...prev,
      isMilesAppy: !(e.fromValue === 0 && e.toValue === 100), // Set isMilesAppy to true if range is changed
      milesRange: { from: e.fromValue, to: e.toValue },
    }));
  };

  return (
    <div className="map-inner-btn">
      <div className="home-btn">
        <Link href={"/"}>
          <i className="far fa-arrow-left"></i> Home
        </Link>
      </div>

      {/* Location Filter Dropdown */}
      <LocationDropdown
        locationFilter={locationFilter}
        setLocationFilter={setLocationFilter}
      />

      {/* Slider for Mile Radius */}
      <div className="dropdown mile-rad-range date-range">
        <a
          className="btn btn-date-range text-left"
          type="button"
          id="date-range-drop"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          Select your Mile Radius
        </a>
        <Slider
          initialValueFrom={0}
          initialValueTo={100}
          handleSliderValues={handleSlider}
        />
      </div>
    </div>
  );
}

export default MapFilter;
