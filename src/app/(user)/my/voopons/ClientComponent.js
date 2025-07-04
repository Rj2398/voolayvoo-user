"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import DatePicker from "react-multi-date-picker";
import { DateObject } from "react-multi-date-picker";
import {
  filterEvent,
  calculateDistanceInMiles,
  isDate1BeforeDate2,
  countCategory,
  filterByEventDistance,
  filterObjectsByDateRange,
  convertTo12HourFormat,
  filterObjectsByDateRangeMyEvents,
  getCurrentLocation,
} from "@/utils/eventFunction";
import { DateTime } from "luxon";
import { BASE_URL } from "@/constant/constant";
import CustomPagination from "@/components/CustomPagination";
import Slider from "@/components/Slider";
import AutoCompleteGoogle from "@/components/AutoCompleteGoogle";
import CustomDatePicker from "@/components/CustomDatePicker";
import {
  checkExpirationStatus,
  filterByVoopanDistance,
  filterVoopansByDateRange,
} from "@/utils/voopanFunction";
import {
  Coordinates,
  FilterApplyType,
  SelectCategoryType,
} from "@/app/voopons/ClientComponent";
import { toast } from "react-toastify";
import { postFetchDataWithAuth } from "@/fetchData/fetchApi";
import { useAuth } from "@/app/UserProvider";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Loader from "@/components/custom/Loader";

