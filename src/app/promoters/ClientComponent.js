


"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../UserProvider";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { postFetchDataWithAuth } from "@/fetchData/fetchApi";
import { toast } from "react-toastify";
import Image from "next/image";
import { BASE_URL } from "@/constant/constant";
import { Rating } from "@mui/material";
import Link from "next/link";
import CustomPagination from "@/components/CustomPagination";
import LocationDropdown from "@/components/LocationDropdown";
import AutoCompleteGoogle from "@/components/AutoCompleteGoogle"; // Not used in this snippet but kept
import Slider from "@/components/Slider"; // Not used in this snippet but kept
import AddBoxIcon from "@mui/icons-material/AddBox"; // Not used in this snippet but kept

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  calculateDistanceInMiles,
  filterByEventDistance,
  getCurrentLocation,
  truncateDescriptionByWords, // Not used in this snippet but kept
} from "@/utils/eventFunction";
import axios from "axios";

const getUniquePromoters = (list) => {
  if (!Array.isArray(list)) return [];
  const seen = new Set();
  return list.filter((item) => {
    const rawId = item?.promoter_id ?? item?.user_id ?? item?.id ?? item?.name;
    if (rawId === undefined || rawId === null) return true;
    const stringId = String(rawId);
    if (seen.has(stringId)) {
      return false;
    }
    seen.add(stringId);
    return true;
  });
};

const truncateTitle = (text, maxLength = 18) => {
  if (!text) return "";
  if (text.length > maxLength) {
    return text.substring(0, maxLength).trim() + "...";
  }
  return text;
};

