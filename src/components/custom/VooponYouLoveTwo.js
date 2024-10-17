// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { BASE_URL } from "@/constant/constant";
// import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
// import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

// // VooponCard component to display individual Voopon details
// const VooponCard = ({ voopon }) => {
//   console.log(voopon, "vooponse comes form thsi");
//   return (
//     <div style={styles.card}>
//       <div
//         style={{
//           ...styles.imageContainer,
//           backgroundImage: `url(${BASE_URL + voopon.vooponimage.image_name})`,
//         }}
//       ></div>
//       <div style={styles.details}>
//         <h5 style={styles.title}>{voopon.voopons_name}</h5>
//         <h2 style={styles.storeName}>Fashion Store</h2>
//         <h5 style={styles.discount}>Flat 20% Off</h5>
//         <Link href={`/voopons/${voopon.category_id}`} style={styles.link}>
//           Explore More
//         </Link>
//       </div>
//     </div>
//   );
// };

// // Main VooponYouLove component
// const VooponYouLoveTwo = ({ staticItems }) => {
//   const [vooponseYouLove, setVooponseYouLove] = useState([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const itemsPerRow = 3;

//   useEffect(() => {
//     if (staticItems?.voopon_data_one && staticItems?.voopon_data_two) {
//       const updatedArrayTwo = staticItems.voopon_data_two.map((item) => ({
//         ...item,
//         vooponimage: item.business_voopon_image || null,
//       }));

//       const mergedArray = [...staticItems.voopon_data_one, ...updatedArrayTwo];
//       setVooponseYouLove(mergedArray);
//     }
//   }, [staticItems]);

//   const totalItems = vooponseYouLove.length;

//   const nextPage = () => {
//     setCurrentIndex(
//       (prevIndex) => (prevIndex + 1) % (totalItems - itemsPerRow + 1)
//     );
//   };

//   const prevPage = () => {
//     setCurrentIndex(
//       (prevIndex) =>
//         (prevIndex - 1 + (totalItems - itemsPerRow + 1)) %
//         (totalItems - itemsPerRow + 1)
//     );
//   };

//   const displayedItems = vooponseYouLove.slice(
//     currentIndex,
//     currentIndex + itemsPerRow
//   );

//   return (
//     <section style={styles.container}>
//       <div className="heading">
//         Voopons You <span style={{ color: "red" }}>Will Love</span>
//       </div>
//       <div style={styles.cardContainer}>
//         {displayedItems.length === 0 ? (
//           <p
//             style={{
//               alignSelf: "center",
//               justifyContent: "center",
//               display: "flex",
//               alignItems: "center",
//               fontSize: "24px",
//             }}
//           >
//             No voopons available
//           </p>
//         ) : (
//           displayedItems.map((voopon) => (
//             <VooponCard key={voopon.category_id} voopon={voopon} />
//           ))
//         )}
//       </div>
//       <div style={styles.overlay}>
//         <button
//           onClick={prevPage}
//           style={{ ...styles.overlayButton, left: "10px" }}
//         >
//           <KeyboardArrowLeftIcon />
//         </button>
//         <button
//           onClick={nextPage}
//           style={{ ...styles.overlayButton, right: "10px" }}
//         >
//           <KeyboardArrowRightIcon />
//         </button>
//       </div>
//     </section>
//   );
// };

// // Inline styles
// const styles = {
//   container: {
//     position: "relative",
//     padding: "20px",
//     backgroundColor: "#f9f9f9",
//     maxWidth: "1200px",
//     margin: "0 auto",
//   },
//   header: {
//     fontSize: "36px",
//     fontWeight: "bold",
//     marginBottom: "20px",
//   },
//   cardContainer: {
//     display: "flex",
//     justifyContent: "space-between",

