"use client";
// "use server";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import LinkIcon from "@mui/icons-material/Link";
import Image from "next/image";
import DatePicker, { DateObject } from "react-multi-date-picker";
import LanguageIcon from "@mui/icons-material/Language";
import VisibilityIcon from "@mui/icons-material/Visibility";

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
import VooponModal from "@/components/VooponModal";

//
// const dummyVoopons = [
//   {
//     id: 1,
//     voopons_name: "Summer Sale 2026",
//     voopons_description:
//       "Get 20% off on all summer collections including footwear and accessories.",
//     voopon_code: "SUMMER20",
//     voopons_date: "2026-06-01",
//     voopons_valid_thru: "2026-08-31",
//     event_link: "https://example.com/summer",
//     vooponimage: { image_name: "" }, // Will fallback to your default image
//   },
//   {
//     id: 2,
//     voopons_name: "Tech Hub Discount",
//     voopons_description:
//       "Exclusive deal for developers! $50 off on M3 MacBook stands and ergonomic chairs.",
//     voopon_code: "DEV50",
//     voopons_date: "2026-04-10",
//     voopons_valid_thru: "2026-05-15",
//     event_link: "https://example.com/tech",
//     vooponimage: { image_name: "" },
//   },
//   {
//     id: 3,
//     voopons_name: "Organic Groceries",
//     voopons_description:
//       "Fresh farm-to-table vegetables delivered to your door with zero delivery fees.",
//     voopon_code: "FRESHGREEN",
//     voopons_date: "2026-04-12",
//     voopons_valid_thru: "2026-04-30",
//     event_link: "https://example.com/organic",
//     vooponimage: { image_name: "" },
//   },
//   {
//     id: 4,
//     voopons_name: "Fitness First Pass",
//     voopons_description:
//       "Join our fitness community with a 7-day free trial and a personal trainer session.",
//     voopon_code: "FIT7DAY",
//     voopons_date: "2026-05-01",
//     voopons_valid_thru: "2026-05-07",
//     event_link: "https://example.com/fitness",
//     vooponimage: { image_name: "" },
//   },
//   {
//     id: 5,
//     voopons_name: "Coffee Lovers Club",
//     voopons_description:
//       "Buy one large latte and get a donut free. Valid at all downtown locations.",
//     voopon_code: "COFFEEBOGO",
//     voopons_date: "2026-04-01",
//     voopons_valid_thru: "2026-06-01",
//     event_link: "https://example.com/coffee",
//     vooponimage: { image_name: "" },
//   },
//   {
//     id: 6,
//     voopons_name: "Movie Night Special",
//     voopons_description:
//       "50% off on popcorn and drinks with any IMAX ticket purchase this weekend.",
//     voopon_code: "POPCORN50",
//     voopons_date: "2026-04-18",
//     voopons_valid_thru: "2026-04-20",
//     event_link: "https://example.com/movies",
//     vooponimage: { image_name: "" },
//   },
// ];