const ClientComponent = ({ categoryList, promoterList }) => {
  // State for the full list of promoters after distance calculation and initial load
  const [enrichedPromoterList, setEnrichedPromoterList] = useState([]);
  // State for the fully filtered and sorted list (before pagination)
  const [tempBusinessList, setTempBusinessList] = useState([]);
  // State for the list currently being rendered (after pagination)
  const [renderList, setRenderList] = useState([]);

  // console.log("tempBusinessList: ", tempBusinessList);
  // console.log("renderList: ", renderList);

  const [pageNo, setPageNo] = useState(1);
  const [selectCategory, setSelectCategory] = useState({
    category_id: "All",
  });
  const [searchValue, setSearchValue] = useState("");
  const [locationFilter, setLocationFilter] = useState([]);
  const [silderValue, setSliderValue] = useState({ from: 0, to: 100 });
  const [sortOption, setSortOption] = useState("default");
  const [likesState, setLikesState] = useState({}); // For follow/unfollow buttons

  // Filter application flags
  const [appliedFilter, setAppliedFilter] = useState({
    isCategoryApply: false,
    isSearchApply: false,
    isDateRangeApply: false, // Not fully implemented in provided code, but kept
    isLoacationApply: false, // Not fully implemented in provided code, but kept
    isMilesAppy: false,
    isPaginationApply: false, // Indicates if pagination is needed
    isFollwerAdd: false, // Not fully implemented in provided code, but kept
    isSortApply: false, // New flag for sorting
  });

  const [reload, setReload] = useState(false); // Used for force reloads, if needed
  const [sortedCategoryList, setSortedCategoryList] = useState([]);

  const { isAuthenticated, userDetails } = useAuth();
  const pathName = usePathname();
  const router = useRouter();

  // --- Effect 1: Process initial promoterList (calculate distances, set main data) ---
  // This effect runs only when the `promoterList` prop changes.
  // It's responsible for enriching the data with distances and setting the base lists.
  useEffect(() => {
    const processPromoters = async () => {
      // If promoterList is not available or empty, reset everything
      if (!promoterList || promoterList.length === 0) {
        setEnrichedPromoterList([]);
        setTempBusinessList([]);
        setRenderList([]);
        setAppliedFilter((prev) => ({ ...prev, isPaginationApply: false }));
        return;
      }

      let processedList = [...promoterList]; // Create a shallow copy to avoid direct mutation of prop

      try {
        const position = await getCurrentLocation();

        if (position) {
          // Map over the copied list to add event_away_distance
          processedList = processedList.map((promoter) => {
            const targetLocation = {
              latitude: promoter.latitude,
              longitude: promoter.longitude,
            };
            return {
              ...promoter,
              event_away_distance: calculateDistanceInMiles(
                position,
                targetLocation
              ),
            };
          });
        } else {
          console.warn(
            "Could not get current location, distances not calculated."
          );
        }
      } catch (error) {
        console.error("Error processing promoter distances:", error);
        // Continue with processedList even if location fails, just without distances
        // (filterByEventDistance will handle `NaN` gracefully if needed)
      }

      const uniqueProcessedList = getUniquePromoters(processedList);

      // Set the enriched list, which will be the base for all filtering/sorting
      setEnrichedPromoterList(uniqueProcessedList);

      // Initialize tempBusinessList with the full enriched list
      setTempBusinessList(uniqueProcessedList);

      // Set initial renderList based on pagination limit
      if (uniqueProcessedList.length > 12) {
        setAppliedFilter((pre) => ({ ...pre, isPaginationApply: true }));
        setRenderList(uniqueProcessedList.slice(0, 12)); // Show first page initially
      } else {
        setAppliedFilter((pre) => ({ ...pre, isPaginationApply: false }));
        setRenderList(uniqueProcessedList); // Show all if less than limit
      }
    };

    processPromoters();
  }, [promoterList]); // Dependency: only re-run when the initial promoterList prop changes

  // --- Effect 2: Apply Filters and Sorting ---
  // This effect runs whenever filter/sort related states change.
  // It takes `enrichedPromoterList` as its base and applies all filters/sorts.
  useEffect(() => {
    let currentFilteredList = [...enrichedPromoterList]; // Start with the full enriched list

    // 1. Apply Category Filter
    if (appliedFilter.isCategoryApply && selectCategory.category_id !== "All") {
      currentFilteredList = currentFilteredList.filter((listItem) => {
        return (
          Number(listItem.category_id) === Number(selectCategory.category_id)
        );
      });
    }

    // 2. Apply Search Filter
    if (appliedFilter.isSearchApply && searchValue) {
      currentFilteredList = currentFilteredList.filter((evt) =>
        evt?.name.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    // 3. Apply Location Filter
    if (locationFilter.length > 0) {
      currentFilteredList = currentFilteredList.filter((obj) => {
        const locationParts = obj?.location?.split(", ") || [];
        return locationParts.some((part) =>
          locationFilter.some((name) => part.includes(name))
        );
      });
    }

    // 4. Apply Miles Filter (now event_away_distance should exist)
    if (appliedFilter.isMilesAppy) {
      currentFilteredList = filterByEventDistance(
        currentFilteredList,
        silderValue.from,
        silderValue.to
      );
    }

    // 5. Apply Sorting
    if (appliedFilter.isSortApply || sortOption !== "default") {
      // Always apply sort if an option is selected
      switch (sortOption) {
        case "topRating":
          currentFilteredList.sort((a, b) => b.rating - a.rating);
          break;
        case "nearBy":
          currentFilteredList.sort((a, b) => {
            const aDist =
              typeof a.event_away_distance === "number" &&
                !isNaN(a.event_away_distance)
                ? a.event_away_distance
                : Number.MAX_VALUE;
            const bDist =
              typeof b.event_away_distance === "number" &&
                !isNaN(b.event_away_distance)
                ? b.event_away_distance
                : Number.MAX_VALUE;
            return aDist - bDist;
          });
          break;
        case "upcomingEvents":
          // Assuming promoter data has 'events_date' if relevant
          // This might need adjustment if promoters don't directly have 'events_date' or it's an array
          currentFilteredList.sort(
            (a, b) => new Date(a.events_date) - new Date(b.events_date)
          );
          break;
        case "lowToHigh":
          currentFilteredList.sort((a, b) => a.rating - b.rating);
          break;
        case "highToLow":
          currentFilteredList.sort((a, b) => b.rating - a.rating);
          break;
        default:
          // If "default" or no specific sort, rely on initial order from enrichedPromoterList
          // You might want to define a stable default sort if needed.
          break;
      }
    }

    // Deduplicate currentFilteredList before setting tempBusinessList and slicing for pagination
    const uniqueFilteredList = getUniquePromoters(currentFilteredList);

    // Update `tempBusinessList` with the fully filtered, sorted and deduplicated list
    setTempBusinessList(uniqueFilteredList);

    // Update pagination flag based on the unique filtered list
    setAppliedFilter((prev) => ({
      ...prev,
      isPaginationApply: uniqueFilteredList.length > 12,
    }));

    // Reset page number to 1 when filters or sorting change
    setPageNo(1);

    // Set `renderList` for the first page of the newly filtered/sorted data
    setRenderList(uniqueFilteredList.slice(0, 12));
  }, [
    enrichedPromoterList, // Base data for filtering
    appliedFilter.isCategoryApply,
    appliedFilter.isSearchApply,
    appliedFilter.isMilesAppy,
    appliedFilter.isSortApply,
    selectCategory.category_id, // Specific dependency for category changes
    searchValue,
    locationFilter,
    silderValue,
    sortOption, // Dependency for sort option changes
  ]);

  // --- Effect 3: Initialize sortedCategoryList ---
  useEffect(() => {
    if (categoryList) {
      setSortedCategoryList(
        [...categoryList].sort(
          (
            a,
            b // Create a copy to avoid mutating prop directly
          ) => a.category_name.localeCompare(b.category_name)
        )
      );
    }
  }, [categoryList]);

  // --- Pagination Handler ---
  // This is a useCallback to memoize the function, good practice for handlers passed to children
  const handlePageNumber = useCallback(
    (page) => {
      const startIndex = (page - 1) * 12; // Adjusted to your pageLimit of 12
      const endIndex = startIndex + 12;
      const newPromoterList = tempBusinessList.slice(startIndex, endIndex);

      setPageNo(page);
      setRenderList(newPromoterList);
    },
    [tempBusinessList]
  ); // Dependency: tempBusinessList changes mean a new list to paginate

  // --- Other Handlers ---

  const handleFollowBtn = async (promoter_id, status) => {
    // ... (Your existing implementation, ensure it updates state or triggers reload if needed)
    const formData = new FormData();
    formData.append("user_id", userDetails.user_id);
    formData.append("promoter_id", promoter_id);
    formData.append("follow_status", status);

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
      if (response.data) {
        setFollowChecked(true); // This might need to be more granular if you want individual button updates
        // For individual button updates, you'd update likesState here
      }
    } catch (error) {
      console.error(
        "Error in handleFollowBtn:",
        error.response ? error.response.data : error.message
      );
      toast.error("Failed to update follow status.");
    }
  };

  const handleSearchValue = (e) => {
    setSearchValue(e.target.value);
    // If input is cleared, remove search filter
    if (!e.target.value) {
      setAppliedFilter((pre) => ({ ...pre, isSearchApply: false }));
    }
  };

  const handlePromoterSearch = (e) => {
    e.preventDefault();
    if (searchValue) {
      setAppliedFilter((pre) => ({ ...pre, isSearchApply: true }));
    } else {
      setAppliedFilter((pre) => ({ ...pre, isSearchApply: false }));
    }
  };

  const handleFollow = async (id) => {
    if (!isAuthenticated) {
      router.push(`/login?lastPath=${pathName}`);
    } else if (isAuthenticated) {
      try {
        const formdata = {
          promoter_id: id,
          follow_status: 1,
          user_id: userDetails.user_id,
        };
        const response = await postFetchDataWithAuth({
          data: formdata,
          endpoint: "user_follower_promoter",
          authToken: userDetails.token,
        });

        if (response.success) {
          setReload(!reload); // This will trigger a re-fetch of promoterList if you have a parent effect for it
          toast.success(`You have successfully follow promoter`);
        } else {
          throw response;
        }
      } catch (error) {
        const errorMessage =
          typeof error === "string"
            ? `${error}`
            : error?.message
              ? error?.message
              : `${error}`;
        toast.error(errorMessage);
      }
    }
  };

  const handleUnFollow = async (id) => {
    if (!isAuthenticated) {
      router.push(`/login?lastPath=${pathName}`);
    } else if (isAuthenticated) {
      try {
        const formdata = {
          promoter_id: id,
          follow_status: 0,
          user_id: userDetails.user_id,
        };
        const response = await postFetchDataWithAuth({
          data: formdata,
          endpoint: "user_follower_promoter",
          authToken: userDetails.token,
        });

        if (response.success) {
          setReload(!reload); // This will trigger a re-fetch of promoterList if you have a parent effect for it
          toast.success(`You have successfully unfollow promoter`);
        } else {
          throw response;
        }
      } catch (error) {
        const errorMessage =
          typeof error === "string"
            ? `${error}`
            : error?.message
              ? error?.message
              : `${error}`;
        toast.error(errorMessage);
      }
    }
  };

  const handleSortOption = (option) => {
    setSortOption(option);
    // Set isSortApply to true to activate the sorting logic in the main filter effect
    setAppliedFilter((pre) => ({ ...pre, isSortApply: true }));
  };

  const handleCategorySelect = (category) => {
    const isCategoryEqual =
      category.category_id.toString() === selectCategory.category_id;
    if (!isCategoryEqual) {
      setAppliedFilter((pre) => ({ ...pre, isCategoryApply: true }));
      setSelectCategory({
        category_id: category.category_id.toString(),
      });
    } else if (isCategoryEqual) {
      // If same category is clicked again, it means deselect
      setAppliedFilter((pre) => ({ ...pre, isCategoryApply: false }));
      setSelectCategory({
        category_id: "All", // Reset to 'All'
      });
    }
    // The filtering useEffect will re-run due to `selectCategory` or `appliedFilter.isCategoryApply` change
  };

  const handleSlider = (e) => {
    setSliderValue({ from: e.fromValue, to: e.toValue });
    if (e.fromValue === 0 && e.toValue === 100) {
      setAppliedFilter((pre) => ({
        ...pre,
        isMilesAppy: false,
      }));
    } else {
      setAppliedFilter((pre) => ({
        ...pre,
        isMilesAppy: true,
      }));
    }
  };

  // --- Follow/Unfollow Button Logic ---
  // Initialize likesState based on renderList
  useEffect(() => {
    const initialButtonStatus = renderList.reduce((acc, item) => {
      acc[item.promoter_id] = item?.follow_status;
      return acc;
    }, {});
    setLikesState(initialButtonStatus);
  }, [renderList]); // Dependency: re-initialize if renderList changes

  const handleCheckboxClick = async (event, promoter_id) => {
    if (!isAuthenticated) {
      router.push(`/login?lastPath=${pathName}`);
      return;
    }

    const currentStatus = likesState[promoter_id];
    const newStatus = currentStatus === 0 ? 1 : 0;

    // Optimistically update UI
    setLikesState((prevStatus) => ({
      ...prevStatus,
      [promoter_id]: newStatus,
    }));

    const formData = new FormData();
    formData.append("user_id", userDetails.user_id);
    formData.append("promoter_id", promoter_id);
    formData.append("follow_status", newStatus);

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
      if (!response.data) {
        // If API call fails, revert optimistic update
        setLikesState((prevStatus) => ({
          ...prevStatus,
          [promoter_id]: currentStatus,
        }));
        toast.error("Failed to update follow status.");
      } else {
        toast.success(
          newStatus === 1
            ? "Successfully followed promoter"
            : "Successfully unfollowed promoter"
        );
      }
    } catch (error) {
      console.error(
        "Error in handleCheckboxClick:",
        error.response ? error.response.data : error.message
      );
      // Revert optimistic update on error
      setLikesState((prevStatus) => ({
        ...prevStatus,
        [promoter_id]: currentStatus,
      }));
      toast.error("Failed to update follow status.");
    }
  };

  return (
    <div className="container myClassForFilter">
      {/* column two */}
      <div className="">
        <div className="row justify-content-center p-3 ">
          <div className="col-lg-6">
            <form
              className="d-flex new-srchbox mb-3"
              onSubmit={handlePromoterSearch}
            >
              <input
                className="new-srch"
                type="search"
                placeholder="Search for Promoter"
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
            <div className="show-cal-loc-range show-in-right promoter-filter">
              <LocationDropdown
                locationFilter={locationFilter}
                setLocationFilter={setLocationFilter}
              />

              <div className="dropdown sort-drop">
                <a
                  className="btn select-categories text-left"
                  type="button"
                  id="sort-drop"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {" "}
                  categories{" "}
                </a>
                <ul
                  className="dropdown-menu w-100 hide"
                  aria-labelledby="dropdownMenuButton1"
                >
                  {/* "All" option */}
                  <li>
                    <a
                      className="dropdown-item"
                      style={{
                        cursor: "pointer",
                        color:
                          selectCategory.category_id === "All"
                            ? "#F10027"
                            : "black",
                      }}
                      onClick={() =>
                        handleCategorySelect({
                          category_id: "All",
                          category_name: "All",
                        })
                      }
                    >
                      All Categories
                    </a>
                  </li>
                  {/* Dynamic categories */}
                  {sortedCategoryList.map((item) => (
                    <li key={item.category_id}>
                      <a
                        className="dropdown-item"
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
                        {item.category_name} <span>({item.count})</span>{" "}
                      </a>
                    </li>
                  ))}
                </ul>
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
                      onClick={() => handleSortOption("default")}
                      style={{
                        cursor: "pointer",
                        color: sortOption === "default" ? "#F10027" : "black",
                      }}
                    >
                      Default
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      onClick={() => handleSortOption("topRating")}
                      style={{
                        cursor: "pointer",
                        color: sortOption === "topRating" ? "#F10027" : "black",
                      }}
                    >
                      Top Rating
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      onClick={() => handleSortOption("nearBy")}
                      style={{
                        cursor: "pointer",
                        color: sortOption === "nearBy" ? "#F10027" : "black",
                      }}
                    >
                      Near By
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      onClick={() => handleSortOption("upcomingEvents")}
                      style={{
                        cursor: "pointer",
                        color:
                          sortOption === "upcomingEvents" ? "#F10027" : "black",
                      }}
                    >
                      Upcoming Events
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
                      style={{
                        cursor: "pointer",
                        color: sortOption === "lowToHigh" ? "#F10027" : "black",
                      }}
                    >
                      {" "}
                      Low to High
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      onClick={() => handleSortOption("highToLow")}
                      style={{
                        cursor: "pointer",
                        color: sortOption === "highToLow" ? "#F10027" : "black",
                      }}
                    >
                      {" "}
                      High to Low
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {Array.isArray(renderList) &&
            renderList.length > 0 &&
            renderList.map((item) => {
                // Removed index from map for cleaner key management, use item.promoter_id
                return (
                  <div key={item.promoter_id} className="col-lg-3 col-md-6">
                    <div className="promoter-profile">
                      <div className="profile-img">
                        <div className="pro-img">
                          <Image
                            width={254}
                            height={254}
                            src={
                              item?.profile_image
                                ? `${BASE_URL}/${item?.profile_image}`
                                : "/images/near-event1.png"
                            }
                            alt={item?.name || "Promoter Image"}
                          />
                        </div>

                        <div
                          style={{
                            position: "absolute",
                            right: "10px",
                            bottom: "30px",
                            cursor: "pointer",
                            backgroundColor: "#F10027",
                            borderRadius: "50%",
                            padding: "10px",
                          }}
                        >
                          <form>
                            <div key={item.promoter_id}>
                              <input
                                type="checkbox"
                                name="favorite"
                                id={`follow-${item.promoter_id}`}
                                checked={likesState[item.promoter_id] === 1}
                                onChange={(e) =>
                                  handleCheckboxClick(e, item.promoter_id)
                                }
                                style={{ display: "none" }}
                              />
                              <label htmlFor={`follow-${item.promoter_id}`}>
                                {likesState[item.promoter_id] === 1 ? (
                                  <CheckCircleIcon
                                    style={{ color: "white", fontSize: 24 }}
                                    alt="Following"
                                  />
                                ) : (
                                  <Image
                                    style={{ color: "white", fontSize: 24 }}
                                    width={20}
                                    height={20}
                                    src="/images/promoter/flow-plus.png"
                                    alt="Follow"
                                  />
                                )}
                              </label>
                            </div>
                          </form>
                        </div>
                      </div>
                      <div className="Pro-text">
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-start",
                            maxWidth: "100%",
                            overflow: "hidden",
                          }}
                        >
                          <h4
                            title={item?.name}
                            style={{
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              maxWidth: "100%",
                            }}
                          >
                            {truncateTitle(item?.name, 18)}
                          </h4>

                          {item?.badge_status === 1 && (
                            <span
                              style={{
                                marginBottom: "6px",
                                marginLeft: "5px",
                                flexShrink: 0,
                              }}
                            >
                              <Image
                                width={25}
                                height={25}
                                src="/images/verifiedLogo.png"
                                alt=""
                              />
                            </span>
                          )}
                        </div>

                        <div className="rating-box mb-3">
                          <span>
                            <Rating
                              value={item?.rating || 0} // Ensure a default value
                              precision={0.5}
                              readOnly // Changed from disabled to readOnly for better accessibility if it's meant to be static
                            />
                          </span>
                        </div>
                        <p>
                          An evening with inspirational vibes, curated for your
                          enjoyment and listening pleasure.
                        </p>
                        <div className="pro-location">
                          <span>
                            {" "}
                            <Image
                              width={20}
                              height={20}
                              src="/images/loc-mark.svg"
                              alt="Location icon"
                            />{" "}
                            {item?.location}{" "}
                          </span>
                        </div>
                        <Link
                          className="btn btn-viewmore-border "
                          href={`/promoters/${item?.id}?promoter_id=${item?.promoter_id}`}
                          role="button"
                        >
                          View More
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
          {Array.isArray(renderList) && renderList.length === 0 && (
            <div className="row">
              <p className="noDataText">No Promoter Found</p>
            </div>
          )}
          {appliedFilter.isPaginationApply && ( // Only show pagination if needed
            <CustomPagination
              dataArray={tempBusinessList} // Use the fully filtered list for pagination
              pageNo={pageNo}
              clickPageNumber={handlePageNumber}
              pageLimit={12}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientComponent;
