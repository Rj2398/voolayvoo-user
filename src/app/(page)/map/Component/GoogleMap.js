"use client";

import React, { useEffect, useState, useRef } from "react";
import { BASE_URL, GOOGLE_KEY } from "@/constant/constant";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const containerStyle = {
  width: "100%",
  height: "713px",
};

function GoogleMapComp({ markerList, location }) {
  // console.log(markerList, "marker list and location", location);

  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef(null);
  const markersRef = useRef([]); // Store markers in a ref
  const [map, setMap] = useState(null);

  const center = {
    lat: Number(location.latitude),
    lng: Number(location.longitude),
  };

  const buildMapInfoCardContent = (info) => {
    return `
      <div class="map-inner-tooltip">
        <span style="display:block;text-align:right; margin-bottom:8px;">
          <img src="./images/map/loc-icon.svg" alt="" style="width: 16px; height: 20px;" />
          ${info?.distance?.toFixed(2)} miles away
        </span>
        <div class="map-inner-tooltip-in">
          <img src="${
            info?.profile_image
              ? BASE_URL + "/" + info?.eventimage?.image_name
              : "./images/map/brand-logo.svg"
          }" alt="" />
          <h1>${info?.events_name}</h1>
          <a href="/businesses/${info?.id}?business_id=${
      info?.business_id
    }">View Details <ArrowForwardIosIcon/></a>
        </div>
      </div>
    `;
  };

  const loadGoogleMapsScript = (callback) => {
    if (!document.querySelector(`script[src*="maps.googleapis.com"]`)) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = callback;
      document.head.appendChild(script);
    } else {
      callback();
    }
  };

  const clearMarkers = () => {
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];
  };

  const addMarkers = (mapInstance) => {
    if (markerList && markerList.length > 0) {
      markerList.forEach((markerData, index) => {
        if (!markerData.latitude || !markerData.longitude) {
          console.warn(`Invalid coordinates for marker at index ${index}`);
          return;
        }

        const markerPosition = {
          lat: Number(markerData.latitude),
          lng: Number(markerData.longitude),
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

        markersRef.current.push(marker);
      });
    }

    // 🔵 Add current location marker
    if (location?.latitude && location?.longitude) {
      const currentMarker = new window.google.maps.Marker({
        map: mapInstance,
        position: {
          lat: Number(location.latitude),
          lng: Number(location.longitude),
        },
        title: "Your Current Location",
        zIndex: 1, // keep it below others
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: "#4285F4",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 2,
        },
      });

      const currentLocationInfo = new window.google.maps.InfoWindow({
        content: `<div><strong>You are here</strong></div>`,
      });

      currentMarker.addListener("click", () => {
        currentLocationInfo.open(mapInstance, currentMarker);
      });

      markersRef.current.push(currentMarker);
    }
  };

  useEffect(() => {
    const initMap = () => {
      if (mapLoaded || !window.google || !window.google.maps) return;

      const mapOptions = {
        center,
        zoom: 2,
        // zoom: 14,
        mapId: "MY_NEXTJS_MAPID",
        fullscreenControl: false,
        mapTypeControl: false,
        zoomControlOptions: {
          position: window.google.maps.ControlPosition.TOP_RIGHT,
        },
      };

      const newMap = new window.google.maps.Map(mapRef.current, mapOptions);
      setMap(newMap);
      setMapLoaded(true);
    };

    loadGoogleMapsScript(initMap);
  }, [center, mapLoaded]);

  useEffect(() => {
    if (map) {
      clearMarkers();
      addMarkers(map);
    }
  }, [markerList, map]);

  return <div style={containerStyle} ref={mapRef} />;
}

export default GoogleMapComp;

// "use client";

// import React, { useEffect, useRef, useState } from "react";
// import { BASE_URL, GOOGLE_KEY } from "@/constant/constant";

// const containerStyle = {
//   width: "100%",
//   height: "713px",
// };

// function GoogleMapComp({ markerList = [] }) {
//   const mapRef = useRef(null);
//   const mapInstanceRef = useRef(null);
//   const markersRef = useRef([]);

