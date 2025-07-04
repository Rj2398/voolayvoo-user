"use client";
import { useAuth } from "@/app/UserProvider";
import Loader from "@/components/custom/Loader";
import { BASE_URL } from "@/constant/constant";
import Image from "next/image";
import { DateTime } from "luxon";
import Link from "next/link";
import {
  useLayoutEffect,
  useState,
  useRef,
  useCallback,
  useEffect,
} from "react";
import CustomPagination from "@/components/CustomPagination";
import axios from "axios";
import { truncateDescriptionByWords } from "@/utils/eventFunction";

// Function to fetch favorite data
async function getData(id, token) {
  const formData = new FormData();
  formData.append("user_id", id);

  const resFavorite = await fetch(
    `${BASE_URL}/api/auth/user_favorite_business_get`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`, // Adding the token to the Authorization header
      },
      body: formData,
    }
  );

  const resultFavorite = await resFavorite.json();
  if (!resFavorite.ok) {
    throw new Error("Failed to fetch data");
  }

  return {
    favoriteList: resultFavorite.data,
  };
}

const Favorites = () => {
  const { userDetails } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ favoriteList: [] });
  const [error, setError] = useState(null);
  const [pageNo, setPageNo] = useState(1);
  const [renderList, setRenderList] = useState([]);
  const targetDivRef = useRef(null);

  // code for like
  const [likeStatus, setLikeStatus] = useState(true);

  const [buttonStatus, setButtonStatus] = useState({});

  useEffect(() => {
    const initialButtonStatus = renderList.reduce((acc, item) => {
      acc[item.business_id] = true;
      return acc;
    }, {});
    setButtonStatus(initialButtonStatus);
  }, [renderList]);

  // favorite code

  const handleFavoriteClick = async (businessId) => {
    // Prepare FormData
    const formData = new FormData();
    formData.append("user_id", userDetails.user_id);
    formData.append("business_id", businessId);
    formData.append("like_status", "0");

    //

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
        [businessId]: false,
      }));
      setLikeStatus((prev) => !prev);
    } catch (error) {
      console.error("Error updating like status:", error);
    }
  };

  const itemsPerPage = 9;

  useEffect(() => {
    const fetchData = async () => {
      if (!userDetails || !userDetails.user_id) {
        setLoading(false);
        return;
      }

      try {
        const result = await getData(userDetails.user_id, userDetails?.token);
        setData(result);
        setRenderList(result.favoriteList.slice(0, itemsPerPage));
        // if (result.favoriteList == "undefined") {
        //   setRenderList([]);
        // } else {
        //   setRenderList(result.favoriteList.slice(0, itemsPerPage));
        // }
      } catch (err) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userDetails, likeStatus]);

  const handlePageNumber = (newPageNo) => {
    const startIdx = (newPageNo - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;
    const newRenderList = data.favoriteList.slice(startIdx, endIdx);

    if (targetDivRef.current) {
      targetDivRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    setPageNo(newPageNo);
    setRenderList(newRenderList);
  };
  const MAX_WORDS = 20;
  const truncateDescription = (description, wordLimit) => {
    const words = description.split(" ");
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(" ") + "...";
    }
    return description;
  };
  if (loading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Loader loading={loading} />
      </div>
    );

  if (error)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <p>{error}</p>
      </div>
    );

  if (!data.favoriteList.length)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <p style={{ fontSize: 30 }}>No favorites found.</p>
      </div>
    );

  return (
    <div className="user-dashboard-data" ref={targetDivRef}>
      <div className="user-my-favorites">
        <h1>My Favorites</h1>
      </div>
      <div className="user-my-favorites-inner">
        {renderList.map((business, index) => {
          return (
            <div key={business.id + index} className="event-brand-box">
              <div className="brand-logo">
                <div className="brand-heart">
                  <input
                    type="checkbox"
                    id={`favorite-${business.business_id}`}
                    checked={buttonStatus[business.business_id] === true}
                    onChange={() => handleFavoriteClick(business?.business_id)}
                    aria-label={`Favorite ${business.name}`}
                  />
                  <label htmlFor={`favorite-${business.business_id}`}>
                    <img
                      src={
                        buttonStatus[business.business_id] === true
                          ? "/images/user-bookmark-2.png"
                          : "/images/user-bookmark.png"
                      }
                      alt="Bookmark"
                      width={25}
                      height={23}
                    />
                  </label>
                </div>

                <Image
                  width={285}
                  height={223}
                  src={
                    business.business_favourite?.profile_image
                      ? BASE_URL + business.business_favourite?.profile_image
                      : "/images/near-event3.png"
                  }
                  alt={business.name}
                />
              </div>

              <div className="event-pad">
                <h6>{business.business_favourite?.name}</h6>
                <p>
                  {truncateDescriptionByWords(
                    business?.business_favourite?.business_favourite,
                    10
                  )}
                </p>
                <div className="point-icon">
                  <span>
                    {" "}
                    <Image
                      width={20}
                      height={20}
                      src="/images/location-dot.png"
                      alt=""
                    />{" "}
                    {parseFloat(business?.distance).toFixed(2) || 0} miles away{" "}
                  </span>
                  {/* <span>
                    <Image
                      width={20}
                      height={20}
                      src="/images/calendar.png"
                      alt=""
                    /> */}
                  {/* {" "}
                {DateTime.fromFormat(
                  business.events_date,
                  "yyyy-MM-dd"
                ).toFormat("MMMM dd, yyyy")}{" "} */}
                  {/* </span> */}
                  {business?.business_favourite?.location && (
                    <span>
                      <Image
                        width={20}
                        height={20}
                        src="/images/loc-mark.svg"
                        alt=""
                      />{" "}
                      {business?.business_favourite?.location}{" "}
                    </span>
                  )}
                </div>
                <Link
                  className="btn btn-viewmore-border "
                  // href={`/businesses/${item?.id}`}
                  href={`/businesses/${business?.business_id}?business_id=${business?.business_id}`}
                  role="button"
                >
                  View More
                </Link>
              </div>
            </div>
          );
        })}
        <CustomPagination
          dataArray={data.favoriteList}
          pageNo={pageNo}
          clickPageNumber={handlePageNumber}
          pageLimit={itemsPerPage}
        />
      </div>
    </div>
  );
};

export default Favorites;
