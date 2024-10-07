"use client";
import Link from "next/link";
import GoogleMapComp from "./Component/GoogleMap";
import MapFilter from "./Component/MapFilter";
import { BASE_URL } from "@/constant/constant";
import { useAuth } from "@/app/UserProvider";
import { useEffect, useState } from "react";

async function fetchEventList(id) {
  const formData = new FormData();
  formData.append("user_id", id);

  const resEventList = await fetch(`${BASE_URL}/api/user_event_list`, {
    method: "POST",
    body: formData,
  });
  return resEventList.json();
}

const Map = () => {
  const { userDetails } = useAuth();
  const [eventList, setEventList] = useState([]); // Full event list

  const [filteredEvents, setFilteredEvents] = useState([]); // Filtered event list
  console.log(filteredEvents, "filterd ecent lists dataatat");

  console.log(filteredEvents, "hello event list data comes form ");
  const [appliedFilter, setAppliedFilter] = useState({
    // State for filters
    locationFilter: [],
    milesRange: { from: 0, to: 100 },
    isMilesAppy: false,
  });

  useEffect(() => {
    if (userDetails?.user_id) {
      const fetchData = async () => {
        const eventData = await fetchEventList(userDetails.user_id);
        setEventList(eventData.data); // Store the full event list
        setFilteredEvents(eventData.data); // Initially set filtered list to full list
      };
      fetchData();
    }
  }, [userDetails]);

  // Function to apply filters on the event list
  const applyFilters = () => {
    let filtered = eventList;
    console.log(filtered, "hello filtered data comes");

    // Filter by location
    if (appliedFilter.locationFilter.length > 0) {
      filtered = filtered.filter((event) =>
        appliedFilter.locationFilter.some((location) =>
          event.location.includes(location)
        )
      );
    }

    // Filter by miles range (if miles filter is applied)
    if (appliedFilter.isMilesAppy) {
      filtered = filtered.filter((event) => {
        return (
          event.distance >= appliedFilter.milesRange.from &&
          event.distance <= appliedFilter.milesRange.to
        );
      });
    }
    console.log(filtered, "hello fappluyehjakshdjkh");

    setFilteredEvents(filtered);
  };

  // Apply filters whenever the appliedFilter state changes
  useEffect(() => {
    applyFilters();
  }, [appliedFilter, eventList]);

  return (
    <>
      {/* Pass the filter state setter to MapFilter */}
      <MapFilter setAppliedFilter={setAppliedFilter} />

      {/* Pass the filtered events to GoogleMapComp */}
      <GoogleMapComp markerList={filteredEvents} />
    </>
  );
};

export default Map;
