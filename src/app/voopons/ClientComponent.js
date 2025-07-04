"use client";
// "use server";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { DateObject } from "react-multi-date-picker";
import {
  filterEvent,
  calculateDistanceInMiles,
  isDate1BeforeDate2,
  getCurrentLocation,
} from "@/utils/eventFunction";
import { DateTime } from "luxon";
import { BASE_URL } from "@/constant/constant";
import CustomPagination from "@/components/CustomPagination";
import Slider from "@/components/Slider";
import AutoCompleteGoogle from "@/components/AutoCompleteGoogle";
import {
  checkExpirationStatus,
  filterByVoopanDistance,
  filterVoopansByDateRange,
} from "@/utils/voopanFunction";
import CustomDatePicker from "@/components/CustomDatePicker";

const ClientComponent = ({ categoryList, voopanList }) => {

  const [location, setLocation] = useState(false);
  const [tempVoopanList, setTempVoopanList] = useState([]);
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


  const handleSelectLocation = (e) => {
    setLocationFilter(e);
  };

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const position = await getCurrentLocation();

        if (categoryList && voopanList && position) {
          for (let indx in voopanList) {
            const targetLocation = {
              latitude: voopanList[indx]["latitude"],
              longitude: voopanList[indx]["longitude"],
            };
            voopanList[indx]["voopan_away_distance"] = calculateDistanceInMiles(
              position,
              targetLocation
            );
          }
          const tempEvtList = filterEvent(voopanList, categoryList);

          setTempVoopanList(tempEvtList);
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
  }, [categoryList, voopanList]);
  useEffect(() => {
    let tempList = filterEvent(voopanList, categoryList);

    if (appliedFilter.isCategoryApply) {
      tempList = filterEvent(tempList, [
        { category_id: Number(selectCategory.category_id) },
      ]);
    } else if (!appliedFilter.isCategoryApply) {
      tempList = filterEvent(tempList, categoryList);
    }
    if (appliedFilter.isSearchApply) {
      let newVoopons = tempList.filter((evt) =>
        evt?.voopons_name.toLowerCase()?.includes(searchValue.toLowerCase())
      );
      setTempVoopanList(newVoopons);
      tempList = newVoopons;
    } else if (!appliedFilter.isSearchApply) {
      tempList = filterEvent(tempList, categoryList);
    }
    if (appliedFilter.isDateRangeApply) {
      const date = new DateObject(dateFilter[0]);
      const date1 = new DateObject(dateFilter[1]);
      if (isDate1BeforeDate2(date.format(), date1.format())) {
        tempList = filterVoopansByDateRange(
          date.format(),
          date1.format(),
          tempList
        );
        setTempVoopanList(tempList);
      }
    } else if (!appliedFilter.isDateRangeApply) {
      tempList = filterEvent(tempList, categoryList);
    }
    if (locationFilter.length > 0) {
      let newVoopons = tempList.filter((obj) => {
        const locationParts = obj?.location?.split(", ") || [];

        return locationParts.some((part) =>
          locationFilter.some((name) => part.includes(name))
        );
      });

      setTempVoopanList(newVoopons);
      tempList = newVoopons;
    } else if (locationFilter.length === 0) {
      tempList = tempList;
    }
    if (appliedFilter.isMilesAppy) {
      tempList = filterByVoopanDistance(
        tempList,
        silderValue.from,
        silderValue.to
      );
      setTempVoopanList(tempList);
    } else if (!appliedFilter.isMilesAppy) {
      tempList = filterEvent(tempList, categoryList);
    }
    if (tempList.length > 9 && appliedFilter.isPaginationApply) {
      setTempVoopanList(tempList);
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
    let newvoopanList = [];
    for (let i = 0; i < tempVoopanList.length; i += 9) {
      newvoopanList.push(tempVoopanList.slice(i, i + 9));
    }
    if (targetDivRef.current) {
      targetDivRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    setPageNo(pageNo);
    setRenderList(newvoopanList[pageNo - 1]);
  };
  const handleSearchValue = (e) => {
    if (e.target.value) {
      setSearchValue(e.target.value);
    } else {
      setSearchValue(e.target.value);
      setAppliedFilter((pre) => ({ ...pre, isSearchApply: false }));
    }
  };
  const handleVoopanSearch = (e) => {
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
  const MAX_WORDS = 4;
  const truncateDescription = (description, wordLimit) => {
    const words = description.split(" ");
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(" ") + "..."; // Truncate and add ellipsis
    }
    return description; // If under the limit, return the full description
  };
  const box = {
    height: "420Px",
  };
  return (
    <>
      <div className="container">
        <div className="row justify-content-center p-3">
          <div className="col-lg-6">
            <form
              className="d-flex new-srchbox mb-3"
              onSubmit={handleVoopanSearch}
            >
              <input
                className="new-srch"
                type="search"
                placeholder="Search for Voopons"
                aria-label="Search"
                value={searchValue}
                onChange={handleSearchValue}
              />
              <button className="srch-btn" type="submit">
                <Image width={15} height={16} src="/images/search.png" alt="" />
              </button>
            </form>
          </div>
        </div>
        <div className="row">
          {/* <div className="col-lg-3 col-md-6">
            <div className="event-cat">
              <h5>Event Categories</h5>
              <ul>
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
            </div>
          </div> */}
          <div className="col-lg-12 col-md-12">
            <div className="row" ref={targetDivRef}>
              <div className="col-lg-12 mb-3">
                <div className="show-cal-loc-range">
                  <div className="calendar">
                    <div
                      className="broker-date"
                      onClick={() => setLocation(false)}
                    >
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
                      // href="#"
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
                      onClick={() => setLocation(false)}
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
                  return (
                    <div key={item.id} className="col-lg-4">
                      <div className="voopan-box" style={box}>
                        {checkExpirationStatus(item?.voopons_valid_thru) && (
                          <span className="expiring-soon">Expiring soon</span>
                        )}
                        <div className="voopon-logo">
                          <Image
                            width={125}
                            height={125}
                            src={
                              item?.vooponimage?.image_name
                                ? `${BASE_URL}${item?.vooponimage?.image_name}`
                                : "/images/voopons-logo-1.png"
                            }
                            alt=""
                          />
                        </div>
                        <div style={{ height: "50%" }}>
                          <div className="voopon-heading">
                            {truncateDescription(item?.voopons_name, 2)}
                          </div>
                          <h5>
                            {truncateDescription(
                              item?.voopons_description,
                              MAX_WORDS
                            )}
                          </h5>
                          <p>
                            Valid Thru:{" "}
                            {DateTime.fromFormat(
                              item?.voopons_valid_thru,
                              "yyyy-MM-dd"
                            ).toFormat("MMMM dd, yyyy")}
                          </p>
                        </div>
                        <Link
                          className="btn btn-viewmore"
                          // href={`/voopons/${item.id}?promoter_id=${item.promoter_id}`}
                          href={`/voopons/${item.unique_number}`}
                          role="button"
                        >
                          View More
                        </Link>
                      </div>
                    </div>
                  );
                })}
              {Array.isArray(renderList) && renderList.length === 0 && (
                <div className="row">
                  <p className="noDataText">No Voopons </p>
                </div>
              )}
              <CustomPagination
                dataArray={tempVoopanList}
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