const ClientComponent = ({ categoryMainList = [] }) => {
  const { isAuthenticated, userDetails } = useAuth();
  const [location, setLocation] = useState(false);
  const [vooponList, setVooponList] = useState([]);

  const [categoryList, setCategoryList] = useState([]);


  const [tempEventList, setTempVooponList] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [selectCategory, setSelectCategory] = useState({
    category_id: "All",
  });
  const [appliedFilter, setAppliedFilter] = useState({
    isCategoryApply: false,
    isSearchApply: false,
    isDateRangeApply: false,
    isLoacationApply: false,
    isMilesAppy: false,
    isPaginationApply: false,
  });
  const [renderList, setRenderList] = useState([]);

  const [dateFilter, setDateFilter] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [locationFilter, setLocationFilter] = useState([]);

  const [silderValue, setSliderValue] = useState({ from: 0, to: 100 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchVooponList();
  }, [categoryMainList, userDetails]);

  const fetchVooponList = async () => {
    try {
      setLoading(true);
      const resultVoopon = await postFetchDataWithAuth({
        data: { user_id: userDetails?.user_id },
        endpoint: "user_my_voopon_list",
        authToken: userDetails.token,
      });

      const combinedTemplist = [
        ...resultVoopon?.data?.voopon_one,
        ...resultVoopon?.data?.voopon_two,
      ];
      setVooponList(combinedTemplist);
      setRenderList(combinedTemplist);

      if (combinedTemplist.length > 0) {
        setVooponList(combinedTemplist);
      } else {
        setVooponList([]);
      }
    } catch (error) {
      const errorMessage =
        typeof error === "string"
          ? `${error}`
          : error?.message
          ? error?.message
          : `${error}`;
      toast.error(errorMessage);
      setVooponList([]);
    } finally {
      setLoading(false);
    }
  };

  const sortedCategoryList = categoryList.sort((a, b) => {
    if (a.category_name < b.category_name) {
      return -1;
    }
    if (a.category_name > b.category_name) {
      return 1;
    }
    return 0;
  });

  const handleSlider = (e) => {
    const selectedRange = { from: e.fromValue, to: e.toValue };
    setSliderValue(selectedRange);

    if (selectedRange.from === 0 && selectedRange.to === 100) {
      setAppliedFilter((pre) => ({
        ...pre,
        isMilesAppy: false,
      }));
      setRenderList(vooponList); // Reset if no filter is applied
    } else {
      setAppliedFilter((pre) => ({
        ...pre,
        isMilesAppy: true,
      }));
      filterListByMileRadius(selectedRange); // Call the function to filter the list
    }
  };
  const filterListByMileRadius = (range) => {
    const userLocation = getCurrentLocation();

    const filteredList = vooponList.filter((voopon) => {
      const vooponLocation = {
        latitude: voopon.latitude,
        longitude: voopon.longitude,
      };

      const distance = calculateDistanceInMiles(userLocation, vooponLocation);
      return distance >= range.from && distance <= range.to; // Filter by selected range
    });

    setRenderList(filteredList); // Update renderList with filtered data
  };
  // useEffect(() => {
  //   const fetchUserLocation = async () => {
  //     try {
  //       const position: Coordinates = await getCurrentLocation();
  //       setLocationFilter([position.latitude, position.longitude]);
  //     } catch (error) {
  //       console.error("Error fetching location:", error);
  //     }
  //   };

  //   fetchUserLocation();
  // }, []);

  // Code Written by Aman
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Filter the vooponList based on the search input
    const filteredVoopons = vooponList.filter((voopon) =>
      voopon.voopons_name.toLowerCase().includes(searchValue.toLowerCase())
    );
    setRenderList(filteredVoopons);
  };

  // Function to handle input change for the search box
  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };
  const handleDateChange = (dates) => {
    setDateFilter(dates); // Store selected date range
    filterListByDate(dates); // Filter the voopon list by date range
  };
  const filterListByDate = (dates) => {
    if (dates && dates.length === 2) {
      const [startDate, endDate] = dates.map((date) =>
        DateTime.fromJSDate(new Date(date)).toFormat("yyyy-MM-dd")
      );

      const filteredList = vooponList.filter((voopon) => {
        const vooponDate = DateTime.fromFormat(
          voopon.voopons_valid_thru,
          "yyyy-MM-dd"
        );
        return (
          vooponDate >= DateTime.fromISO(startDate) &&
          vooponDate <= DateTime.fromISO(endDate)
        );
      });
      setRenderList(filteredList); // Update the renderList with filtered data
    } else {
      // If no dates are selected, reset to original list
      setRenderList(vooponList);
    }
  };
  // for location filter
  const handleSelectLocation = (e) => {
    setLocationFilter(e);

    applyFilter(e);
  };

  const applyFilter = (selectedLocations) => {
    if (selectedLocations.length === 0) {
      // Reset to original list if no filter is applied
      setRenderList(vooponList);
    } else {
      // Apply the filter based on selected locations
      const updatedLocations = vooponList.filter((item) =>
        selectedLocations.some((filter) =>
          item.location.toLowerCase().includes(filter.toLowerCase())
        )
      );
      setRenderList(updatedLocations);
    }
  };
  //

  // not done
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const position = await getCurrentLocation();

        if (vooponList && position) {
          const updatedVooponList = vooponList.map((voopon) => {
            const targetLocation = {
              latitude: voopon.latitude,
              longitude: voopon.longitude,
            };

            return {
              ...voopon,
              // distance: calculateDistanceInMiles(position, targetLocation),
            };
          });

          setVooponList(updatedVooponList);
          if (updatedVooponList.length > 9) {
            setAppliedFilter((pre) => ({ ...pre, isPaginationApply: true }));
          } else {
            setRenderList(updatedVooponList);
          }
        }
      } catch (error) {
        console.error("Error getting current location:", error);
      }
    };

    // fetchLocation();
  }, [vooponList]);
  const itemsPerPage = 9; // Number of items per page

  const handlePageNumber = (newPageNo) => {
    setPageNo(newPageNo);

    const startIdx = (newPageNo - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;

    const newRenderList = vooponList.slice(startIdx, endIdx); // Slice the vooponList based on the page number

    setRenderList(newRenderList); // Update the renderList to display only items for the current page
  };
  useEffect(() => {
    // Initialize the first page when vooponList is fetched
    if (vooponList.length > 0) {
      const initialRenderList = vooponList.slice(0, itemsPerPage); // Get the first 9 items
      setRenderList(initialRenderList);
    }
  }, [vooponList]);
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginLeft: "400px",
        }}
      >
        <Loader loading={loading} />
      </div>
    );
  }
  return (
    <div className="user-dashboard-data user-my-eve">
      <div className="user-my-favorites">
        <div className="deals-inner-search">
          <form onSubmit={handleSearchSubmit}>
            <label className="interests-search">
              <input
                type="text"
                placeholder="Search for Promoters"
                value={searchValue}
                onChange={handleSearchChange} // Update search value when typing
              />
              <button type="submit">
                <Image width={20} height={21} src="/images/search.png" alt="" />
              </button>
            </label>
          </form>
        </div>
      </div>
      <div className="user-my-voop-eve">
        <div className="row">
          <div className="col-lg-12 mb-3">
            <div className="show-cal-loc-range">
              {/* <div className="dropdown date-range">
                  <a
                    className="btn select-categories text-left"
                    type="button"
                    id="dropdownMenuButton1"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {" "}
                    Event Categories{" "}
                  </a>
                  <ul
                    className="dropdown-menu w-100"
                    aria-labelledby="dropdownMenuButton1"
                  >
                    {categoryList.map((item: any) => (
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
                          {item.category_name} <span>({item.count})</span>{" "}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div> */}
              <div className="calendar">
                <div className="broker-date">
                  <CustomDatePicker
                    date={dateFilter}
                    onChange={handleDateChange}
                  />
                </div>
              </div>
              <div className="location-drop">
                <a
                  onClick={() => setLocation(location ? false : true)}
                  className="btn btn-location text-left"
                  href="#"
                  role="button"
                >
                  {" "}
                  Location{" "}
                </a>
                <div
                  className="location-drop-list"
                  style={{ display: location ? "block" : "none" }}
                >
                  <form>
                    <AutoCompleteGoogle
                      select={locationFilter}
                      setSelect={handleSelectLocation}
                    />
                  </form>
                </div>
              </div>
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
                  handleSliderValues={handleSlider} // Attach the updated handler
                />
              </div>
            </div>
          </div>
          {Array.isArray(renderList) &&
            renderList.length > 0 &&
            renderList.map((item, index) => {
              return <CardItem key={`${item?.id}_${index}`} item={item} />;
            })}
          {Array.isArray(renderList) && renderList.length === 0 && (
            <div className="row">
              <p className="noDataText">No Voopons</p>
            </div>
          )}
          <CustomPagination
            dataArray={vooponList} // Pass the full vooponList to calculate total pages
            pageNo={pageNo}
            clickPageNumber={handlePageNumber}
            pageLimit={itemsPerPage} // Limit of items per page
          />
        </div>
      </div>
    </div>
  );
};

