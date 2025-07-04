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

// import React, { useEffect, useState } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/navigation";
// import { Autoplay, Pagination, Navigation } from "swiper/modules";
// import { BASE_URL } from "@/constant/constant";

// import { useAuth } from "@/app/UserProvider";
// import axios from "axios";
// import { LightModeOutlined } from "@mui/icons-material";

// //

// const MAX_WORDS = 3;

// const NewlyAddedVoop = ({ staticItems, brand }) => {
//   const { userDetails, isAuthenticated } = useAuth();

//   //

//   // word Limitation

//   const truncateDescriptionTitle = (description, wordLimit1) => {
//     const words = description.split(" ");
//     if (words.length > wordLimit1) {
//       return words.slice(0, wordLimit1).join(" ") + "..."; // Truncate and add ellipsis
//     }
//     return description; // If under the limit, return the full description
//   };
//   //
//   //
//   const truncateDescription = (description, wordLimit) => {
//     const words = description.split(" ");
//     if (words.length > wordLimit) {
//       return words.slice(0, wordLimit).join(" ") + "..."; // Truncate and add ellipsis
//     }
//     return description; // If under the limit, return the full description
//   };

//   /// handle click to navigate

//   return (
//     <>
//       <div className="col-lg-12 mySwiper">
//         <div className="heading mb-3">
//           Newly <span>Added Voopons</span>
//         </div>
//       </div>
//       <Swiper
//         spaceBetween={20}
//         style={{
//           "--swiper-navigation-color": "#e60023",
//           "--swiper-pagination-color": "#e60023",
//         }}
//         autoplay={{ delay: 3000, disableOnInteraction: false }}
//         keyboard={{ enabled: true }}
//         pagination={{ clickable: false }}
//         navigation={true}
//         modules={[Autoplay, Navigation]}
//         className="mySwiper"
//         breakpoints={{
//           320: {
//             slidesPerView: 1, // Show 1 slide on mobile
//           },
//           640: {
//             slidesPerView: 2, // Show 2 slides on small screens
//           },
//           1024: {
//             slidesPerView: 3, // Show 3 slides on larger screens
//           },
//           1280: {
//             slidesPerView: 4, // Show 4 slides on desktop screens
//           },
//         }}
//       >
//         {staticItems && staticItems.length > 0 ? (
//           staticItems.map((item, index) => (
//             <SwiperSlide key={index}>
//               <div className="item ">
//                 <div className="voopan-box">
//                   <div className="voopon-logo">
//                     <img
//                       // src={item.vooponimage?.image_name || item?.profile_image? `${BASE_URL}/${item.vooponimage?.image_name || item?.profile_image}`: "./images/voopons-logo-1.png"}

//                       src={item?.vooponimage?.image_name ? `${BASE_URL}${item.vooponimage.image_name}` : item?.business_voopon_image?.image_name ? `${BASE_URL}${item.business_voopon_image.image_name}` : item?.profile_image ? `${BASE_URL}${item.profile_image}` : "./images/voopons-logo-1.png" }

//                       style={{ width: "100%", height: "200px" }}
//                       alt="brand"
//                     />
//                   </div>
//                   <div className="voopon-heading">
//                     {item.voopons_name || item.name
//                       ? truncateDescriptionTitle(
//                           item.voopons_name || item.name,
//                           2
//                         )
//                       : "No Title Available"}
//                   </div>

//                   <h6>
//                     {item?.voopons_description
//                       ? truncateDescription(item.voopons_description, MAX_WORDS)
//                       : "No Description Available"}
//                   </h6>

//                   <p>
//                     Valid Thru:{" "}
//                     {new Date(item.voopons_valid_thru).toLocaleDateString(
//                       "en-US",
//                       {
//                         year: "numeric",
//                         month: "short",
//                         day: "numeric",
//                       }
//                     )}
//                   </p>
//                   <a
//                     className="btn btn-viewmore"
//                     role="button"
//                     href={`/voopons/${item.category_id}`}
//                   >
//                     View More
//                   </a>
//                 </div>
//               </div>
//             </SwiperSlide>
//           ))
//         ) : (
//           <div
//             className="no-data-message"
//             style={{ textAlign: "center", color: "gray" }}
//           >
//             <h3>No Voopons Available</h3>
//           </div>
//         )}
//       </Swiper>
//     </>
//   );
// };