//     justifyContent: "center",
//     alignItems: "center",
//   },
//   card: {
//     flex: "1 0 30%", // Adjusts to 3 cards per row
//     margin: "10px",
//     border: "1px solid #ccc",
//     borderRadius: "5px 0 87px 0", // Adjusted for bottom right corner
//     overflow: "hidden",
//     boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
//   },
//   imageContainer: {
//     height: "200px",
//     backgroundSize: "cover",
//     backgroundPosition: "center",
//     // height: "400px",
//   },
//   image: {
//     width: "100%",
//     height: "auto",
//     display: "none", // Hide the img as we're using background image
//   },
//   details: {
//     padding: "15px",
//     // backgroundColor: "pink",
//     // position: "absolute",
//     // bottom: "50px",
//   },
//   title: {
//     fontSize: "18px",
//     fontWeight: "bold",
//   },
//   storeName: {
//     fontSize: "22px",
//     color: "#333",
//   },
//   discount: {
//     fontSize: "18px",
//     color: "#888",
//   },
//   link: {
//     display: "inline-block",
//     padding: "10px 20px",
//     backgroundColor: "#f00",
//     color: "#fff",
//     textDecoration: "none",
//     borderRadius: "5px",
//     marginTop: "10px",
//   },
//   overlay: {
//     position: "absolute",
//     top: "50%",
//     width: "100%",
//     display: "flex",
//     justifyContent: "space-between",
//     transform: "translateY(-50%)",
//     zIndex: 1,
//   },
//   overlayButton: {
//     padding: "10px 20px",
//     backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
//     color: "#fff",
//     border: "none",
//     borderRadius: "5px",
//     cursor: "pointer",
//   },
// };

// export default VooponYouLoveTwo;

// //

//

//
// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { BASE_URL } from "@/constant/constant";
// import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
// import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

// // VooponCard component to display individual Voopon details
// const VooponCard = ({ voopon }) => {
//   return (
//     <div style={styles.card}>
//       <div
//         style={{
//           ...styles.imageContainer,
//           backgroundImage: `url(${BASE_URL + voopon.vooponimage.image_name})`,
//         }}
//       ></div>
//       <div style={styles.details}>
//         <h5 style={styles.title}>{voopon.voopons_name}</h5>
//         <h2 style={styles.storeName}>Fashion Store</h2>
//         <h5 style={styles.discount}>Flat 20% Off</h5>
//         <Link href={`/voopons/${voopon.category_id}`} style={styles.link}>
//           Explore More
//         </Link>
//       </div>
//     </div>
//   );
// };

// // Main VooponYouLove component
// const VooponYouLoveTwo = ({ staticItems }) => {
//   const [vooponseYouLove, setVooponseYouLove] = useState([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const itemsPerRow = 3; // Keep the same number of items per row

//   useEffect(() => {
//     if (staticItems?.voopon_data_one && staticItems?.voopon_data_two) {
//       const updatedArrayTwo = staticItems.voopon_data_two.map((item) => ({
//         ...item,
//         vooponimage: item.business_voopon_image || null,
//       }));

//       const mergedArray = [...staticItems.voopon_data_one, ...updatedArrayTwo];
//       setVooponseYouLove(mergedArray);
//     }
//   }, [staticItems]);

//   const totalItems = vooponseYouLove.length;
//   const numPages = totalItems - itemsPerRow + 1; // Number of positions to move

//   const nextPage = () => {
//     setCurrentIndex((prevIndex) => (prevIndex + 1) % numPages);
//   };

//   const prevPage = () => {
//     setCurrentIndex((prevIndex) => (prevIndex - 1 + numPages) % numPages);
//   };

//   // Calculate the translateX value based on the currentIndex
//   const translateX = currentIndex * (100 / itemsPerRow);

//   // Calculate the slider width dynamically here
//   const sliderWidth = `calc(${
//     100 * Math.ceil(totalItems / (itemsPerRow * 2))
//   }%)`;

//   return (
//     <section style={styles.container}>
//       <div className="heading">
//         Voopons You <span style={{ color: "red" }}>Will Love</span>
//       </div>
//       <div style={styles.cardContainer}>
//         <div
//           style={{
//             ...styles.slider,
//             transform: `translateX(-${translateX}%)`,
//             width: sliderWidth,
//           }}
//         >
//           {vooponseYouLove.length === 0 ? (
//             <p
//               style={{
//                 alignSelf: "center",
//                 justifyContent: "center",
//                 display: "flex",
//                 alignItems: "center",
//                 fontSize: "24px",
//               }}
//             >
//               No voopons available
//             </p>
//           ) : (
//             vooponseYouLove.map((voopon) => (
//               <VooponCard key={voopon.category_id} voopon={voopon} />
//             ))
//           )}
//         </div>
//       </div>
//       <div style={styles.overlay}>
//         <button
//           onClick={prevPage}
//           style={{ ...styles.overlayButton, left: "10px" }}
//         >
//           <KeyboardArrowLeftIcon />
//         </button>
//         <button
//           onClick={nextPage}
//           style={{ ...styles.overlayButton, right: "10px" }}
//         >
//           <KeyboardArrowRightIcon />
//         </button>
//       </div>
//     </section>
//   );
// };

