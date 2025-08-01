// import { BASE_URL } from "@/constant/constant";
// import React, { useEffect, useState } from "react";
// import Link from "next/link";
// import { DateTime } from "luxon";
// import { convertTo12HourFormat } from "@/utils/eventFunction";

// //

// import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
// import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
// //
// const EventsNearYou = ({ staticItems, title, title1, brand }) => {
//   // here is to merge data into array

//   const [combinedArray, setCombinedArray] = useState([]);
//   useEffect(() => {
//     // Only proceed if staticItems and its properties exist
//     if (staticItems?.business_events && staticItems?.promoter_data) {
//       const updatedArrayTwo = staticItems.business_events.map((item) => {
//         if (item?.business_event_image) {
//           return {
//             ...item,
//             eventimage: item?.business_event_image,
//             business_event_image: null,
//           };
//         } else {
//           return item;
//         }
//       });

//       // Ensure both arrays are iterable and defined
//       if (
//         Array.isArray(staticItems.promoter_data) &&
//         Array.isArray(updatedArrayTwo)
//       ) {
//         const mergedArray = [...staticItems.promoter_data, ...updatedArrayTwo];
//         setCombinedArray(mergedArray);
//       }
//     }
//   }, [staticItems]);

//   //

//   //

//   const truncateDescriptionTitle = (description, wordLimit1) => {
//     const words = description.split(" ");
//     if (words.length > wordLimit1) {
//       return words.slice(0, wordLimit1).join(" ") + "..."; // Truncate and add ellipsis
//     }
//     return description; // If under the limit, return the full description
//   };
//   //

//   // Merge both arrays

//   const [currentIndex, setCurrentIndex] = useState(0);

//   const itemsPerPage = 4;
//   const numPages = Math.ceil(combinedArray?.length - itemsPerPage + 1);

//   const handleNext = () => {
//     setCurrentIndex((prevIndex) => (prevIndex + 1) % numPages);
//   };

//   const handlePrev = () => {
//     setCurrentIndex((prevIndex) => (prevIndex - 1 + numPages) % numPages);
//   };

//   const MAX_WORDS = 5; // Define the word limit

//   const truncateDescription = (description, wordLimit) => {
//     const words = description.split(" ");
//     if (words.length > wordLimit) {
//       return words.slice(0, wordLimit).join(" ") + "..."; // Truncate and add ellipsis
//     }
//     return description; // If under the limit, return the full description
//   };

//   // Inline CSS styles
//   const carouselStyles = {
//     position: "relative",
//     width: "100%",
//     overflow: "hidden",
//   };

//   const itemContainerStyles = {
//     display: "flex",
//     transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)`,
//     transition: "transform 0.5s ease",
//     gap: "7px",
//   };

//   const itemStyles = {
//     flex: `0 0 ${100 / itemsPerPage}%`,
//     boxSizing: "border-box",

//     textAlign: "center",
//     height: "440px",
//   };

//   const buttonStyles = {
//     position: "absolute",
//     top: "50%",
//     transform: "translateY(-50%)",
//     backgroundColor: "transparent",
//     color: "red",
//     border: "none",

//     cursor: "pointer",
//     zIndex: 9999,
//   };

//   const prevButtonStyles = {
//     ...buttonStyles,
//     left: "0%",
//     padding: "10px 20px",
//     backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
//     color: "#fff",
//     border: "none",
//     borderRadius: "5px",
//     cursor: "pointer",
//   };

//   const nextButtonStyles = {
//     ...buttonStyles,
//     right: "0%",
//     padding: "10px 20px",
//     backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
//     color: "#fff",
//     border: "none",
//     borderRadius: "5px",
//     cursor: "pointer",
//   };

//   const boxStyles = {
//     backgroundColor: "#fff",
//     border: "1px solid #ddd",
//     borderRadius: "8px",
//   };

//   const imgStyles = {
//     width: "100%",
//     height: "200Px",
//   };

//   return (
//     <section className="added-voopons">
//       <div className="container">
//         <div className="row">
//           <div className="col-lg-12">
//             <div className="heading mb-3">
//               {title}
//               <span> {title1} </span>
//             </div>
//           </div>

