import { BASE_URL } from "@/constant/constant";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { DateTime } from "luxon";
import { convertTo12HourFormat } from "@/utils/eventFunction";
const EventsNearYou = ({ staticItems, title, title1, brand }) => {
  // here is to merge data into array

  const [combinedArray, setCombinedArray] = useState([]);
  console.log(combinedArray, "combinedArray length");
  useEffect(() => {
    // Only proceed if staticItems and its properties exist
    if (staticItems?.business_events && staticItems?.promoter_data) {
      const updatedArrayTwo = staticItems.business_events.map((item) => {
        if (item?.business_event_image) {
          return {
            ...item,
            eventimage: item?.business_event_image,
            business_event_image: null,
          };
        } else {
          return item;
        }
      });

      // Ensure both arrays are iterable and defined
      if (
        Array.isArray(staticItems.promoter_data) &&
        Array.isArray(updatedArrayTwo)
      ) {
        const mergedArray = [...staticItems.promoter_data, ...updatedArrayTwo];
        setCombinedArray(mergedArray);
      }
    }
  }, [staticItems]);

  // Merge both arrays

  const [currentIndex, setCurrentIndex] = useState(0);

  const itemsPerPage = 4;
  const numPages = Math.ceil(combinedArray?.length - itemsPerPage + 1);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % numPages);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + numPages) % numPages);
  };

  const MAX_WORDS = 5; // Define the word limit

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
    height: "425px",
  };

  const buttonStyles = {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    backgroundColor: "transparent",
    color: "red",
    border: "none",

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
                {combinedArray?.map((item, index) => {
                  console.log(
                    item,
                    "hello item data comes form thisgggggggggghg"
                  );
                  return (
                    <div
                      className="event-brand-box"
                      style={itemStyles}
                      key={index}
                    >
                      <div className="brand-logo" style={boxStyles}>
                        <span>
                          {item.events_price == 0
                            ? "GRAB DEAL"
                            : `$${item.events_price}`}
                        </span>
                        <img
                          src={`${BASE_URL}/${item.eventimage?.image_name}`}
                          alt={item.title}
                          style={imgStyles}
                        />
                      </div>
                      <div className="event-pad">
                        <h6>{item.events_name}</h6>
                        <p>
                          {" "}
                          {item?.description
                            ? truncateDescription(item.description, MAX_WORDS)
                            : "No Description Available"}
                        </p>
                        <div className="point-icon">
                          <span>
                            <img src="images/location-dot.png" />{" "}
                            {item.distance.toFixed(2)}
                            miles away
                          </span>
                          <span>
                            <img src="images/calendar.png" />{" "}
                            {DateTime.fromFormat(
                              item.events_date,
                              "yyyy-MM-dd"
                            ).toFormat("MMMM dd, yyyy")}{" "}
                          </span>
                          <span>
                            <img src="images/watch.png" />{" "}
                            {convertTo12HourFormat(item.events_start_time)} to{" "}
                            {convertTo12HourFormat(item.events_end_time)}{" "}
                          </span>
                        </div>

                        <Link
                          className="btn btn-viewmore-border btn-align"
                          // href={`/events/${item.id}?promoter_id=${item.promoter_id}`}
                          href={`/events/${item.checked_id}?promoter_id=${item.promoter_id}`}
                          role="button"
                        >
                          View More
                        </Link>
                      </div>
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

export default EventsNearYou;
