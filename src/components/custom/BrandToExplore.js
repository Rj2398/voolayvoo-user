// import { BASE_URL } from "@/constant/constant";
// import React, { useEffect, useState } from "react";
// import Link from "next/link";
// import { useAuth } from "@/app/UserProvider";
// import axios from "axios";
// import { useRouter } from "next/navigation";
// import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
// import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
// import { BackHand } from "@mui/icons-material";

// const BrandToExplore = ({ staticItems, title, title1, brand }) => {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const { userDetails, isAuthenticated } = useAuth();
//   //
//   const router = useRouter();
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

//   const [buttonStatus, setButtonStatus] = useState({});
//   //
//   useEffect(() => {
//     const initialButtonStatus = staticItems?.reduce((acc, item) => {
//       acc[item.id] = false;
//       return acc;
//     }, {});
//     setButtonStatus(initialButtonStatus);
//   }, [staticItems]);
//   //
//   const itemsPerPage = 4;
//   const numPages = Math.ceil(staticItems?.length - itemsPerPage + 1);

//   const handleNext = () => {
//     setCurrentIndex((prevIndex) => (prevIndex + 1) % numPages);
//   };

//   const handlePrev = () => {
//     setCurrentIndex((prevIndex) => (prevIndex - 1 + numPages) % numPages);
//   };

//   const MAX_WORDS = 10; // Define the word limit

//   const truncateDescription = (description, wordLimit) => {
//     const words = description.split(" ");
//     if (words.length > wordLimit) {
//       return words.slice(0, wordLimit).join(" ") + "..."; // Truncate and add ellipsis
//     }
//     return description; // If under the limit, return the full description
//   };

//   // //
//   const handleFavoriteClick = async (item) => {
//     // Toggle like status based on the current state
//     const isLiked = buttonStatus[item]; // Check current like status

//     // Prepare FormData
//     const formData = new FormData();
//     formData.append("user_id", userDetails.user_id);
//     formData.append("business_id", item.toString());
//     formData.append("like_status", isLiked ? "0" : "1"); // Toggle between 'like' (1) and 'unlike' (0)

//       item,
//       userDetails.user_id,
//       isLiked,
//       "params comes form home screen"
//     );

//     try {
//       const response = await axios.post(
//         `${BASE_URL}/api/auth/user_favorite_business`,
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//             Authorization: `Bearer ${userDetails.token}`,
//           },
//         }
//       );

//       // Toggle the button status
//       setButtonStatus((prevStatus) => ({
//         ...prevStatus,
//         [item]: !isLiked, // Toggle the status of the button
//       }));

//     } catch (error) {
//       console.error("Error updating like status:", error);
//     }
//   };

//   //

//   const handleClick = (item) => {
//     if (!isAuthenticated) {
//       // Redirect to auth-users if not authenticated
//       router.push("/auth-users");
//     } else {
//       // Navigate to the appropriate link

//       router.push(
//         brand == true
//           ? `/voopons/${item.category_id}`
//           : `/businesses/${item?.id}?business_id=${item?.id}`
//       );
//     }
//   };

//   //

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
//     height: "360px",
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
//     border: "1px solid #ddd",
//     borderRadius: "8px",
//   };

//   const imgStyles = {
//     width: "100%",
//     height: "200Px",
//   };

//   // Inline styles
//   const buttonStyle = {
//     backgroundColor: "#e60023", // Change color on hover
//     color: "white",
//     padding: "10px 20px",
//     border: "none",
//     borderRadius: "4px",
//     cursor: "pointer",
//     transition: "background-color 0.3s ease",
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
//                 {staticItems?.length == 0 ? (
//                   <p>No Data Exist </p>
//                 ) : (
//                   staticItems?.map((item, index) => {
//                     return (
//                       <div className="brand-box" style={itemStyles} key={index}>
//                         <div className="brand-logo" style={boxStyles}>
//                           <div
//                             className="brand-heart"
//                             style={{ opacity: !isAuthenticated ? 0.5 : 1 }}
//                           >
//                             <input
//                               type="checkbox"
//                               id={`favorite-${item.id}`}
//                               checked={buttonStatus?.[item.id] === true}
//                               onChange={() => handleFavoriteClick(item.id)}
//                               aria-label={`Favorite ${item.name}`}
//                               disabled={isAuthenticated == false}
//                             />
//                             {isAuthenticated == true && (
//                               <label htmlFor={`favorite-${item.id}`}>
//                                 <img
//                                   src={
//                                     buttonStatus?.[item.id] === true
//                                       ? "/images/user-bookmark-2.png"
//                                       : "/images/user-bookmark.png"
//                                   }
//                                   alt="Bookmark"
//                                   width={25}
//                                   height={23}
//                                 />
//                               </label>
//                             )}
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
//                           <div className="brand-heading">
//                             {item.voopons_name || item.name
//                               ? truncateDescriptionTitle(
//                                   item.voopons_name || item.name,
//                                   3
//                                 )
//                               : "No Title Available"}
//                           </div>
//                           {/* <h5>{item.voopons_name}</h5> */}
//                           <p>
//                             {item &&
//                               item.hasOwnProperty("voopons_description") &&
//                               truncateDescription(
//                                 item.voopons_description,
//                                 MAX_WORDS
//                               )}
//                           </p>
//                           {/* <Link
//                         className="btn btn-viewmore"
//                         // href={`/voopons/${item.id}?promoter_id=${item.promoter_id}`}
//                         href={
//                           brand == true
//                             ? `/voopons/${item.category_id}`
//                             : `/businesses/${item?.id}?business_id=${item?.id}`
//                         }
//                         role="button"
//                       >
//                         View More
//                       </Link> */}
//                         </div>
//                         <button
//                           style={buttonStyle}
//                           onClick={() => handleClick(item)}
//                           role="button"
//                         >
//                           View More
//                         </button>
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