//   const [location, setLocation] = useState(null);

//   /* -------------------- GET USER LOCATION -------------------- */
//   useEffect(() => {
//     if (!navigator.geolocation) {
//       console.error("Geolocation not supported");
//       return;
//     }

//     navigator.geolocation.getCurrentPosition(
//       (pos) => {
//         setLocation({
//           lat: pos.coords.latitude||0,
//           lng: pos.coords.longitude||0,
//         });
//       },
//       (err) => console.error(err.message),
//       { enableHighAccuracy: true }
//     );
//   }, []);

//   /* -------------------- LOAD GOOGLE MAP SCRIPT -------------------- */
//   useEffect(() => {
//     if (window.google?.maps) return initMap();

//     const script = document.createElement("script");
//     script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_KEY}&libraries=places`;
//     script.async = true;
//     script.onload = initMap;
//     document.head.appendChild(script);
//   }, [location]);

//   /* -------------------- INIT MAP -------------------- */
//   const initMap = () => {
//     if (!mapRef.current || !location || mapInstanceRef.current) return;

//     mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
//       center: location,
//       zoom: 14,
//       mapId: "MY_NEXTJS_MAPID",
//       fullscreenControl: false,
//       mapTypeControl: false,
//       zoomControlOptions: {
//         position: window.google.maps.ControlPosition.TOP_RIGHT,
//       },
//     });

//     addMarkers();
//   };

//   /* -------------------- INFO WINDOW CONTENT -------------------- */
//   const buildInfoContent = (info) => {
//     const image =
//       info?.eventimage?.image_name
//         ? `${BASE_URL}/${info.eventimage.image_name}`
//         : "/images/map/brand-logo.svg";

//     return `
//       <div class="map-inner-tooltip">
//         <span style="display:block;text-align:right;margin-bottom:6px;">
//           ${info?.distance?.toFixed(2) ?? "0"} miles away
//         </span>
//         <div class="map-inner-tooltip-in">
//           <img src="${image}" alt="" />
//           <h1>${info?.events_name ?? ""}</h1>
//           <a href="/businesses/${info?.id}?business_id=${info?.business_id}">
//             View Details →
//           </a>
//         </div>
//       </div>
//     `;
//   };

//   /* -------------------- CLEAR MARKERS -------------------- */
//   const clearMarkers = () => {
//     markersRef.current.forEach((m) => m.setMap(null));
//     markersRef.current = [];
//   };

//   /* -------------------- ADD MARKERS -------------------- */
//   const addMarkers = () => {
//     if (!mapInstanceRef.current) return;

//     clearMarkers();

//     /* Business markers */
//     markerList.forEach((item) => {
//       if (!item.latitude || !item.longitude) return;

//       const marker = new window.google.maps.Marker({
//         map: mapInstanceRef.current,
//         position: {
//           lat: Number(item.latitude),
//           lng: Number(item.longitude),
//         },
//         animation: window.google.maps.Animation.DROP,
//       });

//       const infoWindow = new window.google.maps.InfoWindow({
//         content: buildInfoContent(item),
//       });

//       marker.addListener("click", () => {
//         infoWindow.open(mapInstanceRef.current, marker);
//       });

//       markersRef.current.push(marker);
//     });

//     /* Current location marker */
//     if (location) {
//       const me = new window.google.maps.Marker({
//         map: mapInstanceRef.current,
//         position: location,
//         title: "Your location",
//         icon: {
//           path: window.google.maps.SymbolPath.CIRCLE,
//           scale: 8,
//           fillColor: "#4285F4",
//           fillOpacity: 1,
//           strokeColor: "#fff",
//           strokeWeight: 2,
//         },
//       });

//       markersRef.current.push(me);
//     }
//   };

//   /* -------------------- UPDATE MARKERS -------------------- */
//   useEffect(() => {
//     if (mapInstanceRef.current && location) {
//       mapInstanceRef.current.setCenter(location);
//       addMarkers();
//     }
//   }, [markerList, location]);

//   return <div ref={mapRef} style={containerStyle} />;
// }

// export default GoogleMapComp;
