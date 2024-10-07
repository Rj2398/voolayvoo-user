// "use client";

// import React, { useEffect, useState } from "react";
// import { BASE_URL, GOOGLE_KEY } from "@/constant/constant";

// const containerStyle = {
//   width: "100%",
//   height: "713px",
// };

// function GoogleMapComp({ markerList }: { markerList: any[] }) {
//   const [mapLoaded, setMapLoaded] = useState(false);
//   const mapRef = React.useRef<HTMLDivElement>(null);

//   console.log(markerList, "marker location data latest data comes fromthsi");
//   const [location, setLocation] = useState({ latitude: null, longitude: null });
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           setLocation({
//             latitude: position.coords.latitude,
//             longitude: position.coords.longitude,
//           });
//         },
//         (err) => {
//           setError(err.message);
//         }
//       );
//     } else {
//       setError("Geolocation is not supported by this browser.");
//     }
//   }, []);

//   const center = {
//     lat: location.latitude,
//     lng: location.longitude,
//   };
//   console.log(center, "hello location data comes form thsi");
//   const buildMapInfoCardContent = (info: any): string => {
//     return `
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
//         <h1>Rajan ${info?.events_name}</h1>
//         <a href="/businesses/${
//           info?.id
//         }">View Details <i class="far fa-chevron-right"></i></a>
//       </div>
//     </div>
//     `;
//   };

//   // Function to load the Google Maps script
//   const loadGoogleMapsScript = (callback: () => void) => {
//     if (!document.querySelector(`script[src*="maps.googleapis.com"]`)) {
//       const script = document.createElement("script");
//       script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_KEY}&libraries=places`;
//       script.async = true;
//       script.defer = true;
//       script.onload = callback;
//       document.head.appendChild(script);
//     } else {
//       callback(); // If the script is already loaded, just call the callback
//     }
//   };

//   useEffect(() => {
//     const initMap = () => {
//       if (mapLoaded || !window.google || !window.google.maps) return;

//       const mapOptions: google.maps.MapOptions = {
//         center,
//         zoom: 10,
//         mapId: "MY_NEXTJS_MAPID",
//         fullscreenControl: false,
//         mapTypeControl: false,
//         zoomControlOptions: {
//           position: window.google.maps.ControlPosition.TOP_RIGHT,
//         },
//       };

//       const map = new window.google.maps.Map(
//         mapRef.current as HTMLDivElement,
//         mapOptions
//       );

//       if (!markerList || markerList.length === 0) {
//         console.warn("No markers to display.");
//         return;
//       }

//       // Loop through the markerList and add markers
//       markerList.forEach((markerData, index) => {
//         if (!markerData.latitude || !markerData.longitude) {
//           console.warn(`Invalid coordinates for marker at index ${index}`);
//           return;
//         }

//         const markerPosition = {
//           lat: Number(markerData?.latitude),
//           lng: Number(markerData?.longitude),
//         };

//         console.log(`Adding marker at position:`, markerPosition);

//         const marker = new window.google.maps.Marker({
//           map,
//           position: markerPosition,
//           title: markerData.title,
//           animation: window.google.maps.Animation.DROP,
//         });

//         const infoCard = new window.google.maps.InfoWindow({
//           content: buildMapInfoCardContent(markerData),
//           minWidth: 200,
//         });

//         marker.addListener("click", () => {
//           infoCard.open(map, marker);
//         });
//       });

//       setMapLoaded(true);
//     };

//     loadGoogleMapsScript(initMap);
//   }, [markerList, mapLoaded]); // Re-run when markerList or mapLoaded changes

//   return <div style={containerStyle} ref={mapRef} />;
// }

// export default GoogleMapComp;
// code written by rajan

"use client";

import React, { useEffect, useState, useRef } from "react";
import { BASE_URL, GOOGLE_KEY } from "@/constant/constant";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
const containerStyle = {
  width: "100%",
  height: "713px",
};

function GoogleMapComp({ markerList }) {
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef(null);
  const markersRef = useRef([]); // Store markers in a ref
  const [map, setMap] = useState(null);

  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (err) => {
          setError(err.message);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, []);

  // const center = {
  //   lat: location.latitude || 0, // Provide a default value to prevent null error
  //   lng: location.longitude || 0,
  // };

  const center = {
    lat: 28.535517,
    lng: 77.391029,
  };

  // const buildMapInfoCardContent = (info: any): string => {
  //   console.log(info, "hello world");

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
    console.log(info, "hello world");

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
        zoom: 10,
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