// export default NewlyAddedVoop;











// new change for sweeper outside the section acc to bug sheet

// import React, { useState } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/navigation";
// import { Autoplay, Pagination, Navigation } from "swiper/modules";
// import { BASE_URL } from "@/constant/constant";
// import { useAuth } from "@/app/UserProvider";

// const MAX_WORDS = 3;

// const NewlyAddedVoop = ({ staticItems }) => {
//   const { isAuthenticated } = useAuth();
//   const [swiperInstance, setSwiperInstance] = useState(null);

//   const truncateDescriptionTitle = (description, wordLimit1) => {
//     const words = description.split(" ");
//     if (words.length > wordLimit1) {
//       return words.slice(0, wordLimit1).join(" ") + "...";
//     }
//     return description;
//   };

//   const truncateDescription = (description, wordLimit) => {
//     const words = description.split(" ");
//     if (words.length > wordLimit) {
//       return words.slice(0, wordLimit).join(" ") + "...";
//     }
//     return description;
//   };

//   return (
//     <>
//       <div className="col-lg-12 mySwiper">
//         <div className="heading mb-3">
//           Newly <span>Added Voopons</span>
//         </div>
//       </div>
//       <div className="voopons-container" style={{ position: 'relative', padding: '0 0px', border:"1px solid white" }}>
//         <Swiper
//           onSwiper={setSwiperInstance}
//           style={{
//             "--swiper-navigation-color": "#e60023",
//             "--swiper-pagination-color": "#e60023",
//             "--swiper-navigation-size": "30px",
//           }}
//           spaceBetween={20}
//           slidesPerView={4}
//           autoplay={{ delay: 3000, disableOnInteraction: false }}
//           keyboard={{ enabled: true }}
//           pagination={{ clickable: false }}
//           navigation={{
//             nextEl: '.swiper-button-next-voopons',
//             prevEl: '.swiper-button-prev-voopons',
//           }}
//           modules={[Autoplay, Navigation]}
//           className="mySwiper"
//           breakpoints={{
//             320: {
//               slidesPerView: 1,
//               spaceBetween: 10,
//             },
//             640: {
//               slidesPerView: 2,
//               spaceBetween: 15,
//             },
//             1024: {
//               slidesPerView: 3,
//               spaceBetween: 20,
//             },
//             1280: {
//               slidesPerView: 4,
//               spaceBetween: 20,
//             },
//           }}
//         >
//           {staticItems && staticItems.length > 0 ? (
//             staticItems.map((item, index) => (
//               <SwiperSlide key={index}>
//                 <div className="item" style={{height:"100%"}}>
//                   <div className="voopan-box" style={{
//                     height: "100%",
//                     display:"flex",
//                     flexDirection:"column",
//                     justifyContent:"space-between"
//                   }}>
//                     <div>
//                     <div className="voopon-logo" style={{height: "200px", overflow: "hidden"}}>
//                       <img
//                         src={
//                           item?.vooponimage?.image_name 
//                             ? `${BASE_URL}${item.vooponimage.image_name}` 
//                             : item?.business_voopon_image?.image_name 
//                               ? `${BASE_URL}${item.business_voopon_image.image_name}` 
//                               : item?.profile_image 
//                                 ? `${BASE_URL}${item.profile_image}` 
//                                 : "./images/voopons-logo-1.png"
//                         }
//                         style={{ width: "100%", height: "200px", objectFit:"cover" }}
//                         alt="brand"
//                       />
//                     </div>

//                     <div className="voopon-heading" style={{minHeight: "50px", margin: "10px 0"}}>
//                       {item.voopons_name || item.name
//                         ? truncateDescriptionTitle(item.voopons_name || item.name, 2)
//                         : "No Title Available"}
//                     </div>
//                     <h6 style={{minHeight: "60px", margin: "10px 0"}}>
//                       {item?.voopons_description
//                         ? truncateDescription(item.voopons_description, MAX_WORDS)
//                         : "No Description Available"}
//                     </h6>
//                     {/* <h6 style={{ 
//                         minHeight: '60px',
//                         marginBottom: '12px',
//                         fontSize: '14px',
//                         color: '#555',
//                         lineHeight: '1.4',
//                         overflow: 'hidden',
//                         textOverflow: 'ellipsis',
//                         display: '-webkit-box',
//                         WebkitLineClamp: 3,
//                         WebkitBoxOrient: 'vertical'
//                       }}>
//                         {item?.voopons_description
//                           ? truncateDescription(item.voopons_description, MAX_WORDS)
//                           : "No Description Available"}
//                       </h6> */}
//                     </div>