// export default BrandToExplore;

//

// code responsive code 16-10-2024




// import React, { useEffect, useState } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/navigation";
// import { Autoplay, Pagination, Navigation } from "swiper/modules";
// import { BASE_URL } from "@/constant/constant";
// import { useRouter } from "next/navigation";
// import { useAuth } from "@/app/UserProvider";
// import axios from "axios";
// import { LightModeOutlined } from "@mui/icons-material";

// const BrandExplore = ({ staticItems, brand }) => {
//   const { userDetails, isAuthenticated } = useAuth();
//   const [buttonStatus, setButtonStatus] = useState({});
//   const router = useRouter();
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

//   useEffect(() => {
//     const initialButtonStatus = staticItems?.reduce((acc, item) => {
//       acc[item.id] = false;
//       return acc;
//     }, {});
//     setButtonStatus(initialButtonStatus);
//   }, [staticItems]);
//   // handle favorite

//   const handleFavoriteClick = async (item) => {
//     const isLiked = buttonStatus[item];

//     // Prepare FormData
//     const formData = new FormData();
//     formData.append("user_id", userDetails.user_id);
//     formData.append("business_id", item.toString());
//     formData.append("like_status", isLiked ? "0" : "1"); // Toggle between 'like' (1) and 'unlike' (0)

//     try {
//       const response = await axios.post(
//         `${BASE_URL}/api/auth/user_favorite_business`,
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//             Authorization: `Bearer ${userDetails.token}`,
//           },
//         }
//       );
//       setButtonStatus((prevStatus) => ({
//         ...prevStatus,
//         [item]: !isLiked,
//       }));
//     } catch (error) {
//       console.error("Error updating like status:", error);
//     }
//   };

//   /// handle click to navigate

//   const handleClick = (item) => {
//     if (!isAuthenticated) {
//       router.push("/auth-users");
//     } else {
//       router.push(
//         brand == true
//           ? `/voopons/${item.category_id}`
//           : `/businesses/${item?.id}?business_id=${item?.id}`
//       );
//     }
//   };
//   return (
//     <>
//       <div className="col-lg-12 mySwiper">
//         <div className="heading mb-3">
//           Brands <span>To Explore</span>
//         </div>
//       </div>
//       <Swiper
//         style={{
//           "--swiper-navigation-color": "#e60023",
//           "--swiper-pagination-color": "#e60023",
//         }}
//         spaceBetween={20}
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
//                 <div className="brand-box">
//                   <div className="brand-logo">
//                     <div className="brand-heart">
//                       <input
//                         type="checkbox"
//                         id={`favorite-${item.id}`}
//                         checked={buttonStatus?.[item.id] === true}
//                         onChange={() => handleFavoriteClick(item.id)}
//                         aria-label={`Favorite ${item.name}`}
//                         disabled={isAuthenticated === false}
//                       />
//                       {isAuthenticated === true && (
//                         <label htmlFor={`favorite-${item.id}`}>
//                           <img
//                             src={
//                               buttonStatus?.[item.id] === true
//                                 ? "/images/user-bookmark-2.png"
//                                 : "/images/user-bookmark.png"
//                             }
//                             alt="Bookmark"
//                             width={25}
//                             height={23}
//                           />
//                         </label>
//                       )}
//                     </div>
//                     <img
//                       src={`${BASE_URL}/${
//                         item.vooponimage?.image_name || item?.profile_image
//                       }`}
//                       style={{ width: "100%", height: "200px" }} // Corrected '200Px' to '200px'
//                       alt="brand"
//                     />
//                   </div>
//                   <div className="brand-heading">
//                     {item.voopons_name || item.name
//                       ? truncateDescriptionTitle(
//                           item.voopons_name || item.name,
//                           2
//                         )
//                       : "No Title Available"}
//                   </div>
//                   <a
//                     className="btn btn-viewmore"
//                     role="button"
//                     onClick={() => handleClick(item)}
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
//             <h3>No Brands Available</h3>
//           </div>
//         )}
//       </Swiper>
//     </>
//   );
// };

