// import { BASE_URL } from "@/constant/constant";
// import React, { useState } from "react";
// import Link from "next/link";
// import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
// import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

// const NewlyVoopons = ({ staticItems, title, title1, brand }) => {
//   const [currentIndex, setCurrentIndex] = useState(0);

//   const itemsPerPage = 4;
//   const numPages = Math.ceil(staticItems?.length - itemsPerPage + 1);

//   const handleNext = () => {
//     setCurrentIndex((prevIndex) => (prevIndex + 1) % numPages);
//   };

//   const handlePrev = () => {
//     setCurrentIndex((prevIndex) => (prevIndex - 1 + numPages) % numPages);
//   };

//   const MAX_WORDS = 3; // Define the word limit

//   const truncateDescription = (description, wordLimit) => {
//     const words = description.split(" ");
//     if (words.length > wordLimit) {
//       return words.slice(0, wordLimit).join(" ") + "..."; // Truncate and add ellipsis
//     }
//     return description; // If under the limit, return the full description
//   };
//   const truncateDescriptionTitle = (description, wordLimit1) => {
//     const words = description.split(" ");
//     if (words.length > wordLimit1) {
//       return words.slice(0, wordLimit1).join(" ") + "..."; // Truncate and add ellipsis
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
//     // gap: "7px",
//   };

//   const itemStyles = {
//     flex: `0 0 ${100 / itemsPerPage}%`,
//     boxSizing: "border-box",
//     textAlign: "center",
//     // height: "450px",
//     height: "400px",
//   };

//   const buttonStyles = {
//     position: "absolute",
//     top: "50%",
//     transform: "translateY(-50%)",
//     backgroundColor: "transparent",
//     color: "red",
//     border: "none",
//     padding: "10px",
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
//     // border: "1px solid #ddd",
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
//                 className="owl-carousel owl-loaded owl-drag "
//                 style={itemContainerStyles}
//               >
//                 {staticItems?.length == 0 ? (
//                   <p>No Data Exist</p>
//                 ) : (
//                   staticItems?.map((item, index) => {
//                     console.log(item, "hello item data comes form this");
//                     return (
//                       <div className="brand-box" style={itemStyles} key={index}>
//                         <div className="brand-logo" style={boxStyles}>
//                           <div className="brand-heart">
//                             <form>
//                               <input
//                                 type="checkbox"
//                                 name="favorite"
//                                 id="favorite"
//                               />
//                             </form>
//                           </div>
//                           <img
//                             src={`${BASE_URL}/${
//                               item.vooponimage?.image_name ||
//                               item?.profile_image
//                             }`}
//                             alt={item.title}
//                             style={imgStyles}
//                           />
//                         </div>
//                         <div style={{ height: "30%" }}>
//                           <div className="voopon-heading">
//                             {item.voopons_name || item.name
//                               ? truncateDescriptionTitle(
//                                   item.voopons_name || item.name,
//                                   3
//                                 )
//                               : "No Title Available"}
//                           </div>
//                           <h6>
//                             {item?.voopons_description
//                               ? truncateDescription(
//                                   item.voopons_description,
//                                   MAX_WORDS
//                                 )
//                               : "No Description Available"}
//                           </h6>

//                           <p>
//                             {" "}
//                             Valid thru:{" "}
//                             {new Date(
//                               item.voopons_valid_thru
//                             ).toLocaleDateString("en-US", {
//                               year: "numeric",
//                               month: "short",
//                               day: "numeric",
//                             })}
//                           </p>
//                           {/* <p>
//                         {item &&
//                           item.hasOwnProperty("voopons_description") &&
//                           truncateDescription(
//                             item.voopons_description,
//                             MAX_WORDS
//                           )}
//                       </p> */}
//                         </div>
//                         <Link
//                           className="btn btn-viewmore"
//                           href={`/voopons/${item.category_id}`} // Use curly braces for JavaScript expressions
//                           role="button"
//                           // style={{ marginBottom: "5px" }}
//                         >
//                           View
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

// export default NewlyVoopons;

//

// code edited by 16-10

import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { BASE_URL } from "@/constant/constant";

import { useAuth } from "@/app/UserProvider";
import axios from "axios";
import { LightModeOutlined } from "@mui/icons-material";

//

const MAX_WORDS = 3;

const NewlyAddedVoop = ({ staticItems, brand }) => {
  const { userDetails, isAuthenticated } = useAuth();

  //

  // word Limitation

  const truncateDescriptionTitle = (description, wordLimit1) => {
    const words = description.split(" ");
    if (words.length > wordLimit1) {
      return words.slice(0, wordLimit1).join(" ") + "..."; // Truncate and add ellipsis
    }
    return description; // If under the limit, return the full description
  };
  //
  //
  const truncateDescription = (description, wordLimit) => {
    const words = description.split(" ");
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(" ") + "..."; // Truncate and add ellipsis
    }
    return description; // If under the limit, return the full description
  };

  /// handle click to navigate

  return (
    <>
      <div className="col-lg-12 mySwiper">
        <div className="heading mb-3">
          Newly <span>Added Voopons</span>
        </div>
      </div>
      <Swiper
        spaceBetween={20}
        style={{
          "--swiper-navigation-color": "#e60023",
          "--swiper-pagination-color": "#e60023",
        }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        keyboard={{ enabled: true }}
        pagination={{ clickable: false }}
        navigation={true}
        modules={[Autoplay, Navigation]}
        className="mySwiper"
        breakpoints={{
          320: {
            slidesPerView: 1, // Show 1 slide on mobile
          },
          640: {
            slidesPerView: 2, // Show 2 slides on small screens
          },
          1024: {
            slidesPerView: 3, // Show 3 slides on larger screens
          },
          1280: {
            slidesPerView: 4, // Show 4 slides on desktop screens
          },
        }}
      >
        {staticItems && staticItems.length > 0 ? (
          staticItems.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="item ">
                <div className="voopan-box">
                  <div className="voopon-logo">
                    <img
                      src={
                        item.vooponimage?.image_name || item?.profile_image
                          ? `${BASE_URL}/${
                              item.vooponimage?.image_name ||
                              item?.profile_image
                            }`
                          : "./images/voopons-logo-1.png"
                      }
                      style={{ width: "100%", height: "200px" }}
                      alt="brand"
                    />
                  </div>
                  <div className="voopon-heading">
                    {item.voopons_name || item.name
                      ? truncateDescriptionTitle(
                          item.voopons_name || item.name,
                          2
                        )
                      : "No Title Available"}
                  </div>

                  <h6>
                    {item?.voopons_description
                      ? truncateDescription(item.voopons_description, MAX_WORDS)
                      : "No Description Available"}
                  </h6>

                  <p>
                    Valid Thru:{" "}
                    {new Date(item.voopons_valid_thru).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      }
                    )}
                  </p>
                  <a
                    className="btn btn-viewmore"
                    role="button"
                    href={`/voopons/${item.category_id}`}
                  >
                    View More
                  </a>
                </div>
              </div>
            </SwiperSlide>
          ))
        ) : (
          <div
            className="no-data-message"
            style={{ textAlign: "center", color: "gray" }}
          >
            <h3>No Voopons Available</h3>
          </div>
        )}
      </Swiper>
    </>
  );
};

export default NewlyAddedVoop;
