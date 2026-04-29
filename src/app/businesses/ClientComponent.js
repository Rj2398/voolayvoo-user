"use client";
import React, { useCallback, useEffect, useState, useRef } from "react"; // Import useRef
import { useAuth } from "../UserProvider";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { postFetchDataWithAuth } from "@/fetchData/fetchApi"; // Not directly used in the loop, but good to keep
import { toast } from "react-toastify";
import AutoCompleteGoogle from "@/components/AutoCompleteGoogle"; // Not used in the provided snippet
import { DateTime } from "luxon";
import Image from "next/image";
import { BASE_URL } from "@/constant/constant";
import { Rating } from "@mui/material";
import Link from "next/link";
import CustomPagination from "@/components/CustomPagination";
import LocationDropdown from "@/components/LocationDropdown";
import Slider from "@/components/Slider";
import {
  calculateDistanceInMiles,
  filterByEventDistance,
  getCurrentLocation,
  truncateDescriptionByWords,
} from "@/utils/eventFunction";
import axios from "axios";
import { useSelector } from "react-redux";

const ClientComponent = ({ categoryList, businessList }) => {
  // console.log(businessList, "business list ***");
  const { categoryId } = useSelector((state) => state.user);

  // State for the raw list of businesses with calculated distances
  const [businessesWithDistances, setBusinessesWithDistances] = useState([]);
  // State for the list after applying all filters and sorting (before pagination)
  const [filteredAndSortedBusinesses, setFilteredAndSortedBusinesses] =
    useState([]);
  // State for the businesses to be rendered on the current page
  const [renderList, setRenderList] = useState([]);

  const [pageNo, setPageNo] = useState(1);
  const PAGE_LIMIT = 12;

  const [selectCategory, setSelectCategory] = useState({ category_id: "All" });
  // const [reload, setReload] = useState(false); // Evaluate if this state is still necessary

  const [appliedFilter, setAppliedFilter] = useState({
    isCategoryApply: false,
    isSearchApply: false,
    isLocationApply: false,
    isMilesApply: false,
  });

  const [searchValue, setSearchValue] = useState("");
  const [locationFilter, setLocationFilter] = useState([]);
  const { isAuthenticated, userDetails } = useAuth();
  const [silderValue, setSliderValue] = useState({ from: 0, to: 100 });
  const [sortOption, setSortOption] = useState("default");

  const [favoriteStatusMap, setFavoriteStatusMap] = useState({}); // Renamed from buttonStatus for clarity
  const [followStatusMap, setFollowStatusMap] = useState({}); // Renamed from likesState for clarity

  let pathName = usePathname();
  const router = useRouter();

  // 1. Initial Data Processing and Distance Calculation
  // This effect runs ONCE when businessList changes.
  useEffect(() => {
    const processInitialBusinesses = async () => {
      let tempBusinesses = [...businessList]; // Always work with a copy

      try {
        const position = await getCurrentLocation();
        if (position) {
          tempBusinesses = tempBusinesses.map((biz) => {
            const targetLocation = {
              latitude: biz.latitude,
              longitude: biz.longitude,
            };
            return {
              ...biz,
              event_away_distance: calculateDistanceInMiles(
                position,
                targetLocation
              ),
            };
          });
        }
      } catch (error) {
        console.error("Error getting current location:", error);
        // If location fails, proceed without distance calculation, don't block
      }
      setBusinessesWithDistances(tempBusinesses);
    };

    if (businessList && businessList.length > 0) {
      processInitialBusinesses();
    }
  }, [businessList]); // Only re-run if the original businessList prop changes

  // 2. Apply Filters and Sorting (Triggered by filter/sort state changes)
  // This effect takes the stable `businessesWithDistances` and applies all user filters/sorts.
  useEffect(() => {
    let currentList = [...businessesWithDistances]; // Start with the full processed list

    // Apply Category Filter
    if (appliedFilter.isCategoryApply && selectCategory.category_id !== "All") {
      currentList = currentList.filter(
        (listItem) =>
          Number(listItem.category_id) === Number(selectCategory.category_id)
      );
    }

    // Apply Search Filter
    if (appliedFilter.isSearchApply && searchValue) {
      currentList = currentList.filter((biz) =>
        biz?.name.toLowerCase()?.includes(searchValue.toLowerCase())
      );
    }

    // Apply Location Filter
    if (locationFilter.length > 0) {
      currentList = currentList.filter((obj) => {
        const locationParts = obj?.location?.split(", ") || [];
        return locationParts.some((part) =>
          locationFilter.some((name) =>
            part.toLowerCase().includes(name.toLowerCase())
          )
        );
      });
      // Set appliedFilter.isLocationApply to true if locationFilter is active
      // You might need to manage this flag more explicitly if you use it for UI.
      // For now, the filter logic is directly driven by locationFilter.length.
    }

    // Apply Miles Filter
    if (appliedFilter.isMilesApply) {
      currentList = filterByEventDistance(
        currentList,
        silderValue.from,
        silderValue.to
      );
    }

    // Apply Sorting
    switch (sortOption) {
      case "topRating":
        currentList.sort((a, b) => b.rating - a.rating);
        break;
      case "nearBy":
        currentList.sort(
          (a, b) => a.event_away_distance - b.event_away_distance
        );
        break;
      case "upcomingEvents":
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        currentList = currentList
          .filter((item) => {
            if (!item.events_date) return false;
            const eventDate = new Date(item.events_date);
            eventDate.setHours(0, 0, 0, 0);
            return eventDate >= today;
          })
          .sort((a, b) => new Date(a.events_date) - new Date(b.events_date));
        break;
      case "lowToHigh":
        currentList.sort((a, b) => a.rating - b.rating);
        break;
      case "highToLow":
        currentList.sort((a, b) => b.rating - a.rating);
        break;
      case "default":
      default:
        // No specific sort applied for 'default' or unknown options
        break;
    }

    setFilteredAndSortedBusinesses(currentList);
    setPageNo(1); // Reset to first page whenever filters/sorts change
  }, [
    businessesWithDistances, // Base data for filtering/sorting
    appliedFilter,
    searchValue,
    locationFilter,
    silderValue,
    sortOption,
    selectCategory,
  ]);

  // 3. Pagination (Triggered by filtered/sorted list or page number changes)
  // This effect slices the filtered and sorted list for the current page display.
  useEffect(() => {
    const startIndex = (pageNo - 1) * PAGE_LIMIT;
    const endIndex = startIndex + PAGE_LIMIT;
    const paginatedList = filteredAndSortedBusinesses.slice(
      startIndex,
      endIndex
    );
    setRenderList(paginatedList);

    // Initial population of favorite and follow statuses when renderList changes
    const initialFavoriteStatus = paginatedList.reduce((acc, item) => {
      acc[item.business_id] = item?.is_favorite || false;
      return acc;
    }, {});
    setFavoriteStatusMap(initialFavoriteStatus);

    const initialFollowStatus = paginatedList.reduce((acc, item) => {
      acc[item.business_id] = item?.follow_status || 0;
      return acc;
    }, {});
    setFollowStatusMap(initialFollowStatus);
  }, [filteredAndSortedBusinesses, pageNo]);

  // Handlers for interaction (Pagination, Search, Category, Slider, Sort)

  const handlePageNumber = (newPageNo) => {
    setPageNo(newPageNo);
  };

  const handleSearchValue = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    if (!value) {
      setAppliedFilter((pre) => ({ ...pre, isSearchApply: false }));
    }
  };

  const handlePromoterSearch = (e) => {
    e.preventDefault();
    setAppliedFilter((pre) => ({ ...pre, isSearchApply: !!searchValue }));
  };

  const handleSortOption = (option) => {
    setSortOption(option);
  };

  const handleCategorySelect = (category) => {
    const isCategoryEqual =
      category.category_id.toString() === selectCategory.category_id;
    if (!isCategoryEqual) {
      setAppliedFilter((pre) => ({ ...pre, isCategoryApply: true }));
      setSelectCategory({ category_id: category.category_id.toString() });
    } else {
      setAppliedFilter((pre) => ({ ...pre, isCategoryApply: false }));
      setSelectCategory({ category_id: "All" });
    }
    setSortOption("default"); // Reset sort on category change for consistent behavior
  };

  const handleSlider = (e) => {
    setSliderValue({ from: e.fromValue, to: e.toValue });
    setAppliedFilter((pre) => ({
      ...pre,
      isMilesApply: !(e.fromValue === 0 && e.toValue === 100),
    }));
  };

  // Redux categoryId integration
  useEffect(() => {
    if (categoryId !== null) {
      handleCategorySelect({ category_id: parseInt(categoryId) });
    }
  }, [categoryId]); // Rerun when categoryId from Redux changes

  // Favorite and Follow API calls and state updates
  const handleFavoriteClick = async (businessId) => {
    if (!isAuthenticated) {
      router.push(`/login?lastPath=${pathName}`);
      return;
    }
    const isCurrentlyFavorite = favoriteStatusMap[businessId];
    const newFavoriteStatus = !isCurrentlyFavorite; // Toggle status

    // Optimistic UI update
    setFavoriteStatusMap((prevStatus) => ({
      ...prevStatus,
      [businessId]: newFavoriteStatus,
    }));

    const formData = new FormData();
    formData.append("user_id", userDetails?.user_id);
    formData.append("business_id", businessId);
    formData.append("like_status", newFavoriteStatus ? "1" : "0"); // Send 1 for like, 0 for unlike

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
      // If API call fails, revert UI state (or handle error)
      if (!response.data.success) {
        // Assuming success property in response
        setFavoriteStatusMap((prevStatus) => ({
          ...prevStatus,
          [businessId]: isCurrentlyFavorite, // Revert to old status
        }));
        toast.error("Failed to update favorite status. Please try again.");
      } else {
        toast.success(
          `Business ${
            newFavoriteStatus ? "added to" : "removed from"
          } favorites`
        );
      }
    } catch (error) {
      console.error("Error updating favorite status:", error);
      // Revert UI state on API error
      setFavoriteStatusMap((prevStatus) => ({
        ...prevStatus,
        [businessId]: isCurrentlyFavorite,
      }));
      toast.error("An error occurred while updating favorite status.");
    }
  };

  const handleFollowClick = async (business_id) => {
    // Renamed from handleCheckboxClick
    if (!isAuthenticated) {
      router.push(`/login?lastPath=${pathName}`);
      return;
    }
    const isCurrentlyFollowing = followStatusMap[business_id] == 1;
    const newFollowStatus = isCurrentlyFollowing ? 0 : 1; // Toggle status (0 for unfollow, 1 for follow)

    // Optimistic UI update
    setFollowStatusMap((prevStatus) => ({
      ...prevStatus,
      [business_id]: newFollowStatus,
    }));

    const formData = new FormData();
    formData.append("user_id", userDetails.user_id);
    formData.append("business_id", business_id);
    formData.append("follow_status", newFollowStatus);

    try {
      const response = await axios.post(
        `${BASE_URL}/api/auth/user_follower_promoter_business`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${userDetails?.token}`,
          },
        }
      );
      if (!response.data.success) {
        // Assuming success property in response
        setFollowStatusMap((prevStatus) => ({
          ...prevStatus,
          [business_id]: isCurrentlyFollowing ? 1 : 0, // Revert to old status
        }));
        toast.error("Failed to update follow status. Please try again.");
      } else {
        toast.success(
          `You are now ${
            newFollowStatus === 1 ? "following" : "unfollowing"
          } this business`
        );
      }
    } catch (error) {
      console.error("Error updating follow status:", error);
      // Revert UI state on API error
      setFollowStatusMap((prevStatus) => ({
        ...prevStatus,
        [business_id]: isCurrentlyFollowing ? 1 : 0,
      }));
      toast.error("An error occurred while updating follow status.");
    }
  };

  // Category list sorting (done once)
  const [sortedCategoryList, setSortedCategoryList] = useState([]);
  useEffect(() => {
    setSortedCategoryList(
      [...categoryList].sort(
        (
          a,
          b // Create a copy before sorting to avoid direct prop mutation
        ) => a.category_name.localeCompare(b.category_name)
      )
    );
  }, [categoryList]);

  return (
    <div className="container myClassForFilter">
      {/* column first */}
      {/* <div className="ColumnValueOne">
        <div className="event-cat TopMargin">
          <h5>Event Categories</h5>
          <ul>
            {sortedCategoryList.map((item) => (
              <li key={item.category_id}>
                <a
                  style={{
                    cursor: "pointer",
                    color:
                      selectCategory.category_id === `${item.category_id}`
                        ? "#F10027"
                        : "black",
                  }}
                  onClick={() => handleCategorySelect(item)}
                  id={item.category_id}
                >
                  {item.category_name} <span>({item.count})</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div> */}
      <div className="event-cat TopMargin" style={{ padding: "0 15px" }}>
        <h5 style={{ marginBottom: "15px" }}>Event Categories</h5>
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            display: "flex",
            flexDirection: "column", // Keeps them as a list
            gap: "10px",
          }}
        >
          {sortedCategoryList.map((item) => (
            <li key={item.category_id} style={{ width: "100%" }}>
              <a
                style={{
                  cursor: "pointer",
                  display: "flex", // Use flex to keep name and count aligned
                  justifyContent: "space-between", // Pushes count to the right
                  alignItems: "flex-start",
                  color:
                    selectCategory.category_id === `${item.category_id}`
                      ? "#F10027"
                      : "black",
                  textDecoration: "none",
                  fontSize: "16px",
                  wordBreak: "break-word", // Forces long text to wrap instead of crop
                  lineHeight: "1.4",
                }}
                onClick={() => handleCategorySelect(item)}
                id={item.category_id}
              >
                {/* Main Category Name */}
                <span style={{ flex: 1, paddingRight: "10px" }}>
                  {item.category_name}
                </span>

                {/* Count - keep it from shrinking */}
                <span style={{ whiteSpace: "nowrap" }}>({item.count})</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
      {/* column two */}
      <div className="ColumnValueTwo">
        <div className="row justify-content-start p-3 ">
          <div className="col-lg-6">
            <form
              className="d-flex new-srchbox mb-3"
              onSubmit={handlePromoterSearch}
            >
              <input
                className="new-srch"
                type="search"
                placeholder="Search for businesses"
                aria-label="Search"
                value={searchValue}
                onChange={handleSearchValue}
              />
              <button className="srch-btn srch-btn-page" type="submit">
                <Image width={15} height={16} src="/images/search.png" alt="" />
              </button>
            </form>
          </div>
        </div>
        <div className="row ">
          <div className="col-lg-12 mb-3 ">
            <div className="show-in-right show-cal-loc-range justify-content-start ">
              <LocationDropdown
                locationFilter={locationFilter}
                setLocationFilter={setLocationFilter}
              />
              <div className="dropdown mile-rad-range date-range">
                <a
                  className="btn btn-date-range text-left"
                  type="button"
                  id="date-range-drop"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Select your Mile Radius{" "}
                </a>
                <Slider
                  initialValueFrom={0}
                  initialValueTo={100}
                  handleSliderValues={handleSlider}
                />
              </div>
              <div className="dropdown sort-drop">
                <a
                  className="btn sort text-left"
                  type="button"
                  id="sort-drop"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {" "}
                  Sort{" "}
                </a>
                <ul className="dropdown-menu w-100" aria-labelledby="sort-drop">
                  <li>
                    <a
                      className="dropdown-item"
                      onClick={() => handleSortOption("topRating")}
                    >
                      {" "}
                      Top Rating{" "}
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      onClick={() => handleSortOption("nearBy")}
                    >
                      {" "}
                      Near By{" "}
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      onClick={() => handleSortOption("upcomingEvents")}
                    >
                      {" "}
                      Upcoming Events{" "}
                    </a>
                  </li>
                </ul>
              </div>
              <div className="dropdown ratings-drop">
                <a
                  className="btn ratings text-left"
                  type="button"
                  id="rating-drop"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {" "}
                  Ratings{" "}
                </a>
                <ul
                  className="dropdown-menu w-100"
                  aria-labelledby="rating-drop"
                >
                  <li>
                    <a
                      className="dropdown-item"
                      onClick={() => handleSortOption("lowToHigh")}
                    >
                      {" "}
                      Low to High
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      onClick={() => handleSortOption("highToLow")}
                    >
                      {" "}
                      High to Low
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {Array.isArray(renderList) && renderList.length > 0 ? (
            renderList
              .filter(
                // This filter might still be redundant if your initial data is already unique
                (item, index, self) =>
                  index ===
                  self.findIndex((i) => i.business_id === item.business_id)
              )
              .map((item) => {
                return (
                  <div
                    key={`${item.business_id}`} // Use a stable unique key
                    className="col-lg-4 col-md-6"
                    style={{ marginBottom: "20px" }}
                  >
                    <div
                      className="event-brand-box"
                      style={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <div
                        className="brand-logo"
                        style={{
                          height: "254px",
                          position: "relative",
                          overflow: "hidden",
                        }}
                      >
                        <div className="brand-heart">
                          <form>
                            <input
                              type="checkbox"
                              id={`favorite-${item.business_id}`}
                              checked={
                                favoriteStatusMap[item.business_id] === true
                              }
                              onChange={() =>
                                handleFavoriteClick(item.business_id)
                              }
                              aria-label={`Favorite ${item.name}`}
                            />
                            <label htmlFor={`favorite-${item.business_id}`}>
                              <img
                                src={
                                  favoriteStatusMap[item.business_id] === true
                                    ? "/images/user-bookmark-2.png"
                                    : "/images/user-bookmark.png"
                                }
                                alt="Bookmark"
                                width={25}
                                height={23}
                              />
                            </label>
                          </form>
                        </div>
                        <Image
                          width={254}
                          height={254}
                          src={
                            item?.profile_image
                              ? `${BASE_URL}/${item?.profile_image}`
                              : "/images/near-event1.png"
                          }
                          alt=""
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                        <div className="brand-follow">
                          <form>
                            <div>
                              <input
                                type="checkbox"
                                name="follow" // Changed name from "favorite" to "follow"
                                id={`follow-${item.business_id}`}
                                checked={followStatusMap[item.business_id] == 1}
                                onChange={() =>
                                  handleFollowClick(item.business_id)
                                }
                              />
                              <label htmlFor={`follow-${item.business_id}`}>
                                <img
                                  className="brand-follow-check"
                                  src="/images/promoter/follow-plus.svg"
                                  alt="Follow"
                                  style={{
                                    backgroundColor: "red",
                                    padding: "5px",
                                    borderRadius: "50%",
                                  }}
                                />
                                <img
                                  className="brand-follow-check-fill "
                                  style={{
                                    backgroundColor: "#FF474D",
                                    padding: "5px",
                                    borderRadius: "30%",
                                  }}
                                  src="/images/promoter/follow-check.svg"
                                  alt="Following"
                                />
                              </label>
                            </div>
                          </form>
                        </div>
                      </div>
                      <div
                        className="event-pad"
                        style={{
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <h6>{item?.name}</h6>

                        <Rating
                          value={item?.rating}
                          onChange={(event, newValue) => {}}
                          precision={0.5}
                          disabled={true}
                        />
                        <p style={{}}>
                          {truncateDescriptionByWords(item?.description, 10) ||
                            "description"}
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
                            {item?.event_away_distance?.toFixed(1) || 0} miles
                            away{" "}
                          </span>
                          <span>
                            <Image
                              width={20}
                              height={20}
                              src="/images/calendar.png"
                              alt=""
                            />{" "}
                            {item.events_date
                              ? DateTime?.fromFormat(
                                  item.events_date,
                                  "yyyy-MM-dd"
                                ).toFormat("MMMM dd, yyyy")
                              : "N/A"}{" "}
                          </span>

                          {item?.location && (
                            <span>
                              <Image
                                width={20}
                                height={20}
                                src="/images/loc-mark.svg"
                                alt=""
                              />{" "}
                              {item?.location}{" "}
                            </span>
                          )}
                        </div>
                        <Link
                          className="btn btn-viewmore-border "
                          href={`/businesses/${item?.id}?business_id=${item?.business_id}`}
                          role="button"
                        >
                          View More
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })
          ) : (
            <div className="row">
              <p className="noDataText">No Businesses Found</p>
            </div>
          )}
          {filteredAndSortedBusinesses.length > PAGE_LIMIT && (
            <CustomPagination
              dataArray={filteredAndSortedBusinesses}
              pageNo={pageNo}
              clickPageNumber={handlePageNumber}
              pageLimit={PAGE_LIMIT}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientComponent;