//           <div className="col-lg-12">
//             <div style={carouselStyles}>
//               <button style={prevButtonStyles} onClick={handlePrev}>
//                 <KeyboardArrowLeftIcon />
//               </button>

//               <div
//                 className="owl-carousel owl-loaded owl-drag"
//                 style={itemContainerStyles}
//               >
//                 {/* //   .slice(currentIndex, currentIndex + itemsPerPage) */}
//                 {combinedArray?.length == 0 ? (
//                   <p>No Data Exist</p>
//                 ) : (
//                   combinedArray?.map((item, index) => {
//                   
//                     return (
//                       <div
//                         className="event-brand-box"
//                         style={itemStyles}
//                         key={index}
//                       >
//                         <div className="brand-logo" style={boxStyles}>
//                           <span>
//                             {item.events_price == 0
//                               ? "GRAB DEAL"
//                               : `$${item.events_price}`}
//                           </span>
//                           <img
//                             src={`${BASE_URL}/${item.eventimage?.image_name}`}
//                             alt={item.title}
//                             style={imgStyles}
//                           />
//                         </div>
//                         <div className="event-pad" style={{ height: "42%" }}>
//                           <h6>
//                             {item.events_name
//                               ? truncateDescriptionTitle(item.events_name, 5)
//                               : "No Title Available"}
//                           </h6>
//                           <p>
//                             {" "}
//                             {item?.description
//                               ? truncateDescription(item.description, MAX_WORDS)
//                               : "No Description Available"}
//                           </p>
//                           <div className="point-icon">
//                             {/* <span>
//                             <img src="images/location-dot.png" />
//                             {item.distance.toFixed(2)} miles away
//                           </span>
//                           <br />
//                           <span>
//                             <img src="images/calendar.png" />
//                             {DateTime.fromFormat(
//                               item.events_date,
//                               "yyyy-MM-dd"
//                             ).toFormat("MMMM dd, yyyy")}
//                           </span>
//                           <span>
//                             <img src="images/watch.png" />
//                             {convertTo12HourFormat(
//                               item.events_start_time
//                             )} to {convertTo12HourFormat(item.events_end_time)}{" "}
//                           </span> */}

//                             <div className="point-icon">
//                               <div
//                                 style={{
//                                   width: "90%",

//                                   textAlign: "left",
//                                 }}
//                               >
//                                 <img
//                                   src="images/location-dot.png"
//                                   alt="Location Icon"
//                                 />
//                                 {item.distance.toFixed(2)} miles away
//                               </div>
//                               <div
//                                 style={{
//                                   width: "90%",

//                                   textAlign: "left",
//                                 }}
//                               >
//                                 <img
//                                   src="images/calendar.png"
//                                   alt="Calendar Icon"
//                                 />
//                                 {DateTime.fromFormat(
//                                   item.events_date,
//                                   "yyyy-MM-dd"
//                                 ).toFormat("MMMM dd, yyyy")}
//                               </div>
//                               <div
//                                 style={{
//                                   width: "90%",
//                                   textAlign: "left",
//                                 }}
//                               >
//                                 <img src="images/watch.png" alt="Watch Icon" />
//                                 {convertTo12HourFormat(
//                                   item.events_start_time
//                                 )}{" "}
//                                 to {convertTo12HourFormat(item.events_end_time)}
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                         <Link
//                           className="btn btn-viewmore-border btn-align"
//                           // href={`/events/${item.id}?promoter_id=${item.promoter_id}`}
//                           href={`/events/${item.checked_id}?promoter_id=${item.promoter_id}`}
//                           role="button"
//                         >
//                           View More
//                         </Link>
//                       </div>
//                     );
//                   })
//                 )}
//               </div>

//               <button style={nextButtonStyles} onClick={handleNext}>
//                 <KeyboardArrowRightIcon />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default EventsNearYou;

//

// code date for responsive  16-10-2024

