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
  const [eventList, setEventList] = useState([]);

  const [categoryList, setCategoryList] = useState([]);
  const [tempEventList, setTempEventList] = useState([]);
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
    fetchEventList();
  }, [categoryMainList, userDetails]);

  const fetchEventList = async () => {
    try {
      setLoading(true);
      const resultEvent = await postFetchDataWithAuth({
        data: { user_id: userDetails?.user_id },
        endpoint: "user_my_event_list",
        authToken: userDetails.token,
      });

      console.log(resultEvent, "result event data");

      let combinedTemplist = [];

      if (Array.isArray(resultEvent?.data?.event_one)) {
        const templistOne = resultEvent?.data?.event_one?.map((item) => ({
          ...item,
          category_id: item?.category_id,
          subcategory_id: item?.subcategory_id,
        }));
        combinedTemplist = [...combinedTemplist, ...templistOne];
      }

      if (Array.isArray(resultEvent?.data?.event_two)) {
        const templistTwo = resultEvent?.data?.event_two?.map((item) => ({
          ...item,
          category_id: item?.category_id,
          subcategory_id: item?.subcategory_id,
        }));
        combinedTemplist = [...combinedTemplist, ...templistTwo];
      }

      if (combinedTemplist.length > 0) {
        setEventList(filterEvent(combinedTemplist, categoryMainList));
        setCategoryList(countCategory(categoryMainList, combinedTemplist));
      } else {
        setEventList([]);
      }
    } catch (error) {
      const errorMessage =
        typeof error === "string"
          ? `${error}`
          : error?.message
          ? error?.message
          : `${error}`;
      toast.error(errorMessage);
      setEventList([]);
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
  const handleSelectLocation = (e) => {
    setLocationFilter(e);
  };
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const position = await getCurrentLocation();

        if (categoryList && eventList && position) {
          for (let indxEvent in eventList) {
            const targetLocation = {
              latitude: eventList[indxEvent]["latitude"],
              longitude: eventList[indxEvent]["longitude"],
            };
            eventList[indxEvent]["event_away_distance"] =
              calculateDistanceInMiles(position, targetLocation);
          }

          // console.log(categoryList);

          const tempEvtList = filterEvent(eventList, categoryList);
          setTempEventList(tempEvtList);

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
  }, [categoryList, eventList]);
  useEffect(() => {
    let tempList = filterEvent(eventList, categoryList);

    if (appliedFilter.isCategoryApply) {
      tempList = filterEvent(tempList, [
        { category_id: Number(selectCategory.category_id) },
      ]);
      setTempEventList(tempList);
    } else if (!appliedFilter.isCategoryApply) {
      tempList = filterEvent(tempList, categoryList);
      setTempEventList(tempList);
    }
    if (appliedFilter.isSearchApply) {
      let newEvent = tempList.filter((evt) =>
        evt?.promoter_event?.events_name
          .toLowerCase()
          ?.includes(searchValue.toLowerCase())
      );
      setTempEventList(newEvent);
      tempList = newEvent;
    } else if (!appliedFilter.isSearchApply) {
      tempList = filterEvent(tempList, categoryList);
    }
    if (appliedFilter.isDateRangeApply) {
      const date = new DateObject(dateFilter[0]);
      const date1 = new DateObject(dateFilter[1]);
      if (isDate1BeforeDate2(date.format(), date1.format())) {
        tempList = filterObjectsByDateRangeMyEvents(
          date.format(),
          date1.format(),
          tempList,
          "promoter_event"
        );
        setTempEventList(tempList);
      }
    } else if (!appliedFilter.isDateRangeApply) {
      tempList = filterEvent(tempList, categoryList);
    }
    if (locationFilter.length > 0) {
      let newEvent = tempList.filter((obj) => {
        const locationParts = obj?.promoter_event?.location?.split(", ") || [];

        return locationParts.some((part) =>
          locationFilter.some((name) => part.includes(name))
        );
      });

      setTempEventList(newEvent);
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
      setTempEventList(tempList);
    } else if (!appliedFilter.isMilesAppy) {
      tempList = filterEvent(tempList, categoryList);
    }
    if (tempList.length > 9 && appliedFilter.isPaginationApply) {
      setTempEventList(tempList);
      tempList = tempList.filter((item, indx) => indx < 9);
    } else {
      tempList = tempList;
    }
    setPageNo(1);
    setRenderList(tempList);
    // eslint-disable-next-line
  }, [appliedFilter, locationFilter]);

  const handleCategorySelect = (category) => {
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
      if (targetDivRef.current) {
        targetDivRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  };
  const handleDateFilter = (e) => {
    const date = new DateObject(e[0]);
    const date1 = new DateObject(e[1]);
    setDateFilter(e);

    if (isDate1BeforeDate2(date.format(), date1.format())) {
      setAppliedFilter((pre) => ({ ...pre, isDateRangeApply: true }));
    } else {
      setAppliedFilter((pre) => ({ ...pre, isDateRangeApply: false }));
    }
    if (targetDivRef.current) {
      targetDivRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };
  const handlePageNumber = (pageNo) => {
    // Calculate the start and end index for slicing the tempEventList based on the current page number
    const startIndex = (pageNo - 1) * 9; // Start index for the current page
    const endIndex = startIndex + 9; // End index for the current page

    // Filter the tempEventList to only display the items for the current page
    const paginatedList = tempEventList.slice(startIndex, endIndex);

    // Set the current page and the paginated event list to render
    setPageNo(pageNo);
    setRenderList(paginatedList);

    // Scroll back to the top of the event list
    if (targetDivRef.current) {
      targetDivRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };
  useEffect(() => {
    let filteredList = filterEvent(eventList, categoryList);

    if (appliedFilter.isCategoryApply) {
      filteredList = filterEvent(filteredList, [
        { category_id: Number(selectCategory.category_id) },
      ]);
    }

    if (appliedFilter.isSearchApply) {
      filteredList = filteredList.filter((evt) =>
        evt?.promoter_event?.events_name
          .toLowerCase()
          .includes(searchValue.toLowerCase())
      );
    }

    if (appliedFilter.isDateRangeApply && dateFilter.length === 2) {
      const [startDate, endDate] = dateFilter.map((date) =>
        new DateObject(date).format()
      );
      if (isDate1BeforeDate2(startDate, endDate)) {
        filteredList = filterObjectsByDateRangeMyEvents(
          startDate,
          endDate,
          filteredList,
          "promoter_event"
        );
      }
    }

    if (locationFilter.length > 0) {
      filteredList = filteredList.filter((obj) => {
        const locationParts = obj?.promoter_event?.location?.split(", ") || [];
        return locationParts.some((part) =>
          locationFilter.some((name) => part.includes(name))
        );
      });
    }

    if (appliedFilter.isMilesAppy) {
      filteredList = filterByEventDistance(
        filteredList,
        silderValue.from,
        silderValue.to
      );
    }

    // Reset pagination and handle the first page by default
    setTempEventList(filteredList);
    const paginatedList = filteredList.slice(0, 9);
    setRenderList(paginatedList);
    setPageNo(1);
  }, [appliedFilter, locationFilter, dateFilter, searchValue]);
  const handleSearchValue = (e) => {
    if (e.target.value) {
      setSearchValue(e.target.value);
    } else {
      setSearchValue(e.target.value);
      setAppliedFilter((pre) => ({ ...pre, isSearchApply: false }));
    }
  };
  const targetDivRef = useRef < HTMLDivElement > null;
  const handleEventSearch = (e) => {
    e.preventDefault();

    if (searchValue) {
      setAppliedFilter((pre) => ({ ...pre, isSearchApply: true }));
    } else {
      setAppliedFilter((pre) => ({ ...pre, isSearchApply: false }));
    }
    if (targetDivRef.current) {
      targetDivRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
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
  const MAX_WORDS = 20; // Define the word limit

  const truncateDescription = (description, wordLimit) => {
    const words = description.split(" ");
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(" ") + "..."; // Truncate and add ellipsis
    }
    return description; // If under the limit, return the full description
  };
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
          <form onSubmit={handleEventSearch}>
            <label className="interests-search">
              <input
                type="text"
                placeholder="Search for Events"
                value={searchValue}
                onChange={handleSearchValue}
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
              <div className="dropdown date-range">
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
                  {categoryList.map((item) => (
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
              </div>
              <div className="calendar">
                <div className="broker-date">
                  <CustomDatePicker
                    date={dateFilter}
                    onChange={handleDateFilter}
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
                  handleSliderValues={handleSlider}
                />
              </div>
            </div>
          </div>

          {Array.isArray(renderList) &&
            renderList.length > 0 &&
            renderList.map((item, index) => {
              return <CardItem key={`${item?.id + index}`} item={item} />;
            })}
          {/* {Array.isArray(renderList) && renderList?.length === 0 && (
            <div className="row">
              <p className="noDataText">No Events</p>
            </div>
          )} */}

          {Array.isArray(renderList) && renderList?.length === 0 ? (
            <div className="row">
              <p className="noDataText">No Events</p>
            </div>
          ) : null}
          <CustomPagination
            dataArray={tempEventList} // Array with all the filtered events
            pageNo={pageNo} // Current page number
            clickPageNumber={handlePageNumber} // Function to handle page change
            pageLimit={9} // Number of events per page
          />
        </div>
      </div>
    </div>
  );
};

export default ClientComponent;

const CardItem = ({ item }) => {
  console.log(item, "hello world");
  const router = useRouter();
  const handleMore = useCallback(
    (e) => {
      e.preventDefault();
      // router.push(
      //   `/my/events/${item?.promoter_event_id}?event_uinqu=${item?.promoter_event?.promoter_id}`
      // );
      router.push(
        `/my/events/${item?.checked_id}?event_uinqu=${item?.match_number}`
      );
    },
    [item]
  );
  return (
    <div className="col-lg-4">
      <div className="event-brand-box w-100">
        <div className="brand-logo">
          <span>
            {" "}
            {Number(item?.events_price) === 0
              ? "Free"
              : "$" + Number(item?.events_price)}
          </span>
          <span>{item?.eventsimage?.image_name}</span>
          <Image
            width={290}
            height={226}
            alt=""
            style={{ objectFit: "cover" }}
            src={
              item?.eventsimage?.[0]?.image_name
                ? `${BASE_URL}/${item?.eventsimage?.[0]?.image_name}`
                : "/images/near-event1.png"
            }
            onError={(e) => {
              e.target.src = "/images/near-event.png";
            }}
          />
        </div>
        <div className="event-pad">
          <h6> {item?.events_name}</h6>
          <p className="truncate-text">{item?.events_description}</p>
          <div className="point-icon" style={{ height: "40%" }}>
            <div style={{ width: "80%" }}>
              <Image
                width={20}
                height={20}
                src="/images/location-dot.png"
                alt=""
              />{" "}
              {item?.event_away_distance} miles away
            </div>
            <div>
              <Image width={20} height={20} src="/images/calendar.png" alt="" />{" "}
              {DateTime.fromFormat(item?.events_date, "yyyy-MM-dd").toFormat(
                "MMMM dd, yyyy"
              )}
            </div>
            <span>
              <Image width={20} height={20} src="/images/watch.png" alt="" />{" "}
              {convertTo12HourFormat(item?.events_start_time)} to{" "}
              {convertTo12HourFormat(item?.events_end_time)}
            </span>
          </div>

          {Number(item?.events_price) !== 0 && (
            <Link
              className="btn btn-viewmore-border"
              role="button"
              href={"#"}
              onClick={handleMore}
            >
              View More
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
