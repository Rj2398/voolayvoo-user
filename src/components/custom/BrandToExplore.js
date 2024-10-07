import { BASE_URL } from "@/constant/constant";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/app/UserProvider";
import axios from "axios";

const BrandToExplore = ({ staticItems, title, title1, brand }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { userDetails, isAuthenticated } = useAuth();
  //
  const [buttonStatus, setButtonStatus] = useState({});
  console.log(buttonStatus, "fasdfsdfg");
  //
  useEffect(() => {
    const initialButtonStatus = staticItems?.reduce((acc, item) => {
      acc[item.id] = false;
      return acc;
    }, {});
    setButtonStatus(initialButtonStatus);
  }, [staticItems]);
  //
  const itemsPerPage = 4;
  const numPages = Math.ceil(staticItems?.length - itemsPerPage + 1);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % numPages);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + numPages) % numPages);
  };

  const MAX_WORDS = 10; // Define the word limit

  const truncateDescription = (description, wordLimit) => {
    const words = description.split(" ");
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(" ") + "..."; // Truncate and add ellipsis
    }
    return description; // If under the limit, return the full description
  };

  // //
  const handleFavoriteClick = async (item) => {
    console.log(item, "comes from this");

    // Toggle like status based on the current state
    const isLiked = buttonStatus[item]; // Check current like status

    // Prepare FormData
    const formData = new FormData();
    formData.append("user_id", userDetails.user_id);
    formData.append("business_id", item.toString());
    formData.append("like_status", isLiked ? "0" : "1"); // Toggle between 'like' (1) and 'unlike' (0)

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

      // Toggle the button status
      setButtonStatus((prevStatus) => ({
        ...prevStatus,
        [item]: !isLiked, // Toggle the status of the button
      }));

      console.log(response.data, "response of like data"); // Log the response for debugging
    } catch (error) {
      console.error("Error updating like status:", error);
    }
  };

  //

  // Inline CSS styles
  const carouselStyles = {
    position: "relative",
    width: "100%",
    overflow: "hidden",
  };

  const itemContainerStyles = {
    display: "flex",
    transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)`,
    transition: "transform 0.5s ease",
    gap: "7px",
  };

  const itemStyles = {
    flex: `0 0 ${100 / itemsPerPage}%`,
    boxSizing: "border-box",
    textAlign: "center",
  };

  const buttonStyles = {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    backgroundColor: "transparent",
    color: "red",
    border: "none",
    padding: "10px",
    cursor: "pointer",
    zIndex: 9999,
  };

  const prevButtonStyles = {
    ...buttonStyles,
    left: "0%",
  };

  const nextButtonStyles = {
    ...buttonStyles,
    right: "0%",
  };

  const boxStyles = {
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: "8px",
  };

  const imgStyles = {
    width: "100%",
    height: "200Px",
  };

  return (
    <section className="added-voopons">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="heading mb-3">
              {title}
              <span> {title1} </span>
            </div>
          </div>

          <div className="col-lg-12">
            <div style={carouselStyles}>
              <button style={prevButtonStyles} onClick={handlePrev}>
                &lt;
              </button>

              <div
                className="owl-carousel owl-loaded owl-drag"
                style={itemContainerStyles}
              >
                {/* //   .slice(currentIndex, currentIndex + itemsPerPage) */}
                {staticItems?.map((item, index) => {
                  console.log(item.id, "@##@#@#@#@#@##@##@####");
                  return (
                    <div className="brand-box" style={itemStyles} key={index}>
                      <div className="brand-logo" style={boxStyles}>
                        <div
                          className="brand-heart"
                          style={{ opacity: !isAuthenticated ? 0.5 : 1 }}
                        >
                          <input
                            type="checkbox"
                            id={`favorite-${item.id}`}
                            checked={buttonStatus?.[item.id] === true}
                            onChange={() => handleFavoriteClick(item.id)}
                            aria-label={`Favorite ${item.name}`}
                            disabled={isAuthenticated == false}
                          />
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
                        </div>
                        <img
                          src={`${BASE_URL}/${
                            item.vooponimage?.image_name || item?.profile_image
                          }`}
                          alt={item.title}
                          style={imgStyles}
                        />
                      </div>
                      <div className="brand-heading">
                        {item.voopons_name || item.name}
                      </div>
                      {/* <h5>{item.voopons_name}</h5> */}
                      <p>
                        {item &&
                          item.hasOwnProperty("voopons_description") &&
                          truncateDescription(
                            item.voopons_description,
                            MAX_WORDS
                          )}
                      </p>
                      <Link
                        className="btn btn-viewmore"
                        // href={`/voopons/${item.id}?promoter_id=${item.promoter_id}`}
                        href={
                          brand == true
                            ? `/voopons/${item.category_id}`
                            : `/businesses/${item?.id}?business_id=${item?.id}`
                        }
                        role="button"
                      >
                        View More
                      </Link>
                    </div>
                  );
                })}
              </div>

              <button style={nextButtonStyles} onClick={handleNext}>
                &gt;
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandToExplore;
