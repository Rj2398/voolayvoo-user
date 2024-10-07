import React, { useState } from "react";
import { BASE_URL } from "@/constant/constant";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { setCategory } from "@/store/slices/userSlice";
import { useAuth } from "@/app/UserProvider";

const CarouselHeader = ({ categories }) => {
  console.log(categories.length, "hello category lenth");
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const dispatch = useDispatch();
  const itemsPerPage = 13;

  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0
        ? Math.max(0, categories.length - itemsPerPage)
        : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + 1 >= categories.length - itemsPerPage + 1 ? 0 : prevIndex + 1
    );
  };

  //

  const handleRouting = async (id) => {
    if (!isAuthenticated) {
      router.push("/login");
    } else {
      router.push("/businesses");
      dispatch(setCategory(id));
    }
  };

  //

  // Inline CSS styles
  const carouselStyles = {
    position: "position",

    width: "90%",
    margin: "auto",
    overflow: "hidden",
  };

  const contentStyles = {
    display: "flex",
    transition: "transform 0.5s ease",
    transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)`,
    width: `${(categories.length + itemsPerPage) * (100 / itemsPerPage)}%`, // Extra width for smooth transition
  };

  const itemContainerStyles = {
    display: "flex",
    width: "100%",
  };

  const cardStyles = {};

  const imgStyles = {
    borderRadius: "10px",
    border: "1px solid #E7E7E7",
    padding: "10px",
    maxWidth: "56px",
    height: "57px",
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
    zIndex: 1,
  };

  const prevButtonStyles = {
    ...buttonStyles,
    left: "6%",
  };

  const nextButtonStyles = {
    ...buttonStyles,
    right: "6%",
  };

  // Adjusted category list for smooth cycling
  const visibleCategories = [
    ...categories.slice(-itemsPerPage), // Add last items to the start for smooth transition
    ...categories,
    ...categories.slice(0, itemsPerPage), // Add first items to the end for smooth transition
  ];

  return (
    <div style={carouselStyles}>
      <button style={prevButtonStyles} onClick={handlePrev}>
        &lt;
      </button>
      <div style={contentStyles}>
        <div style={itemContainerStyles}>
          {visibleCategories.map((category, index) => (
            <div
              className="owl-item cloned m-1"
              key={`${category.category_id}-${category.category_name}-${index}`}
            >
              <div
                className="item"
                onClick={() => handleRouting(category.category_id)}
              >
                <div className="menu-tab-box">
                  <div
                    className="menu-iconbox"
                    // key={`${category.category_id}-${category.category_name}-${index}`}
                    style={cardStyles}
                  >
                    <img
                      src={`${BASE_URL}/category-image/${category.category_image}`}
                      alt={category.category_name}
                      style={imgStyles}
                    />
                  </div>

                  <p>{category.category_name}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <button style={nextButtonStyles} onClick={handleNext}>
        &gt;
      </button>
    </div>
  );
};

export default CarouselHeader;