//                     <div>
//                     {/* <p style={{margin:"10px 0"}}>
//                       Valid Thru:{" "}
//                       {new Date(item.voopons_valid_thru).toLocaleDateString("en-US", {
//                         year: "numeric",
//                         month: "short",
//                         day: "numeric",
//                       })}
//                     </p> */}
//                     <p style={{ 
//                         marginBottom: '12px',
//                         fontSize: '13px',
//                         color: '#666'
//                       }}>
//                         Valid Thru:{" "}
//                         {new Date(item.voopons_valid_thru).toLocaleDateString("en-US", {
//                           year: "numeric",
//                           month: "short",
//                           day: "numeric",
//                         })}
//                       </p>
//                     <a
//                       className="btn btn-viewmore"
//                       role="button"
//                       href={`/voopons/${item.category_id}`}
//                       style={{
//                         // display:"block",
//                         // marginTop:"10px"
//                       }}
//                     >
//                       View More
//                     </a>
//                   </div>
//                 </div>
//                 </div>
//               </SwiperSlide>
//             ))
//           ) : (
//             <div className="no-data-message" style={{ textAlign: "center", color: "gray" }}>
//               <h3>No Voopons Available</h3>
//             </div>
//           )}
//         </Swiper>

//         <div 
//           className="swiper-button-prev-voopons"
//           style={{ 
//             left: '10px',
//             top: '50%',
//             transform: 'translateY(-50%)',
//             position: 'absolute',
//             zIndex: 10,
//             cursor: 'pointer',
//           }}
//           onClick={() => swiperInstance?.slidePrev()}
//         >
//           <svg width="40" height="40" viewBox="0 0 24 24" fill="#e60023">
//             <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/>
//           </svg>
//         </div>
//         <div 
//           className="swiper-button-next-voopons"
//           style={{ 
//             right: '10px',
//             top: '50%',
//             transform: 'translateY(-50%)',
//             position: 'absolute',
//             zIndex: 10,
//             cursor: 'pointer'
//           }}
//           onClick={() => swiperInstance?.slideNext()}
//         >
//           <svg width="40" height="40" viewBox="0 0 24 24" fill="#e60023">
//             <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
//           </svg>
//         </div>
//       </div>
//     </>
//   );
// };

// export default NewlyAddedVoop;




import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { BASE_URL } from "@/constant/constant";
import { useAuth } from "@/app/UserProvider";

const MAX_WORDS = 3;

