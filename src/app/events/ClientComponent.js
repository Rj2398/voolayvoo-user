"use client";
// "use server";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import DatePicker, { DateObject } from "react-multi-date-picker";
import {
  convertTo12HourFormat,
  filterEvent,
  calculateDistanceInMiles,
  filterObjectsByDateRange,
  isDate1BeforeDate2,
  filterByEventDistance,
  getCurrentLocation,
  truncateDescriptionByWords,
} from "@/utils/eventFunction";
import { DateTime } from "luxon";
import { BASE_URL } from "@/constant/constant";
import CustomPagination from "@/components/CustomPagination";
import Slider from "@/components/Slider";
import CustomDatePicker from "@/components/CustomDatePicker";
import LocationDropdown from "@/components/LocationDropdown";

const ClientComponent = ({ categoryList, eventList }) => {
  const [location, setLocation] = useState(false);
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

  const targetDivRef = useRef(null);

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
        evt?.events_name.toLowerCase()?.includes(searchValue.toLowerCase())
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
        tempList = filterObjectsByDateRange(
          date.format(),
          date1.format(),
          tempList
        );
        setTempEventList(tempList);
      }
    } else if (!appliedFilter.isDateRangeApply) {
      tempList = filterEvent(tempList, categoryList);
    }
    if (locationFilter.length > 0) {
      let newEvent = tempList.filter((obj) => {
        const locationParts = obj?.location?.split(", ") || [];

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
    let newEventList = [];
    for (let i = 0; i < tempEventList.length; i += 9) {
      newEventList.push(tempEventList.slice(i, i + 9));
    }
    if (targetDivRef.current) {
      targetDivRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    setPageNo(pageNo);
    setRenderList(newEventList[pageNo - 1]);
  };

  const handleSearchValue = (e) => {
    if (e.target.value) {
      setSearchValue(e.target.value);
    } else {
      setSearchValue(e.target.value);
      setAppliedFilter((pre) => ({ ...pre, isSearchApply: false }));
    }
  };
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

  return (
    <>
      <div
        className="inner-banner"
        style={{
          backgroundImage: "url(/images/about-bnr.png)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <h1> Explore Events </h1>
        <p>Find Your A-ha!</p>
      </div>
      <div className="container">
        <div className="row justify-content-center p-3">
          <div className="col-lg-6">
            <form
              className="d-flex new-srchbox mb-3"
              onSubmit={handleEventSearch}
            >
              <input
                className="new-srch"
                type="search"
                value={searchValue}
                onChange={handleSearchValue}
                placeholder="Search for Events"
                aria-label="Search"
              />
              <button className="srch-btn" type="submit">
                <Image width={15} height={16} src="/images/search.png" alt="" />
              </button>
            </form>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-3 col-md-5">
            <div className="event-cat">
              <h5>Event Categories</h5>
              <ul>
                {categoryList?.map((item) => (
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
          </div>
          <div className="col-lg-9 col-md-7">
            <div className="row" ref={targetDivRef}>
              <div className="col-lg-12 mb-3">
                <div className="show-cal-loc-range">
                  <div className="calendar">
                    <div className="broker-date">
                      <CustomDatePicker
                        date={dateFilter}
                        onChange={handleDateFilter}
                      />
                    </div>
                  </div>
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
                </div>
              </div>

              {Array.isArray(renderList) &&
                renderList.length > 0 &&
                renderList.map((item, index) => {
                  { console.log(renderList, 'rr') }
                  return (
                    <div key={index} className="col-lg-4" style={{ display: "flex", flexDirection: "column" }}>
                      <div className="event-brand-box" style={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column"

                      }}>
                        <div className="brand-logo">
                          <Image
                            width={285}
                            height={223}
                            style={{ objectFit: "cover" }}
                            src={
                              item?.eventimage?.image_name
                                ? `${BASE_URL}/${item?.eventimage?.image_name}`
                                : "/images/near-event2.png"
                            }
                            alt=""
                            onError={(e) => {
                              // Handle error by setting a default image
                              console.error("Image failed to load:", e);
                              // e.target.src = "/images/near-event2.png"; // Replace with the path to your default image
                            }}
                          />
                          <div className="event-price-free">
                            {" "}
                            {Number(item.events_price) === 0
                              ? "Free"
                              : "$" + Number(item.events_price)}{" "}
                          </div>
                        </div>
                        <div class="event-pad">
                          <h6>
                            {" "}
                            {truncateDescriptionByWords(item.events_name, 20)}
                          </h6>
                          <p style={{}}>
                            {" "}
                            {truncateDescriptionByWords(
                              item.events_description,
                              50
                            )}
                          </p>
                          <div class="point-icon">
                            <span>
                              {" "}
                              <Image
                                width={20}
                                height={20}
                                src="/images/location-dot.png"
                                alt=""
                              />{" "}
                              {/* {item.event_away_distance} miles away */}
                              {!isNaN(item.event_away_distance) && item.event_away_distance !== null ? `${item.event_away_distance} miles away` : 'No location available'}
                            </span>
                            <span>
                              <Image
                                width={20}
                                height={20}
                                src="/images/calendar.png"
                                alt=""
                              />{" "}
                              {DateTime.fromFormat(
                                item.events_date,
                                "yyyy-MM-dd"
                              ).toFormat("MMMM dd, yyyy")}{" "}
                            </span>
                            <span>
                              {" "}
                              <Image
                                width={20}
                                height={20}
                                src="/images/watch.png"
                                alt=""
                              />{" "}
                              {convertTo12HourFormat(item.events_start_time)} to{" "}
                              {convertTo12HourFormat(item.events_end_time)}{" "}
                            </span>
                          </div>
                          <Link
                            className="btn btn-viewmore-border btn-align"
                            // href={`/events/${item.id}?promoter_id=${item.promoter_id}`}
                            href={`/events/${item.checked_id}?promoter_id=${item.promoter_id}`}
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
                  <p className="noDataText">No Events </p>
                </div>
              )}
              <CustomPagination
                dataArray={tempEventList}
                pageNo={pageNo}
                clickPageNumber={handlePageNumber}
                pageLimit={9}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientComponent;
