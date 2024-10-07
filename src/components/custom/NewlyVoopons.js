import { BASE_URL } from "@/constant/constant";
import React, { useState } from "react";
import Link from "next/link";

const NewlyVoopons = ({ staticItems, title, title1, brand }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const itemsPerPage = 4;
  const numPages = Math.ceil(staticItems?.length - itemsPerPage + 1);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % numPages);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + numPages) % numPages);
  };

  const MAX_WORDS = 3; // Define the word limit

  const truncateDescription = (description, wordLimit) => {
    const words = description.split(" ");
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(" ") + "..."; // Truncate and add ellipsis
    }
    return description; // If under the limit, return the full description
  };

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
    height: "500px",
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
    // border: "1px solid #ddd",
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
                  console.log(item, "hello item data comes form this");
                  return (
                    <div className="brand-box" style={itemStyles} key={index}>
                      <div className="brand-logo" style={boxStyles}>
                        <div className="brand-heart">
                          <form>
                            <input
                              type="checkbox"
                              name="favorite"
                              id="favorite"
                            />
                          </form>
                        </div>
                        <img
                          src={`${BASE_URL}/${
                            item.vooponimage?.image_name || item?.profile_image
                          }`}
                          alt={item.title}
                          style={imgStyles}
                        />
                      </div>
                      <div className="voopon-heading">
                        {item.voopons_name || item.name}
                      </div>
                      <h6>
                        {item?.voopons_description
                          ? truncateDescription(
                              item.voopons_description,
                              MAX_WORDS
                            )
                          : "No Description Available"}
                      </h6>

                      <p>
                        {" "}
                        Valid thru:{" "}
                        {new Date(item.voopons_valid_thru).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </p>
                      {/* <p>
                        {item &&
                          item.hasOwnProperty("voopons_description") &&
                          truncateDescription(
                            item.voopons_description,
                            MAX_WORDS
                          )}
                      </p> */}
                      <Link
                        className="btn btn-viewmore"
                        href={`/voopons/${item.category_id}`} // Use curly braces for JavaScript expressions
                        role="button"
                      >
                        View
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

export default NewlyVoopons;