// // Inline styles
// const styles = {
//   container: {
//     position: "relative",
//     padding: "20px",
//     backgroundColor: "#f9f9f9",
//     maxWidth: "1200px",
//     margin: "0 auto",
//   },
//   cardContainer: {
//     overflow: "hidden", // Hide the overflow of the sliding cards
//     position: "relative",
//   },
//   slider: {
//     display: "flex",
//     transition: "transform 0.5s ease-in-out", // Animation for sliding effect
//   },
//   card: {
//     flex: "1 0 30%", // Adjusts to 3 cards per row
//     margin: "20px",
//     border: "1px solid #ccc",
//     borderRadius: "5px 0 87px 0", // Adjusted for bottom right corner
//     overflow: "hidden",
//     boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
//   },
//   imageContainer: {
//     height: "200px",
//     backgroundSize: "cover",
//     backgroundPosition: "center",
//   },
//   details: {
//     padding: "15px",
//   },
//   title: {
//     fontSize: "18px",
//     fontWeight: "bold",
//   },
//   storeName: {
//     fontSize: "22px",
//     color: "#333",
//   },
//   discount: {
//     fontSize: "18px",
//     color: "#888",
//   },
//   link: {
//     display: "inline-block",
//     padding: "10px 20px",
//     backgroundColor: "#f00",
//     color: "#fff",
//     textDecoration: "none",
//     borderRadius: "5px",
//     marginTop: "10px",
//   },
//   overlay: {
//     position: "absolute",
//     top: "50%",
//     width: "100%",
//     display: "flex",
//     justifyContent: "space-between",
//     transform: "translateY(-50%)",
//     zIndex: 1,
//   },
//   overlayButton: {
//     padding: "10px 20px",
//     backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
//     color: "#fff",
//     border: "none",
//     borderRadius: "5px",
//     cursor: "pointer",
//   },
// };

// export default VooponYouLoveTwo;

//new commented aded 16-10-2024

import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Navigation } from "swiper/modules";
import { BASE_URL } from "@/constant/constant";

const VooponYouLoveTwo = ({ staticItems, brand }) => {
  const [vooponseYouLove, setVooponseYouLove] = useState([]);

  useEffect(() => {
    if (staticItems?.voopon_data_one && staticItems?.voopon_data_two) {
      const updatedArrayTwo = staticItems.voopon_data_two.map((item) => ({
        ...item,
        vooponimage: item.business_voopon_image || null,
      }));

      const mergedArray = [...staticItems.voopon_data_one, ...updatedArrayTwo];
      setVooponseYouLove(mergedArray);
    }
  }, [staticItems]);

  return (
    <>
      <div className="col-lg-12 mySwiper">
        <div className="heading mb-3">
          Brands <span>To Explore</span>
        </div>
      </div>
      <Swiper
        style={{
          "--swiper-navigation-color": "#e60023",
          "--swiper-pagination-color": "#e60023",
          marginBottom: "30px",
        }}
        spaceBetween={20} // Increased space between items
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        keyboard={{ enabled: true }}
        pagination={{ clickable: false }}
        navigation={true}
        modules={[Autoplay, Navigation]}
        className="mySwiper1"
        // style={{ marginBottom: "30px" }} // Added margin bottom to Swiper
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
            slidesPerView: 3, // Show 4 slides on desktop screens
          },
        }}
      >
        {vooponseYouLove?.map((item, index) => (
          <SwiperSlide key={index}>
            <div className="item">
              <div
                className="love-box"
                style={{
                  backgroundImage: `url(${
                    BASE_URL + item.vooponimage.image_name
                  })`,
                }}
              >
                <div className="love-left">
                  <img
                    src="./images/lov-volimg.png"
                    className="img-fluid"
                    alt=""
                  />
                </div>
                <div className="love-right">
                  <div style={{ height: "70%" }}>
                    <h5 style={{ color: "white" }}>
                      {item.voopons_name || "No Title Available"}
                    </h5>
                    <h2 style={{ color: "white" }}>Fashion Store</h2>
                    <h5 style={{ color: "white" }}>Flat 20% Off</h5>
                  </div>
                  <div style={{ height: "30%" }}>
                    <a
                      className="btn btn-explore"
                      style={{}}
                      role="button"
                      href={`/voopons/${item.category_id}`}
                    >
                      {" "}
                      Explore More
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};

export default VooponYouLoveTwo;
