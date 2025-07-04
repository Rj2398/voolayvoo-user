"use client";

import React, { useEffect, useState, useRef } from "react";
import { BASE_URL, GOOGLE_KEY } from "@/constant/constant";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
const containerStyle = {
  width: "100%",
  height: "713px",
};

function GoogleMapComp({ markerList, location }) {
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef(null);
  const markersRef = useRef([]); // Store markers in a ref
  const [map, setMap] = useState(null);

  // const [location, setLocation] = useState({ latitude: "28.3901952", longitude: "79.4066944" });

  // useEffect(() => {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         setLocation({
  //           latitude: position.coords.latitude,
  //           longitude: position.coords.longitude,
  //         });
  //       },
  //       (err) => {
  //         console.error(err.message);
  //       }
  //     );
  //   } else {
  //     console.error("Geolocation is not supported by this browser.");
  //   }
  // }, []);

  const center = {
    lat: Number(location.latitude), // Provide a default value to prevent null error
    lng: Number(location.longitude),
  };

  // const center = {
  //   lat: 28.535517,
  //   lng: 77.391029,
  // };

  // const buildMapInfoCardContent = (info: any): string => {

  //   return `
  //     <div class="map-inner-tooltip">
  //       <span style="display:block;text-align:right; margin-bottom:8px;">
  //         <img src="./images/map/loc-icon.svg" alt="" style="width: 16px; height: 20px;" />
  //         ${info?.distance} miles away
  //       </span>
  //       <div class="map-inner-tooltip-in">
  //         <img src="${
  //           info?.profile_image
  //             ? BASE_URL + "/" + info?.eventimage?.image_name
  //             : "./images/map/brand-logo.svg"
  //         }" alt="" />
  //         <h1>${info?.events_name}</h1>
  //         <a href="/businesses/${
  //           info?.id
  //         }">View Details <i class="far fa-chevron-right"></i></a>
  //       </div>
  //     </div>
  //   `;
  // };

  const buildMapInfoCardContent = (info) => {

    return `
      <div class="map-inner-tooltip">
        <span style="display:block;text-align:right; margin-bottom:8px;">
          <img src="./images/map/loc-icon.svg" alt="" style="width: 16px; height: 20px;" />
          ${info?.distance} miles away
        </span>
        <div class="map-inner-tooltip-in">
          <img src="${
            info?.profile_image
              ? BASE_URL + "/" + info?.eventimage?.image_name
              : "./images/map/brand-logo.svg"
          }" alt="" />
          <h1>${info?.events_name}rajan</h1>
          <a href="/businesses/${
            info?.id
          }">View Details <ArrowForwardIosIcon/></a>
        </div>
      </div>
    `;
  };

  // Function to load the Google Maps script
  const loadGoogleMapsScript = (callback) => {
    if (!document.querySelector(`script[src*="maps.googleapis.com"]`)) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = callback;
      document.head.appendChild(script);
    } else {
      callback(); // If the script is already loaded, just call the callback
    }
  };

  const clearMarkers = () => {
    // Clear old markers from the map
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = []; // Reset markers array
  };

  const addMarkers = (mapInstance) => {
    if (!markerList || markerList.length === 0) {
      console.warn("No markers to display.");
      return;
    }

    markerList.forEach((markerData, index) => {
      if (!markerData.latitude || !markerData.longitude) {
        console.warn(`Invalid coordinates for marker at index ${index}`);
        return;
      }

      const markerPosition = {
        lat: Number(markerData?.latitude),
        lng: Number(markerData?.longitude),
      };

      const marker = new window.google.maps.Marker({
        map: mapInstance,
        position: markerPosition,
        title: markerData.title,
        animation: window.google.maps.Animation.DROP,
      });

      const infoCard = new window.google.maps.InfoWindow({
        content: buildMapInfoCardContent(markerData),
        minWidth: 200,
      });

      marker.addListener("click", () => {
        infoCard.open(mapInstance, marker);
      });

      markersRef.current.push(marker); // Add marker to the ref array
    });
  };

  useEffect(() => {
    const initMap = () => {
      if (mapLoaded || !window.google || !window.google.maps) return;

      const mapOptions = {
        center,
        zoom: 6,
        mapId: "MY_NEXTJS_MAPID",
        fullscreenControl: false,
        mapTypeControl: false,
        zoomControlOptions: {
          position: window.google.maps.ControlPosition.TOP_RIGHT,
        },
      };

      const newMap = new window.google.maps.Map(mapRef.current, mapOptions);

      setMap(newMap); // Store the map instance
      setMapLoaded(true);
    };

    loadGoogleMapsScript(initMap);
  }, [center, mapLoaded]);

  useEffect(() => {
    if (map) {
      clearMarkers(); // Clear old markers before adding new ones
      addMarkers(map); // Add new markers when markerList changes
    }
  }, [markerList, map]);

  return <div style={containerStyle} ref={mapRef} />;
}

export default GoogleMapComp;
