"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "../UserProvider";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { postFetchDataWithAuth } from "@/fetchData/fetchApi";
import { toast } from "react-toastify";
import AutoCompleteGoogle from "@/components/AutoCompleteGoogle";
import Image from "next/image";
import { BASE_URL } from "@/constant/constant";
import { Rating } from "@mui/material";
import Link from "next/link";
import CustomPagination from "@/components/CustomPagination";
import LocationDropdown from "@/components/LocationDropdown";
import Slider from "@/components/Slider";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  calculateDistanceInMiles,
  filterByEventDistance,
  getCurrentLocation,
  truncateDescriptionByWords,
} from "@/utils/eventFunction";
import axios from "axios";

const ClientComponent = ({ categoryList, promoterList }) => {
  console.log(categoryList, "hello categoryList  data*********");
  console.log(promoterList, "hello Promoter list data");

  const [tempBusinessList, setTempPromoterList] = useState([]);
  console.log(tempBusinessList, "hello tempPromoters");

  const [mainList, setMainList] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [selectCategory, setSelectCategory] = useState({
    category_id: "All",
  });

  console.log(selectCategory, "hello selecteddd sdfkjashfghj");

  const [reload, setReload] = useState(false);
  const [appliedFilter, setAppliedFilter] = useState({
    isCategoryApply: false,
    isSearchApply: false,
    isDateRangeApply: false,
    isLoacationApply: false,
    isMilesAppy: false,
    isPaginationApply: false,
    isFollwerAdd: false,
  });
  const [renderList, setRenderList] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [locationFilter, setLocationFilter] = useState([]);
  const { isAuthenticated, userDetails } = useAuth();
  const [silderValue, setSliderValue] = useState({ from: 0, to: 100 });
  const [followChecked, setFollowChecked] = useState(false);
  let pathName = usePathname();

  const router = useRouter();

  const handleFollowBtn = async (promoter_id, status) => {
    console.log(promoter_id, "hello promoter iddd data comes form this");

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
      console.log("Response: promoter", response.data);
      if (response.data) {
        setFollowChecked(true);
      }
    } catch (error) {
      // console.error('Error:', error.response ? error.response.data : error.message);
    }
  };
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const position = await getCurrentLocation();

        if (categoryList && promoterList && position) {
          for (let indxEvent in promoterList) {
            const targetLocation = {
              latitude: promoterList[indxEvent]["latitude"],
              longitude: promoterList[indxEvent]["longitude"],
            };
            promoterList[indxEvent]["event_away_distance"] =
              calculateDistanceInMiles(position, targetLocation);
          }
          const tempEvtList = promoterList;
          setTempPromoterList(tempEvtList);
          if (tempEvtList.length > 9) {
            setAppliedFilter((pre) => ({ ...pre, isPaginationApply: true }));
          } else {
            setRenderList(tempEvtList);
          }
        }
      } catch (error) {
        console.error("Error getting current location:", error);
      }
    };

    fetchLocation();
  }, [promoterList]);

  useEffect(() => {
    if (promoterList?.length > 12) {
      setAppliedFilter((pre) => ({ ...pre, isPaginationApply: true }));
    } else {
      setMainList(promoterList);
      setRenderList(promoterList);
    }
  }, [categoryList, promoterList]);

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     // fechData();
  //   } else {
  //     setMainList(promoterList);
  //   }
  // async function fechData() {
  //   try {
  //     const formdata = {
  //       user_id: userDetails.user_id,
  //     };
  //     const response = await postFetchDataWithAuth({
  //       data: formdata,
  //       endpoint: "user_promoter_follow_list",
  //       authToken: userDetails.token,
  //     });

  //     if (response.success) {
  //       const newList = promoterList.map((promoter) => {
  //         const findMatchPromoter = response.data.find(
  //           (promoterId) => promoterId.promoter_id === promoter.id
  //         );
  //         if (findMatchPromoter?.user_id) {
  //           return { ...promoter, ...findMatchPromoter };
  //         } else {
  //           return { ...promoter, follow_status: "0" };
  //         }
  //       });
  //       setMainList(newList);
  //       setAppliedFilter(
  //         (pre): FilterApplyType => ({
  //           ...pre,
  //           isFollwerAdd: !pre.isFollwerAdd,
  //         })
  //       );
  //     } else {
  //       throw response;
  //     }
  //   } catch (error: any) {
  //     const errorMessage =
  //       typeof error === "string"
  //         ? `${error}`
  //         : error?.message
  //         ? error?.message
  //         : `${error}`;
  //     toast.error(errorMessage);
  //   }
  // }
  // eslint-disable-next-line
  // }, [isAuthenticated, reload]);
  useEffect(() => {
    let tempList = mainList;

    if (appliedFilter.isCategoryApply) {
      let newPrmoter = tempList.filter((listItem) => {
        console.log(listItem, "helolololo list item");

        console.log(
          typeof listItem.category_id, // Logs the type of listItem.category_id
          "map type cate", // Logs the string "map type cate"
          typeof Number(selectCategory.category_id) // Logs the type of selectCategory.category_id
        );
        // listItem.category_id.includes(selectCategory.category_id)
        return (
          Number(listItem.category_id) === Number(selectCategory.category_id)
        );
      });

      setTempPromoterList(newPrmoter);
      tempList = newPrmoter;
    } else if (!appliedFilter.isCategoryApply) {
      tempList = tempList;
    }
    if (appliedFilter.isSearchApply) {
      let newPrmoter = tempList.filter((evt) =>
        evt?.name.toLowerCase()?.includes(searchValue.toLowerCase())
      );
      setTempPromoterList(newPrmoter);
      tempList = newPrmoter;
    } else if (!appliedFilter.isSearchApply) {
      tempList = tempList;
    }
    // if (appliedFilter.isDateRangeApply) {
    //   const date = new DateObject(dateFilter[0]);
    //   const date1 = new DateObject(dateFilter[1]);
    //   if (isDate1BeforeDate2(date.format(), date1.format())) {
    //     tempList = filterObjectsByDateRange(
    //       date.format(),
    //       date1.format(),
    //       tempList
    //     );
    //   }
    // } else if (!appliedFilter.isDateRangeApply) {
    //   tempList = filterEvent(tempList, categoryList);
    // }
    if (locationFilter.length > 0) {
      let newEvent = tempList.filter((obj) => {
        const locationParts = obj?.location?.split(", ") || [];

        return locationParts.some((part) =>
          locationFilter.some((name) => part.includes(name))
        );
      });

      setTempPromoterList(newEvent);
      tempList = newEvent;
    } else if (locationFilter.length === 0) {
      tempList = tempList;
    }
    if (appliedFilter.isMilesAppy) {
      tempList = filterByEventDistance(
        tempList,
        silderValue.from,
        silderValue.to
      );
    } else if (!appliedFilter.isMilesAppy) {
      tempList = tempList;
    }
    if (tempList?.length > 12 && appliedFilter.isPaginationApply) {
      setTempPromoterList(tempList);
      tempList = tempList.filter((item, indx) => indx < 12);
    } else {
      tempList = tempList;
    }
    setPageNo(1);
    setRenderList(tempList);
    // eslint-disable-next-line
  }, [appliedFilter, locationFilter]);

  const handlePageNumber = (pageNo) => {
    let newPrmoterList = [];
    for (let num = 8; num >= 0; num--) {
      let cal = pageNo * 9 - num;
      if (tempBusinessList.length > cal) {
        newPrmoterList.push(tempBusinessList[cal]);
      }
    }
    // if (targetDivRef.current) {
    //   targetDivRef.current.scrollIntoView({
    //     behavior: "smooth",
    //     block: "start",
    //   });
    // }
    setPageNo(pageNo);
    setRenderList(newPrmoterList);
  };
  const handleSearchValue = (e) => {
    if (e.target.value) {
      setSearchValue(e.target.value);
    } else {
      setSearchValue(e.target.value);
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
    // if (targetDivRef.current) {
    //   targetDivRef.current.scrollIntoView({
    //     behavior: "smooth",
    //     block: "start",
    //   });
    // }
  };
  const [sortedCategoryList, setSortedCategoryList] = useState([]);

  useEffect(() => {
    setSortedCategoryList(
      categoryList.sort((a, b) =>
        a.category_name.localeCompare(b.category_name)
      )
    );
  }, [categoryList]);
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
          setReload(!reload);
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
          setReload(!reload);
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
  const [sortOption, setSortOption] = useState("default");
  const handleSortOption = (option) => {
    setSortOption(option);
    setAppliedFilter((pre) => ({ ...pre, isSortApply: true }));
    let tempList = mainList;
    switch (option) {
      case "topRating":
        tempList = tempList.sort((a, b) => b.rating - a.rating);
        break;
      case "nearBy":
        tempList = tempList.sort(
          (a, b) => a.event_away_distance - b.event_away_distance
        );
        break;
      case "upcomingEvents":
        tempList = tempList.sort(
          (a, b) => new Date(a.events_date) - new Date(b.events_date)
        );
        break;
      case "lowToHigh":
        tempList = tempList.sort((a, b) => a.rating - b.rating);
        break;
      case "highToLow":
        tempList = tempList.sort((a, b) => b.rating - a.rating);
      default:
        tempList = mainList;
    }
    setTempPromoterList(tempList);
    setRenderList(tempList);
  };
  const handleCategorySelect = (category) => {
    console.log(category, "hello category list data from thissss api");

    const isCategoryEqual =
      category.category_id.toString() === selectCategory.category_id;
    if (!isCategoryEqual) {
      setAppliedFilter((pre) => ({ ...pre, isCategoryApply: true }));
      setSelectCategory({
        category_id: category.category_id.toString(),
      });
    } else if (isCategoryEqual) {
      setAppliedFilter((pre) => ({ ...pre, isCategoryApply: false }));
      setSelectCategory({
        category_id: "All",
      });
    }
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

  //

  //

  return (
    <div className="container myClassForFilter">
      {/* column first */}

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
            {/* <div className="show-cal-loc-range show-in-right "> */}
            <div className="show-cal-loc-range show-in-right promoter-filter">
              <LocationDropdown
                locationFilter={locationFilter}
                setLocationFilter={setLocationFilter}
              />
              {/* <div className="dropdown mile-rad-range date-range">
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
              </div> */}
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
                  {categoryList.map((item) => (
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

          {Array.isArray(renderList) &&
            renderList.length > 0 &&
            renderList.map((item, index) => {
              console.log(item, "hello world !!!");

              return (
                <div key={index} className="col-lg-3 col-md-6">
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
                          alt=""
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
                          padding: "10px", // Optional: Adds some space inside the circle
                        }}
                        // onClick={() => handleFollowBtn(item?.promoter_id)}
                      >
                        {item?.follow_status == "1" ? (
                          <CheckCircleIcon
                            onClick={() =>
                              handleFollowBtn(item?.promoter_id, "0")
                            }
                            sx={{
                              color: "white",
                              fontSize: 18,
                            }}
                          />
                        ) : (
                          <Image
                            onClick={() =>
                              handleFollowBtn(item?.promoter_id, "1")
                            }
                            width={20}
                            height={20}
                            src="/images/promoter/flow-plus.png" // Ensure the path is correct relative to the public directory
                            alt="Flow Plus Icon" // Provide descriptive alt text
                          />
                        )}
                      </div>
                    </div>
                    <div className="Pro-text">
                      <h4>{item?.name}</h4>
                      <div className="rating-box mb-3">
                        <span>
                          <Rating
                            value={item?.rating}
                            onChange={(event, newValue) => {}}
                            precision={0.5} // Optional: allows half-star ratings
                            disabled={true}
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
                            alt=""
                          />{" "}
                          {item?.location}{" "}
                        </span>
                      </div>
                      <Link
                        className="btn btn-viewmore-border "
                        // href={`/businesses/${item?.id}`}
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
              <p className="noDataText">No Promoter </p>
            </div>
          )}
          <CustomPagination
            dataArray={tempBusinessList}
            pageNo={pageNo}
            clickPageNumber={handlePageNumber}
            pageLimit={12}
          />
        </div>
      </div>
    </div>
  );
};

export default ClientComponent;
