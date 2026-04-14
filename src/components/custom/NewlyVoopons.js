import LanguageIcon from "@mui/icons-material/Language";
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
      <div style={{ backgroundColor: "#fbf8f8" }}>
        <div className="col-lg-12 mySwiper">
          <div className="heading mb-3">
            Newly <span>Added Voopons</span>
          </div>
        </div>
        <div
          className="voopons-container"
          style={{
            position: "relative",
            padding: "0 0px",
            border: "1px solid #fbf8f8",
          }}
        >
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
              nextEl: ".swiper-button-next-voopons",
              prevEl: ".swiper-button-prev-voopons",
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
                <SwiperSlide key={index} style={{ height: "auto" }}>
                  <div
                    className="item"
                    style={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <div
                      className="voopan-box"
                      style={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        backgroundColor: "#fff",
                        borderRadius: "8px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        padding: "15px",
                        boxSizing: "border-box",
                      }}
                    >
                      <div>
                        <div
                          className="voopon-logo"
                          style={{
                            height: "180px",
                            overflow: "hidden",
                            borderRadius: "4px",
                            marginBottom: "12px",
                          }}
                        >
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
                              objectFit: "cover",
                            }}
                            alt="brand"
                          />
                        </div>

                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <h6
                            className="title-capitilize"
                            style={{
                              margin: 0,
                              fontSize: 22,

                              width: "100%", // Ensures it spans the whole row
                              display: "block", // Standard block behavior
                            }}
                          >
                            {item.voopons_name || item.name
                              ? truncateDescriptionTitle(
                                  item.voopons_name || item.name,
                                  2
                                )
                              : "No Title Available"}
                          </h6>

                          <LanguageIcon
                            onClick={() => {
                              const url = item?.voopon_link;
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
                              backgroundColor: "#f3f4f6",
                              borderRadius: "4px",
                              fontSize: "24px",
                              padding: "4px",
                            }}
                          />
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
                        <h6 style={{ minHeight: "20px", margin: "10px 0" }}>
                          {item?.voopons_description
                            ? truncateDescription(
                                item.voopons_description,
                                MAX_WORDS
                              )
                            : "No Description Available"}
                        </h6>
                      </div>
                      <div>
                        <p
                          style={{
                            marginBottom: "12px",
                            fontSize: "13px",
                            color: "#666",
                          }}
                        >
                          Start date:{" "}
                          {new Date(item.voopons_date).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </p>

                        <p
                          style={{
                            marginBottom: "12px",
                            fontSize: "13px",
                            color: "#666",
                          }}
                        >
                          End Date:{" "}
                          {new Date(item.voopons_valid_thru).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </p>

                        <p
                          style={{
                            marginBottom: "12px",
                            fontSize: "13px",
                            color: "#666",
                          }}
                        >
                          Code :{" "}
                          {item?.voopon_code || "Voopons code not available"}
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
                          style={
                            {
                              // display:"block",
                              // marginTop:"10px"
                            }
                          }
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
                <h3>No Voopons Available</h3>
              </div>
            )}
          </Swiper>

          <div
            className="swiper-button-prev-voopons"
            style={{
              left: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              position: "absolute",
              zIndex: 10,
              cursor: "pointer",
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
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              position: "absolute",
              zIndex: 10,
              cursor: "pointer",
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
