import LanguageIcon from "@mui/icons-material/Language";
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
import Link from "next/link";
const MAX_WORDS = 5;

const EventsNearYou = ({ staticItems }) => {
  console.log(staticItems);
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
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <h6 style={{ fontSize: 22 }}>
                        {item.events_name
                          ? truncateDescriptionTitle(item.events_name, 4)
                          : "No Title Available"}
                      </h6>

                      <img className="earth-size"
                        src="/images/earth.png"
                        onClick={() => {
                          const url = item?.event_link;
                          if (url) {
                            const validUrl = url.startsWith("http")
                              ? url
                              : `https://${url}`;
                            window.open(
                              validUrl,
                              "_blank",
                              "noopener,noreferrer"
                            );
                          }
                        }}
                      />

                      {/* <LanguageIcon
                        onClick={() => {
                          const url = item?.event_link;
                          if (url) {
                            const validUrl = url.startsWith("http")
                              ? url
                              : `https://${url}`;
                            window.open(
                              validUrl,
                              "_blank",
                              "noopener,noreferrer"
                            );
                          }
                        }}
                        sx={{
                          cursor: "pointer",
                          backgroundColor: "#fff",
                          borderRadius: "4px",
                          fontSize: "24px",
                          padding: "4px",
                        }}
                      /> */}
                    </div>

                    <p
                      style={{
                        minHeight: "20px",
                        margin: "10px 0",
                        textAlign: "left", // Forces text to the left
                        paddingLeft: "0px", // Removes any internal left padding
                        width: "100%", // Ensures the heading takes full width
                        display: "block", // Ensures it behaves as a block element
                      }}
                    >
                      {item.description
                        ? truncateDescription(item.description, MAX_WORDS)
                        : "No Description Available"}
                    </p>
                    <div className="point-icon">
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          // marginBottom: "8px",
                        }}
                      >
                        <img src="./images/location-dot.png" alt="Location" />
                        <span style={{ marginLeft: "5px" }}>
                          {item.distance.toFixed(2)} miles away
                        </span>
                      </div>

                      {/* <div
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
                      </div> */}

                      <div style={{ display: "flex", alignItems: "center" }}>
                        <img src="./images/watch.png" alt="Time" />
                        <span style={{ marginLeft: "5px" }}>
                          {convertTo12HourFormat(item.events_start_time)} to{" "}
                          {convertTo12HourFormat(item.events_end_time)}
                        </span>
                      </div>

                      <div style={{ display: "flex", alignItems: "center" }}>
                        <img src="./images/calendar.png" alt="Time" />
                        <span style={{ marginLeft: "5px" }}>
                          Start Date:{" "}
                          {DateTime.fromISO(item?.events_date).toFormat(
                            "MMMM dd, yyyy"
                          )}
                        </span>
                      </div>

                      <div style={{ display: "flex", alignItems: "center" }}>
                        <img src="./images/calendar.png" alt="Time" />
                        <span style={{ marginLeft: "5px" }}>
                          End Date:{" "}
                          {DateTime.fromISO(item?.events_end_date).toFormat(
                            "MMMM dd, yyyy"
                          )}
                        </span>
                      </div>

                      <div style={{ display: "flex", alignItems: "center" }}>
                        {/* <img src="./images/watch.png" alt="Time" /> */}
                        <span style={{ marginLeft: "29px" }}>
                          Code: {item?.event_code}
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
