// CustomCarousel.tsx
import { BASE_URL } from "@/constant/constant";
import Image from "next/image";
import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const responsive = {
  desktop: {
    breakpoint: {
      max: 3000,
      min: 1024,
    },
    items: 3,
    partialVisibilityGutter: 40,
  },
  mobile: {
    breakpoint: {
      max: 464,
      min: 0,
    },
    items: 1,
    partialVisibilityGutter: 30,
  },
  tablet: {
    breakpoint: {
      max: 1024,
      min: 464,
    },
    items: 2,
    partialVisibilityGutter: 30,
  },
};

const CustomCarousel = ({
  itemsList,
  RenderComponent,
  itemsPerPage,
  isImage = false,
}) => {
  const CustomLeftArrow = ({ onClick }) => (
    <div onClick={onClick} className="customArrow leftArrow">
      <i className="fa-solid fa-chevron-left"></i>
    </div>
  );

  const CustomRightArrow = ({ onClick }) => (
    <div onClick={onClick} className="customArrow rightArrow">
      <i className="fa-solid fa-chevron-right"></i>
    </div>
  );
  return (
    <Carousel
      responsive={{
        desktop: {
          breakpoint: {
            max: 3000,
            min: 1024,
          },
          items: itemsPerPage,
          partialVisibilityGutter: 40,
        },
        mobile: {
          breakpoint: {
            max: 464,
            min: 0,
          },
          items: 1,
          partialVisibilityGutter: 30,
        },
        tablet: {
          breakpoint: {
            max: 1024,
            min: 464,
          },
          items: itemsPerPage - 1,
          partialVisibilityGutter: 30,
        },
      }}
      additionalTransfrom={0}
      arrows
      autoPlaySpeed={3000}
      centerMode={false}
      // className=""
      // containerClass="carousel-container"
      draggable
      focusOnSelect={false}
      infinite={false}
      itemClass=""
      keyBoardControl
      minimumTouchDrag={80}
      pauseOnHover
      renderArrowsWhenDisabled={false}
      renderButtonGroupOutside={true}
      renderDotsOutside={true}
      rewind={false}
      rewindWithAnimation={false}
      rtl={false}
      shouldResetAutoplay={false}
      showDots={false}
      slidesToSlide={1}
      swipeable={false}
      sliderClass="slideContainer"
      customLeftArrow={<CustomLeftArrow />}
      customRightArrow={<CustomRightArrow />}
      autoPlay={false}
    >
      {Array.isArray(itemsList) &&
        itemsList.map((item, index) => (
          <div key={index} className="slideItem">
            {isImage && (
              <img
                src={
                  item?.image_name
                    ? `${BASE_URL}${item?.image_name}`
                    : "/images/banners/slide1.png"
                }
                className="image-list w-100 "
                alt={`Image ${index + 1}`}
              />
            )}
            {!isImage && <RenderComponent cardData={item} />}
          </div>
        ))}
    </Carousel>
  );
};

export default CustomCarousel;