//
const ClientComponent = ({ categoryList, eventList }) => {
  const [location, setLocation] = useState(false);
  const [tempEventList, setTempEventList] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [activeData, setActiveData] = useState(null);
  const [selectCategory, setSelectCategory] = useState({
    category_id: "All",
  });
  const [open, setOpen] = useState(false);

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

  //

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  let pageUrl = "";
  let pageTitle;
  if (typeof window !== "undefined") {
    pageUrl = window.location.href;
    pageTitle = document?.title;
  }

  const facebookShareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    pageUrl
  )}`;
  const twitterShareLink = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
    pageUrl
  )}&text=${encodeURIComponent(pageTitle)}`;
  const instagramShareLink = `https://www.instagram.com/share?url=${encodeURIComponent(
    pageUrl
  )}`;
  const snapchatShareLink = `https://www.snapchat.com/add/your-snapcode`; // Replace with your Snapcode link
  const linkedinShareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    pageUrl
  )}`;
  const whatsappShareLink = `https://wa.me/?text=${encodeURIComponent(
    `${pageTitle} - ${pageUrl}`
  )}`;

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
        <div className="back-btn" style={{ cursor: "pointer", width: "100%" }}>
          <a
            to="#"
            onClick={(e) => {
              e.preventDefault();
              window.history.back();
            }}
          >
            <img src="./images/left-arrow.svg" alt="Back" />
          </a>
        </div>
        <h1> Explore Events</h1>
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
                  // { console.log(renderList, 'rr') }
                  return (
                    <div
                      key={index}
                      className="col-lg-4"
                      style={{ display: "flex", flexDirection: "column" }}
                    >
                      <div
                        className="event-brand-box"
                        style={{
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
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
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <div>
                              <h6
                                className="title-capitilize"
                                style={{ margin: 0 }}
                              >
                                {truncateDescriptionByWords(
                                  item.events_name,
                                  20
                                )}
                              </h6>
                            </div>
                            {/* <VisibilityIcon
                              onClick={() => {
                                // Set the data first

                                setActiveData(item);
                                setOpen(true);
                              }}
                              sx={{
                                cursor: "pointer",
                                backgroundColor: "#fff",
                                borderRadius: "4px",
                                fontSize: "26px",
                                padding: "4px",
                              }}
                            /> */}
                            <div
                              style={{
                                display: "flex",
                                gap: "5px",
                                alignItems: "center",
                              }}
                            >
                              <img
                                // className="earth-size"
                                src="/images/new-event-eyeicon.png"
                                alt="view event"
                                onClick={() => {
                                  setActiveData(item);
                                  setOpen(true);
                                }}
                                style={{
                                  cursor: "pointer",
                                  backgroundColor: "#f8f9fa",
                                  borderRadius: "4px",
                                  padding: "4px",
                                  objectFit: "contain",
                                  height: "33px",
                                  width: "33px",
                                }}
                              />

                              <img
                                className="earth-size"
                                src="/images/earth.png"
                                onClick={() => {
                                  const url = item?.event_link;
                                  if (url) {
                                    const validUrl = url.startsWith("http")
                                      ? url
                                      : `https://${url}`;
                                    window.open(
                                      validUrl,
                                      "_blank",
                                      "noopener,noreferrer"
                                    );
                                  }
                                }}
                              />

                              {/* <LanguageIcon
                                  onClick={() => {
                                    const url = item?.event_link;
                                    if (url) {
                                      const validUrl = url.startsWith("http")
                                        ? url
                                        : `https://${url}`;
                                      window.open(
                                        validUrl,
                                        "_blank",
                                        "noopener,noreferrer"
                                      );
                                    }
                                  }}
                                  sx={{
                                    cursor: "pointer",
                                    backgroundColor: "#fff",
                                    borderRadius: "4px",
                                    fontSize: "24px",
                                    padding: "4px",
                                  }}
                                /> */}

                              {/* share btn */}
                              <div className="col-lg-4 col-md-6">
                                <div className="share-media">
                                  <span>
                                    {" "}
                                    <Image
                                      width={24}
                                      height={24}
                                      src="/images/share.svg"
                                      alt=""
                                    />{" "}
                                    {/* Share with friends{" "} */}
                                  </span>
                                  <div className="show-social">
                                    <span>
                                      <Link
                                        href={twitterShareLink}
                                        passHref
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        <Image
                                          width={24}
                                          height={24}
                                          src="/images/social-icon-1.svg"
                                          alt="images"
                                        />
                                      </Link>
                                    </span>
                                    <span>
                                      <Link
                                        href={whatsappShareLink}
                                        passHref
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        <Image
                                          width={24}
                                          height={24}
                                          src="/images/social-icon-2.svg"
                                          alt="images"
                                        />
                                      </Link>
                                    </span>
                                    <span>
                                      <Link
                                        href={instagramShareLink}
                                        passHref
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        <Image
                                          width={24}
                                          height={24}
                                          src="/images/social-icon-3.svg"
                                          alt="images"
                                        />
                                      </Link>
                                    </span>
                                    <span>
                                      <Link
                                        href={facebookShareLink}
                                        passHref
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        <Image
                                          width={24}
                                          height={24}
                                          src="/images/social-icon-4.svg"
                                          alt="images"
                                        />
                                      </Link>
                                    </span>
                                    <span>
                                      <Link
                                        href={snapchatShareLink}
                                        passHref
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        <Image
                                          width={24}
                                          height={24}
                                          src="/images/social-icon-5.svg"
                                          alt="images"
                                        />
                                      </Link>
                                    </span>
                                    <span>
                                      <Link
                                        href={linkedinShareLink}
                                        passHref
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        <Image
                                          width={24}
                                          height={24}
                                          src="/images/social-icon-6.svg"
                                          alt="images"
                                        />
                                      </Link>
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <p style={{}}>
                            {" "}
                            {truncateDescriptionByWords(
                              item.events_description,
                              50
                            )}
                          </p>

                          <span style={{ marginLeft: "29px" }}>
                            {/* <Image
                                width={20}
                                height={20}
                                src="/images/calendar.png"
                                alt=""
                              />{" "} */}
                            Code:{" "}
                            {item?.event_code || "No event code available"}
                            {/* <br /> */}
                          </span>

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
                              {!isNaN(item.event_away_distance) &&
                              item.event_away_distance !== null
                                ? `${item.event_away_distance} miles away`
                                : "No location available"}
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

                            <span>
                              <Image
                                width={20}
                                height={20}
                                src="/images/calendar.png"
                                alt=""
                              />{" "}
                              Start Date:{" "}
                              {DateTime?.fromFormat(
                                item.events_date,
                                "yyyy-MM-dd"
                              ).toFormat("MMMM dd, yyyy")}
                            </span>
                            <br />
                            <span>
                              <Image
                                width={20}
                                height={20}
                                src="/images/calendar.png"
                                alt=""
                              />{" "}
                              End Date:{" "}
                              {DateTime?.fromFormat(
                                item.events_end_date,
                                "yyyy-MM-dd"
                              ).toFormat("MMMM dd, yyyy")}
                            </span>

                            {/* <Image
                                width={20}
                                height={20}
                                src="/images/calendar.png"
                                alt=""
                              />{" "} */}
                            {/* <span style={{ marginLeft: "29px" }}>
                              Code:{" "}
                              {item?.event_code || "No event code available"}
                              <br />
                            </span> */}

                            <div
                              style={{
                                display: "flex",
                                alignItems: "center", // Vertically centers the text with the image
                                gap: "15px", // Space between image and text
                                padding: "10px",
                              }}
                            >
                              {/* 1. Circular Image Container */}
                              <div
                                style={{
                                  width: "60px", // Size of the circle
                                  height: "60px",
                                  borderRadius: "50%",
                                  overflow: "hidden",
                                  position: "relative",
                                  border: "1px solid #ddd",
                                  flexShrink: 0, // Prevents the circle from squeezing
                                }}
                              >
                                <Image
                                  src={
                                    item?.business_details?.profile_image
                                      ? `${BASE_URL}${item.business_details.profile_image}`
                                      : `${BASE_URL}${item?.promoter_details?.profile_image}`
                                    // : "/images/placeholder-user.png"
                                  }
                                  alt="Promoter"
                                  fill
                                  style={{ objectFit: "cover" }}
                                />
                              </div>

                              {/* 2. Promoter Text on the Right */}
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                }}
                              >
                                {/* <span
                                  style={{
                                    fontSize: "14px",
                                    color: "#888",
                                    fontWeight: "500",
                                    lineHeight: "1",
                                  }}
                                >
                                  {item?.business_details ? "Business" : "Promoter"}
                                </span> */}
                                <span
                                  style={{
                                    fontSize: "18px",
                                    fontWeight: "700",
                                    color: "#000",
                                    marginTop: "4px",
                                  }}
                                >
                                  {item?.business_details
                                    ? item?.business_details?.name
                                    : item?.promoter_details?.name}
                                </span>
                              </div>
                            </div>
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
      <VooponModal
        open={open}
        handleClose={() => setOpen(false)}
        allItems={[]}
        BASE_URL={BASE_URL}
        activeData={activeData}
      />
    </>
  );
};

export default ClientComponent;