// export default BrandExplore;







// new change for sweeper outside the section acc to bug sheet


import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { BASE_URL } from "@/constant/constant";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/UserProvider";
import axios from "axios";

const BrandExplore = ({ staticItems, brand }) => {
  const { userDetails, isAuthenticated } = useAuth();
  const [buttonStatus, setButtonStatus] = useState({});
  const [swiperInstance, setSwiperInstance] = useState(null);
  const router = useRouter();

  // word Limitation
  const truncateDescriptionTitle = (description, wordLimit1) => {
    const words = description.split(" ");
    if (words.length > wordLimit1) {
      return words.slice(0, wordLimit1).join(" ") + "...";
    }
    return description;
  };

  useEffect(() => {
    const initialButtonStatus = staticItems?.reduce((acc, item) => {
      acc[item.id] = false;
      return acc;
    }, {});
    setButtonStatus(initialButtonStatus);
  }, [staticItems]);

  // handle favorite
  const handleFavoriteClick = async (item) => {
    const isLiked = buttonStatus[item];

    const formData = new FormData();
    formData.append("user_id", userDetails.user_id);
    formData.append("business_id", item.toString());
    formData.append("like_status", isLiked ? "0" : "1");

    try {
      const response = await axios.post(
        `${BASE_URL}/api/auth/user_favorite_business`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${userDetails.token}`,
          },
        }
      );
      setButtonStatus((prevStatus) => ({
        ...prevStatus,
        [item]: !isLiked,
      }));
    } catch (error) {
      console.error("Error updating like status:", error);
    }
  };

  /// handle click to navigate
  const handleClick = (item) => {
    if (!isAuthenticated) {
      router.push("/auth-users");
    } else {
      router.push(
        brand == true
          ? `/voopons/${item.category_id}`
          : `/businesses/${item?.id}?business_id=${item?.id}`
      );
    }
  };

  return (
    <>
      <div className="col-lg-12 mySwiper">
        <div className="heading mb-3">
          Brands <span>To Explore</span>
        </div>
      </div>
      <div className="brand-explore-container" style={{ position: 'relative', padding: '0 0px', border: "1px solid white" }}>
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
            nextEl: '.swiper-button-next-unique',
            prevEl: '.swiper-button-prev-unique',
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
              <SwiperSlide key={index}>
                <div className="item">
                  <div className="brand-box">
                    <div className="brand-logo">
                      <div className="brand-heart">
                        <input
                          type="checkbox"
                          id={`favorite-${item.id}`}
                          checked={buttonStatus?.[item.id] === true}
                          onChange={() => handleFavoriteClick(item.id)}
                          aria-label={`Favorite ${item.name}`}
                          disabled={isAuthenticated === false}
                        />
                        {isAuthenticated === true && (
                          <label htmlFor={`favorite-${item.id}`}>
                            <img
                              src={
                                buttonStatus?.[item.id] === true
                                  ? "/images/user-bookmark-2.png"
                                  : "/images/user-bookmark.png"
                              }
                              alt="Bookmark"
                              width={25}
                              height={23}
                            />
                          </label>
                        )}
                      </div>
                      <img
                        src={`${BASE_URL}/${
                          item.vooponimage?.image_name || item?.profile_image
                        }`}
                        style={{ width: "100%", height: "220px",}}
                        alt="brand"
                      />
                    </div>
                    <div className="brand-heading">
                      {item.voopons_name || item.name
                        ? truncateDescriptionTitle(
                            item.voopons_name || item.name,
                            2
                          )
                        : "No Title Available"}
                    </div>
                    <a
                      className="btn btn-viewmore"
                      role="button"
                      onClick={() => handleClick(item)}
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
              <h3>No Brands Available</h3>
            </div>
          )}
        </Swiper>

        <div 
          className="swiper-button-prev-unique"
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
            <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/>
          </svg>
        </div>
        <div 
          className="swiper-button-next-unique"
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
            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
          </svg>
        </div>
      </div>
    </>
  );
};

export default BrandExplore;
