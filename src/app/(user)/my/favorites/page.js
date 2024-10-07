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
async function getData(id) {
  const formData = new FormData();
  formData.append("user_id", id);

  const resFavorite = await fetch(
    `${BASE_URL}/api/user_home_screen_my_favorites_brand_business_list`,
    {
      method: "POST",
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
  console.log(buttonStatus, "fasdfsdfg");

  useEffect(() => {
    const initialButtonStatus = renderList.reduce((acc, item) => {
      acc[item.id] = true;
      return acc;
    }, {});
    setButtonStatus(initialButtonStatus);
  }, [renderList]);

  // favorite code

  const handleFavoriteClick = async (businessId) => {
    // Prepare FormData
    const formData = new FormData();
    formData.append("user_id", userDetails.user_id);
    formData.append("business_id", businessId.toString());
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
        [businessId]: false, // Disable the button that is pressed
      }));
      setLikeStatus((prev) => !prev);
      console.log(response.data, "response of like data"); // Log the response for debugging
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
        const result = await getData(userDetails.user_id);
        setData(result);
        setRenderList(result.favoriteList.slice(0, itemsPerPage)); // Initialize with the first page data
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
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <p>No favorites found.</p>
      </div>
    );

  return (
    <div className="user-dashboard-data" ref={targetDivRef}>
      <div className="user-my-favorites">
        <h1>My Favorites</h1>
      </div>
      <div className="user-my-favorites-inner">
        {renderList.map((business) => (
          <div key={business.id} className="event-brand-box">
            <div className="brand-logo">
              <div className="brand-heart">
                <input
                  type="checkbox"
                  id={`favorite-${business.id}`}
                  checked={buttonStatus[business.id] === true} // Checks current status
                  onChange={() => handleFavoriteClick(business.id)}
                  aria-label={`Favorite ${business.name}`}
                />
                <label htmlFor={`favorite-${business.id}`}>
                  <img
                    src={
                      buttonStatus[business.id] === true
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
                  business.profile_image
                    ? BASE_URL + business.profile_image
                    : "/images/near-event3.png"
                }
                alt={business.name}
              />
            </div>

            <div className="event-pad">
              <h6>{business?.name}</h6>
              <p>{truncateDescriptionByWords(business?.description, 10)}</p>
              <div className="point-icon">
                <span>
                  {" "}
                  <Image
                    width={20}
                    height={20}
                    src="/images/location-dot.png"
                    alt=""
                  />{" "}
                  {business?.distance || 0} miles away{" "}
                </span>
                <span>
                  <Image
                    width={20}
                    height={20}
                    src="/images/calendar.png"
                    alt=""
                  />
                  {/* {" "}
                  {DateTime.fromFormat(
                    business.events_date,
                    "yyyy-MM-dd"
                  ).toFormat("MMMM dd, yyyy")}{" "} */}
                </span>
                {business?.location && (
                  <span>
                    <Image
                      width={20}
                      height={20}
                      src="/images/loc-mark.svg"
                      alt=""
                    />{" "}
                    {business?.location}{" "}
                  </span>
                )}
              </div>
              <Link
                className="btn btn-viewmore-border "
                // href={`/businesses/${item?.id}`}
                href={`/businesses/${business?.id}?business_id=${business?.id}`}
                role="button"
              >
                View More
              </Link>
            </div>
          </div>
        ))}
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