import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { DateTime } from "luxon";
import { Autoplay, Navigation } from "swiper/modules";
import { BASE_URL } from "@/constant/constant";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/UserProvider";
import axios from "axios";
import { convertTo12HourFormat } from "@/utils/eventFunction";

const MAX_WORDS = 5;

const EventsNearYou = ({ staticItems }) => {
  const { isAuthenticated } = useAuth();
  const [combinedArray, setCombinedArray] = useState([]);

  useEffect(() => {
    if (staticItems?.business_events && staticItems?.promoter_data) {
      const updatedBusinessEvents = staticItems.business_events.map((item) => ({
        ...item,
        eventimage: item?.business_event_image,
      }));

      const mergedArray = [
        ...staticItems.promoter_data,
        ...updatedBusinessEvents,
      ];
      setCombinedArray(mergedArray);
    }
  }, [staticItems]);

  const truncateDescriptionTitle = (description, wordLimit) => {
    const words = description.split(" ");
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + "..."
      : description;
  };

  const truncateDescription = (description, wordLimit) => {
    const words = description.split(" ");
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + "..."
      : description;
  };

  return (
    <>
      {/* Heading Section */}
      <div className="col-lg-12 mySwiper">
        <div className="heading mb-3">
          Events <span>Near You</span>
        </div>
      </div>

      {/* Swiper Slider */}
      <Swiper
        style={{
          "--swiper-navigation-color": "#e60023",
          "--swiper-pagination-color": "#e60023",
        }}
        spaceBetween={20}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        keyboard={{ enabled: true }}
        pagination={{ clickable: false }}
        navigation={true}
        modules={[Autoplay, Navigation]}
        className="mySwiper"
        breakpoints={{
          320: { slidesPerView: 1 },
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
          1280: { slidesPerView: 4 },
        }}
      >
        {combinedArray && combinedArray.length > 0 ? (
          combinedArray.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="item">
                <div className="event-brand-box">
                  <div className="brand-logo">
                    <span>
                      {item.events_price == 0
                        ? "GRAB DEAL"
                        : `$${item.events_price}`}
                    </span>
                    <img
                      src={
                        item.eventimage?.image_name
                          ? `${BASE_URL}/${item.eventimage?.image_name}`
                          : "./images/near-event1.png"
                      }
                      alt={item.events_name || "Event"}
                      style={{ width: "100%", height: "200px" }}
                    />
                  </div>
                  <div className="event-pad">
                    <h6>
                      {item.events_name
                        ? truncateDescriptionTitle(item.events_name, 4)
                        : "No Title Available"}
                    </h6>
                    <p>
                      {item.description
                        ? truncateDescription(item.description, MAX_WORDS)
                        : "No Description Available"}
                    </p>
                    <div className="point-icon">
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: "8px",
                        }}
                      >
                        <img src="./images/location-dot.png" alt="Location" />
                        <span style={{ marginLeft: "5px" }}>
                          {item.distance.toFixed(2)} miles away
                        </span>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: "8px",
                        }}
                      >
                        <img src="./images/calendar.png" alt="Calendar" />
                        <span style={{ marginLeft: "5px" }}>
                          {DateTime.fromFormat(
                            item.events_date,
                            "yyyy-MM-dd"
                          ).toFormat("MMMM dd, yyyy")}
                        </span>
                      </div>

                      <div style={{ display: "flex", alignItems: "center" }}>
                        <img src="./images/watch.png" alt="Time" />
                        <span style={{ marginLeft: "5px" }}>
                          {convertTo12HourFormat(item.events_start_time)} to{" "}
                          {convertTo12HourFormat(item.events_end_time)}
                        </span>
                      </div>
                    </div>

                    <a
                      className="btn btn-viewmore-border"
                      href={`/events/${item.checked_id}?promoter_id=${item.promoter_id}`}
                      role="button"
                    >
                      View More
                    </a>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))
        ) : (
          <div
            className="no-data-message"
            style={{ textAlign: "center", color: "gray" }}
          >
            <h3>No Events Available</h3>
          </div>
        )}
      </Swiper>
    </>
  );
};

export default EventsNearYou;