export default ClientComponent;
const MAX_WORDS = 10; // Define the word limit

const truncateDescription = (description, wordLimit) => {
  const words = description.split(" ");
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(" ") + "..."; // Truncate and add ellipsis
  }
  return description; // If under the limit, return the full description
};
const CardItem = ({ item }) => {
  const currentDate = new Date();
  const vooponsValidThruDate = DateTime.fromFormat(
    item?.voopons_valid_thru,
    "yyyy-MM-dd"
  );
  const diffInMilliseconds = vooponsValidThruDate - currentDate;
  const diffInDays = Math.round(diffInMilliseconds / (1000 * 60 * 60 * 24));
  const router = useRouter();
  const handleMore = useCallback(
    (e) => {
      e.preventDefault();
      router.push(
        `/my/voopons/${item?.category_id}?match_number=${item?.match_number}`
      );
    },
    [item]
  );
  return (
    // <div className="col-lg-4">
    //   <div className="event-brand-box w-100">
    //     <div className="brand-logo">
    //       <span>
    //         {" "}
    //         {Number(item?.voopons_price) === 0
    //           ? "Free"
    //           : "$" + Number(item?.voopons_price)}
    //       </span>
    //       <span>{item?.voopons_name}</span>
    //       <Image
    //         width={290}
    //         height={226}
    //         alt=""
    //         style={{ objectFit: "cover" }}
    //         src={
    //           item?.business_voopon_image?.image_name
    //             ? `${BASE_URL}/${item?.business_voopon_image?.image_name}`
    //             : "/images/near-event1.png"
    //         }
    //         onError={(e) => {
    //           e.target.src = "/images/near-event.png";
    //         }}
    //       />
    //     </div>
    //     <div className="event-pad">
    //       <h6> {item?.promoter_details?.voopons_name}</h6>
    //       <p className="truncate-text">
    //         {item?.promoter_details?.voopons_description}
    //       </p>
    //       <div className="point-icon">
    //         {/* <span>
    //           <Image
    //             width={20}
    //             height={20}
    //             src="/images/location-dot.png"
    //             alt=""
    //           />{" "}
    //           {item?.distance} miles away
    //         </span> */}
    //         <span>
    //           <Image width={20} height={20} src="/images/calendar.png" alt="" />{" "}
    //           {DateTime.fromFormat(item?.voopons_date, "yyyy-MM-dd").toFormat(
    //             "MMMM dd, yyyy"
    //           )}
    //         </span>
    //         {/* <span>
    //           <Image width={20} height={20} src="/images/watch.png" alt="" />{" "}
    //           {convertTo12HourFormat(item?.voopons_date)} to{" "}
    //           {convertTo12HourFormat(item?.voopons_valid_thru)}
    //         </span> */}
    //       </div>
    //       <Link
    //         className="btn btn-viewmore-border"
    //         role="button"
    //         href={"#"}
    //         onClick={handleMore}
    //       >
    //         View More
    //       </Link>
    //     </div>
    //   </div>
    // </div>
    //code written by Aman
    <div className="col-lg-4">
      <div className="voopan-box">
        {diffInDays < 7 ? (
          <span className="expiring-soon">Expiring soon</span>
        ) : null}
        <div className="voopon-logo">
          <Image
            width={290}
            height={226}
            alt=""
            style={{ objectFit: "cover" }}
            src={
              item?.business_voopon_image?.image_name
                ? `${BASE_URL}/${item?.business_voopon_image?.image_name}`
                : "/images/near-event1.png"
            }
            onError={(e) => {
              e.target.src = "/images/near-event.png";
            }}
          />
        </div>
        <div style={{}}>
          <div className="voopon-heading " style={{ width: "100%" }}>
            {truncateDescription(item?.voopons_name, 2)}
          </div>
          <h5>{truncateDescription(item?.voopons_description, 2)}</h5>
          <p>
            <Image width={20} height={20} src="/images/calendar.png" alt="" />{" "}
            {DateTime.fromFormat(item?.voopons_date, "yyyy-MM-dd").toFormat(
              "MMMM dd, yyyy"
            )}
          </p>
        </div>
        <Link
          className="btn btn-viewmore"
          href={`#`}
          onClick={handleMore}
          role="button"
        >
          View More
        </Link>
      </div>
    </div>
  );
};