const NewlyAddedVoop = ({ staticItems }) => {
  const { isAuthenticated } = useAuth();
  const [swiperInstance, setSwiperInstance] = useState(null);

  const truncateDescriptionTitle = (description, wordLimit1) => {
    const words = description.split(" ");
    if (words.length > wordLimit1) {
      return words.slice(0, wordLimit1).join(" ") + "...";
    }
    return description;
  };

  const truncateDescription = (description, wordLimit) => {
    const words = description.split(" ");
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(" ") + "...";
    }
    return description;
  };

  return (
    <>
    <div style={{backgroundColor:"#fbf8f8"}}>
      <div className="col-lg-12 mySwiper">
        <div className="heading mb-3">
          Newly <span>Added Voopons</span>
        </div>
      </div>
      <div className="voopons-container" style={{ position: 'relative', padding: '0 0px', border:"1px solid #fbf8f8" }}>
        <Swiper
          onSwiper={setSwiperInstance}
          style={{
            "--swiper-navigation-color": "#e60023",
            "--swiper-pagination-color": "#e60023",
            "--swiper-navigation-size": "30px",
          }}
          spaceBetween={20}
          slidesPerView={4}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          keyboard={{ enabled: true }}
          pagination={{ clickable: false }}
          navigation={{
            nextEl: '.swiper-button-next-voopons',
            prevEl: '.swiper-button-prev-voopons',
          }}
          modules={[Autoplay, Navigation]}
          className="mySwiper"
          breakpoints={{
            320: {
              slidesPerView: 1,
              spaceBetween: 10,
            },
            640: {
              slidesPerView: 2,
              spaceBetween: 15,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
            1280: {
              slidesPerView: 4,
              spaceBetween: 20,
            },
          }}
        >
          {staticItems && staticItems.length > 0 ? (
            staticItems.map((item, index) => (
              <SwiperSlide key={index} style={{ height: 'auto' }}>
                <div className="item" style={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <div className="voopan-box" style={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    padding: '15px',
                    boxSizing: 'border-box'
                  }}>
                    <div>
                      <div className="voopon-logo" style={{
                        height: '180px',
                        overflow: 'hidden',
                        borderRadius: '4px',
                        marginBottom: '12px'
                      }}>
                        <img
                          src={
                            item?.vooponimage?.image_name
                              ? `${BASE_URL}${item.vooponimage.image_name}`
                              : item?.business_voopon_image?.image_name
                                ? `${BASE_URL}${item.business_voopon_image.image_name}`
                                : item?.profile_image
                                  ? `${BASE_URL}${item.profile_image}`
                                  : "./images/voopons-logo-1.png"
                          }
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover"
                          }}
                          alt="brand"
                        />
                      </div>
                      {/* <div className="voopon-heading" style={{ 
                        minHeight: '48px',
                        marginBottom: '10px',
                        fontSize: '16px',
                        fontWeight: '600',
                        lineHeight: '1.3',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}>
                        {item.voopons_name || item.name
                          ? truncateDescriptionTitle(item.voopons_name || item.name, 2)
                          : "No Title Available"}
                      </div> */}

                      <div className="voopon-heading" style={{ minHeight: "50px", margin: "10px 0" }}>
                        {item.voopons_name || item.name
                          ? truncateDescriptionTitle(item.voopons_name || item.name, 2)
                          : "No Title Available"}
                      </div>
                      {/* <h6 style={{ 
                        minHeight: '60px',
                        marginBottom: '12px',
                        fontSize: '14px',
                        color: '#555',
                        lineHeight: '1.4',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical'
                      }}>
                        {item?.voopons_description
                          ? truncateDescription(item.voopons_description, MAX_WORDS)
                          : "No Description Available"}
                      </h6> */}
                      <h6 style={{ minHeight: "60px", margin: "10px 0" }}>
                        {item?.voopons_description
                          ? truncateDescription(item.voopons_description, MAX_WORDS)
                          : "No Description Available"}
                      </h6>
                    </div>
                    <div>
                      <p style={{
                        marginBottom: '12px',
                        fontSize: '13px',
                        color: '#666'
                      }}>
                        Valid Thru:{" "}
                        {new Date(item.voopons_valid_thru).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                      {/* <a
                        className="btn btn-viewmore"
                        role="button"
                        href={`/voopons/${item.category_id}`}
                        style={{ 
                          display: 'block',
                          width: '100%',
                          padding: '8px 0',
                          backgroundColor: '#e60023',
                          color: 'white',
                          textAlign: 'center',
                          borderRadius: '4px',
                          textDecoration: 'none',
                          fontWeight: '500'
                        }}
                      >
                        View More
                      </a> */}
                      <a
                        className="btn btn-viewmore"
                        role="button"
                        href={`/voopons/${item.category_id}`}
                        style={{
                          // display:"block",
                          // marginTop:"10px"
                        }}
                      >
                        View More
                      </a>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))
          ) : (
            <div className="no-data-message" style={{ textAlign: "center", color: "gray" }}>
              <h3>No Voopons Available</h3>
            </div>
          )}
        </Swiper>

        <div
          className="swiper-button-prev-voopons"
          style={{
            left: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            position: 'absolute',
            zIndex: 10,
            cursor: 'pointer',
          }}
          onClick={() => swiperInstance?.slidePrev()}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="#e60023">
            <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" />
          </svg>
        </div>
        <div
          className="swiper-button-next-voopons"
          style={{
            right: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            position: 'absolute',
            zIndex: 10,
            cursor: 'pointer'
          }}
          onClick={() => swiperInstance?.slideNext()}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="#e60023">
            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
          </svg>
        </div>
      </div>
      </div>
    </>
  );
};

export default NewlyAddedVoop;