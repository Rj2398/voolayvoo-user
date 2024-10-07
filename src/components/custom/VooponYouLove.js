import { BASE_URL } from "@/constant/constant";
import React, { useEffect, useState } from "react";
import Link from "next/link";

const VooponYouLove = ({ staticItems, title, title1, brand }) => {
  ///

  const [VooponseYouLove, setVooponseYouLove] = useState([]);

  useEffect(() => {
    // Only proceed if staticItems and its properties exist
    if (staticItems?.voopon_data_one && staticItems?.voopon_data_two) {
      const updatedArrayTwo = staticItems.voopon_data_two.map((item) => {
        if (item?.business_voopon_image) {
          return {
            ...item,
            vooponimage: item?.business_voopon_image,
            business_voopon_image: null,
          };
        } else {
          return item;
        }
      });

      // Ensure both arrays are iterable and defined
      if (
        Array.isArray(staticItems.voopon_data_one) &&
        Array.isArray(updatedArrayTwo)
      ) {
        const mergedArray = [
          ...staticItems.voopon_data_one,
          ...updatedArrayTwo,
        ];
        setVooponseYouLove(mergedArray);
      }
    }
  }, [staticItems]);
  useEffect(() => {
    if (VooponseYouLove.length > 0) {
      setTimeout(() => {
        $("#voopons-love-slider").owlCarousel({
          loop: true,
          margin: 10,
          nav: true,
          items: 1,
        });
      }, 100);
    }
  }, [VooponseYouLove]);

  //

  const [currentIndex, setCurrentIndex] = useState(0);
  const buttonStyles = {
    backgroundColor: "transparent",
    color: "red",
    border: "none",
  };

  const itemsPerPage = 3;
  const numPages = Math.ceil(VooponseYouLove?.length - itemsPerPage + 1);
  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % numPages);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + numPages) % numPages);
  };
  const imgStyles = {
    // width: "100%",
    // height: "200Px",
    backgroundImage: `url(/images/lovbg1.png)`,
  };
  const imgStyles2 = {
    // width: "100%",
    // height: "200Px",
    backgroundImage: `url(/images/lovbg2.png)`,
  };
  const imageOne = "images/lov-volimg.png";
  const imageTwo = "images/lov-volimg2.png";
  return (
    <section className="voopons-love">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="heading mb-3">
              Voopons You <span> Will Love </span>
            </div>
          </div>
          <div className="col-lg-12">
            <div
              id="voopons-love-slider"
              className="owl-carousel owl-loaded owl-drag"
            >
              <div className="owl-stage-outer">
                <div className="owl-stage">
                  {VooponseYouLove?.map((item, index) => {
                    console.log(item, "###########");

                    return (
                      <div
                        className="owl-item m-3"
                        key={index + item.voopons_name}
                      >
                        <div className="item">
                          <div
                            className="love-box"
                            style={index % 2 === 0 ? imgStyles : imgStyles2}
                          >
                            <div className="love-left">
                              <img
                                src={index % 2 === 0 ? imageOne : imageTwo}
                                className="img-fluid"
                                alt="Voopon Image"
                              />
                            </div>
                            <div className="love-right">
                              <h5>{item?.voopons_name}</h5>
                              <h2>Fashion Store</h2>
                              <h5>Flat 20% Off</h5>
                              <Link
                                className="btn btn-viewmore"
                                href={`/voopons/${item.category_id}`}
                                role="button"
                              >
                                Explore More
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="owl-nav disabled">
                <button style={buttonStyles} type="button">
                  <span onClick={handlePrev}>‹</span>
                </button>
                <button style={buttonStyles} type="button">
                  <span onClick={handleNext}>›</span>
                </button>
              </div>
              <div className="owl-dots disabled"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VooponYouLove;
