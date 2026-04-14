"use client";
import LanguageIcon from "@mui/icons-material/Language";
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
  const [selectCategory, setSelectCategory] = useState({ category_id: "All" });
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

  // ... (Keep your existing useEffects for location and filtering here) ...
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const position = await getCurrentLocation();
        if (categoryList && voopanList && position) {
          const updatedList = voopanList.map((item) => ({
            ...item,
            voopan_away_distance: calculateDistanceInMiles(position, {
              latitude: item.latitude,
              longitude: item.longitude,
            }),
          }));
          const tempEvtList = filterEvent(updatedList, categoryList);
          setTempVoopanList(tempEvtList);
          if (tempEvtList.length > 9) {
            setAppliedFilter((pre) => ({ ...pre, isPaginationApply: true }));
          } else {
            setRenderList(tempEvtList);
          }
        }
      } catch (error) {
        console.error(error);
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
    }
    if (appliedFilter.isSearchApply) {
      tempList = tempList.filter((evt) =>
        evt?.voopons_name.toLowerCase()?.includes(searchValue.toLowerCase())
      );
    }
    // ... rest of your filter logic ...
    setRenderList(tempList.slice((pageNo - 1) * 9, pageNo * 9));
  }, [appliedFilter, locationFilter, pageNo]);

  const truncateDescription = (description, wordLimit) => {
    if (!description) return "";
    const words = description.split(" ");
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + "..."
      : description;
  };

  const handlePageNumber = (p) => {
    setPageNo(p);
    if (targetDivRef.current)
      targetDivRef.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="container">
      {/* Search Section */}
      <div className="row justify-content-center p-3">
        <div className="col-lg-6">
          <form
            className="d-flex new-srchbox mb-3"
            onSubmit={(e) => {
              e.preventDefault();
              setAppliedFilter((p) => ({ ...p, isSearchApply: !!searchValue }));
            }}
          >
            <input
              className="new-srch"
              type="search"
              placeholder="Search for Voopons"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <button className="srch-btn" type="submit">
              <Image width={15} height={16} src="/images/search.png" alt="" />
            </button>
          </form>
        </div>
      </div>

      <div className="row" ref={targetDivRef}>
        {renderList.map((item) => {
          // LOGIC: Determine if Business or Promoter
          const isBusiness = !!item?.business_id;
          const creator = isBusiness
            ? item?.business_details
            : item?.promoter_details;
          const userType = isBusiness ? "Business" : "Promoter";

          return (
            <div key={item.id} className="col-lg-4 col-md-6 mb-4">
              <div
                className="voopan-box"
                style={{
                  height: "100%",
                  padding: "25px",
                  borderRadius: "20px",
                  border: "1px solid #eee",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  backgroundColor: "#fff",
                  position: "relative",
                }}
              >
                {checkExpirationStatus(item?.voopons_valid_thru) && (
                  <span className="expiring-soon">Expiring soon</span>
                )}

                {/* 1. Teal Logo Circle */}
                <div
                  style={{
                    width: "110px",
                    height: "110px",
                    borderRadius: "50%",
                    backgroundColor: "#8EDADB",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: "15px",
                  }}
                >
                  <Image
                    width={80}
                    height={80}
                    src={
                      item?.vooponimage?.image_name
                        ? `${BASE_URL}${item.vooponimage.image_name}`
                        : "/images/voopons-logo-1.png"
                    }
                    alt="Logo"
                    style={{ objectFit: "contain" }}
                  />
                </div>

                {/* 2. Red Title */}
                <h4
                  style={{
                    color: "#FF0015",
                    fontWeight: "900",
                    fontSize: "22px",
                    marginBottom: "8px",
                  }}
                >
                  {truncateDescription(item?.voopons_name, 3)}
                </h4>

                {/* 3. Description & World Icon */}
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    marginBottom: "15px",
                  }}
                >
                  <h5
                    style={{
                      fontWeight: "700",
                      fontSize: "18px",
                      margin: "0 25px",
                      color: "#222",
                    }}
                  >
                    {truncateDescription(item?.voopons_description, 4)}
                  </h5>
                  <LanguageIcon
                    onClick={() => {
                      if (item?.event_link)
                        window.open(
                          item.event_link.startsWith("http")
                            ? item.event_link
                            : `https://${item.event_link}`,
                          "_blank"
                        );
                    }}
                    sx={{
                      position: "absolute",
                      right: 0,
                      top: 0,
                      cursor: "pointer",
                      backgroundColor: "#f3f4f6",
                      borderRadius: "4px",
                      fontSize: "22px",
                      padding: "2px",
                    }}
                  />
                </div>

                {/* 4. Dates & Code */}
                <div
                  style={{
                    textAlign: "left",
                    width: "fit-content",
                    fontSize: "14px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "4px",
                    }}
                  >
                    <Image
                      width={18}
                      height={18}
                      src="/images/calendar.png"
                      alt=""
                      style={{ marginRight: "8px" }}
                    />
                    <span>
                      <strong>Start Date:</strong>{" "}
                      {item?.voopons_date
                        ? DateTime.fromISO(item.voopons_date).toFormat(
                            "MMMM dd, yyyy"
                          )
                        : "N/A"}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "4px",
                    }}
                  >
                    <Image
                      width={18}
                      height={18}
                      src="/images/calendar.png"
                      alt=""
                      style={{ marginRight: "8px" }}
                    />
                    <span>
                      <strong>End Date:</strong>{" "}
                      {item?.voopons_valid_thru
                        ? DateTime.fromISO(item.voopons_valid_thru).toFormat(
                            "MMMM dd, yyyy"
                          )
                        : "N/A"}
                    </span>
                  </div>
                  <div
                    style={{
                      textAlign: "center",
                      marginTop: "8px",
                      fontWeight: "600",
                    }}
                  >
                    Code: {item?.voopon_code || "Not Available"}
                  </div>
                </div>

                {/* 5. Promoter Circle & Text (Horizontal) */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    margin: "20px 0",
                    width: "100%",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      overflow: "hidden",
                      position: "relative",
                      border: "1px solid #ddd",
                    }}
                  >
                    <Image
                      src={
                        creator?.profile_image
                          ? `${BASE_URL}${creator.profile_image}`
                          : "/images/placeholder-user.png"
                      }
                      alt=""
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div style={{ textAlign: "left" }}>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#888",
                        lineHeight: "1",
                      }}
                    >
                      {userType}
                    </div>
                    <div
                      style={{
                        fontSize: "15px",
                        fontWeight: "700",
                        color: "#000",
                      }}
                    >
                      {creator?.name || "Anonymous"}
                    </div>
                  </div>
                </div>

                {/* 6. View More Pill Button */}
                <Link
                  href={`/voopons/${item.unique_number}`}
                  style={{
                    backgroundColor: "#FF0015",
                    color: "#fff",
                    borderRadius: "50px",
                    padding: "10px 35px",
                    fontWeight: "bold",
                    textDecoration: "none",
                    marginTop: "auto",
                    width: "80%",
                  }}
                >
                  View More
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      <CustomPagination
        dataArray={tempVoopanList}
        pageNo={pageNo}
        clickPageNumber={handlePageNumber}
        pageLimit={9}
      />
    </div>
  );
};

export default ClientComponent;

// "use client";
// // "use server";
// import LanguageIcon from "@mui/icons-material/Language";

// import { useEffect, useRef, useState } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import LinkIcon from "@mui/icons-material/Link";
// import { DateObject } from "react-multi-date-picker";
// import {
//   filterEvent,
//   calculateDistanceInMiles,
//   isDate1BeforeDate2,
//   getCurrentLocation,
// } from "@/utils/eventFunction";
// import { DateTime } from "luxon";

// import { BASE_URL } from "@/constant/constant";
// import CustomPagination from "@/components/CustomPagination";
// import Slider from "@/components/Slider";
// import AutoCompleteGoogle from "@/components/AutoCompleteGoogle";
// import {
//   checkExpirationStatus,
//   filterByVoopanDistance,
//   filterVoopansByDateRange,
// } from "@/utils/voopanFunction";
// import CustomDatePicker from "@/components/CustomDatePicker";

// const ClientComponent = ({ categoryList, voopanList }) => {
//   const [location, setLocation] = useState(false);
//   const [tempVoopanList, setTempVoopanList] = useState([]);
//   const [pageNo, setPageNo] = useState(1);
//   const [selectCategory, setSelectCategory] = useState({
//     category_id: "All",
//   });
//   const [appliedFilter, setAppliedFilter] = useState({
//     isCategoryApply: false,
//     isSearchApply: false,
//     isDateRangeApply: false,
//     isLoacationApply: false,
//     isMilesAppy: false,
//     isPaginationApply: false,
//   });
//   const [renderList, setRenderList] = useState([]);

//   const [dateFilter, setDateFilter] = useState([]);
//   const [searchValue, setSearchValue] = useState("");
//   const [locationFilter, setLocationFilter] = useState([]);
//   const [silderValue, setSliderValue] = useState({ from: 0, to: 100 });

//   const targetDivRef = useRef(null);

//   const handleSelectLocation = (e) => {
//     setLocationFilter(e);
//   };

//   useEffect(() => {
//     const fetchLocation = async () => {
//       try {
//         const position = await getCurrentLocation();

//         if (categoryList && voopanList && position) {
//           for (let indx in voopanList) {
//             const targetLocation = {
//               latitude: voopanList[indx]["latitude"],
//               longitude: voopanList[indx]["longitude"],
//             };
//             voopanList[indx]["voopan_away_distance"] = calculateDistanceInMiles(
//               position,
//               targetLocation
//             );
//           }
//           const tempEvtList = filterEvent(voopanList, categoryList);

//           setTempVoopanList(tempEvtList);
//           if (tempEvtList.length > 9) {
//             setAppliedFilter((pre) => ({ ...pre, isPaginationApply: true }));
//           } else {
//             setRenderList(tempEvtList);
//           }
//         }
//       } catch (error) {
//         console.error("Error getting current location:", error);
//       }
//     };

//     fetchLocation();
//   }, [categoryList, voopanList]);
//   useEffect(() => {
//     let tempList = filterEvent(voopanList, categoryList);

//     if (appliedFilter.isCategoryApply) {
//       tempList = filterEvent(tempList, [
//         { category_id: Number(selectCategory.category_id) },
//       ]);
//     } else if (!appliedFilter.isCategoryApply) {
//       tempList = filterEvent(tempList, categoryList);
//     }
//     if (appliedFilter.isSearchApply) {
//       let newVoopons = tempList.filter((evt) =>
//         evt?.voopons_name.toLowerCase()?.includes(searchValue.toLowerCase())
//       );
//       setTempVoopanList(newVoopons);
//       tempList = newVoopons;
//     } else if (!appliedFilter.isSearchApply) {
//       tempList = filterEvent(tempList, categoryList);
//     }
//     if (appliedFilter.isDateRangeApply) {
//       const date = new DateObject(dateFilter[0]);
//       const date1 = new DateObject(dateFilter[1]);
//       if (isDate1BeforeDate2(date.format(), date1.format())) {
//         tempList = filterVoopansByDateRange(
//           date.format(),
//           date1.format(),
//           tempList
//         );
//         setTempVoopanList(tempList);
//       }
//     } else if (!appliedFilter.isDateRangeApply) {
//       tempList = filterEvent(tempList, categoryList);
//     }
//     if (locationFilter.length > 0) {
//       let newVoopons = tempList.filter((obj) => {
//         const locationParts = obj?.location?.split(", ") || [];

//         return locationParts.some((part) =>
//           locationFilter.some((name) => part.includes(name))
//         );
//       });

//       setTempVoopanList(newVoopons);
//       tempList = newVoopons;
//     } else if (locationFilter.length === 0) {
//       tempList = tempList;
//     }
//     if (appliedFilter.isMilesAppy) {
//       tempList = filterByVoopanDistance(
//         tempList,
//         silderValue.from,
//         silderValue.to
//       );
//       setTempVoopanList(tempList);
//     } else if (!appliedFilter.isMilesAppy) {
//       tempList = filterEvent(tempList, categoryList);
//     }
//     if (tempList.length > 9 && appliedFilter.isPaginationApply) {
//       setTempVoopanList(tempList);
//       tempList = tempList.filter((item, indx) => indx < 9);
//     } else {
//       tempList = tempList;
//     }
//     setPageNo(1);
//     setRenderList(tempList);
//     // eslint-disable-next-line
//   }, [appliedFilter, locationFilter]);

//   const handleCategorySelect = (category) => {
//     const isCategoryEqual =
//       category.category_id.toString() === selectCategory.category_id;
//     if (!isCategoryEqual) {
//       setAppliedFilter((pre) => ({ ...pre, isCategoryApply: true }));
//       setSelectCategory({
//         category_id: category.category_id.toString(),
//       });
//     } else if (isCategoryEqual) {
//       setAppliedFilter((pre) => ({ ...pre, isCategoryApply: false }));
//       setSelectCategory({
//         category_id: "All",
//       });
//       if (targetDivRef.current) {
//         targetDivRef.current.scrollIntoView({
//           behavior: "smooth",
//           block: "start",
//         });
//       }
//     }
//   };
//   const handleDateFilter = (e) => {
//     const date = new DateObject(e[0]);
//     const date1 = new DateObject(e[1]);
//     setDateFilter(e);

//     if (isDate1BeforeDate2(date.format(), date1.format())) {
//       setAppliedFilter((pre) => ({ ...pre, isDateRangeApply: true }));
//     } else {
//       setAppliedFilter((pre) => ({ ...pre, isDateRangeApply: false }));
//     }
//     if (targetDivRef.current) {
//       targetDivRef.current.scrollIntoView({
//         behavior: "smooth",
//         block: "start",
//       });
//     }
//   };
//   const handlePageNumber = (pageNo) => {
//     let newvoopanList = [];
//     for (let i = 0; i < tempVoopanList.length; i += 9) {
//       newvoopanList.push(tempVoopanList.slice(i, i + 9));
//     }
//     if (targetDivRef.current) {
//       targetDivRef.current.scrollIntoView({
//         behavior: "smooth",
//         block: "start",
//       });
//     }
//     setPageNo(pageNo);
//     setRenderList(newvoopanList[pageNo - 1]);
//   };
//   const handleSearchValue = (e) => {
//     if (e.target.value) {
//       setSearchValue(e.target.value);
//     } else {
//       setSearchValue(e.target.value);
//       setAppliedFilter((pre) => ({ ...pre, isSearchApply: false }));
//     }
//   };
//   const handleVoopanSearch = (e) => {
//     e.preventDefault();

//     if (searchValue) {
//       setAppliedFilter((pre) => ({ ...pre, isSearchApply: true }));
//     } else {
//       setAppliedFilter((pre) => ({ ...pre, isSearchApply: false }));
//     }
//     if (targetDivRef.current) {
//       targetDivRef.current.scrollIntoView({
//         behavior: "smooth",
//         block: "start",
//       });
//     }
//   };
//   const handleSlider = (e) => {
//     setSliderValue({ from: e.fromValue, to: e.toValue });
//     if (e.fromValue === 0 && e.toValue === 100) {
//       setAppliedFilter((pre) => ({
//         ...pre,
//         isMilesAppy: false,
//       }));
//     } else {
//       setAppliedFilter((pre) => ({
//         ...pre,
//         isMilesAppy: true,
//       }));
//     }
//   };
//   const MAX_WORDS = 4;
//   const truncateDescription = (description, wordLimit) => {
//     const words = description.split(" ");
//     if (words.length > wordLimit) {
//       return words.slice(0, wordLimit).join(" ") + "..."; // Truncate and add ellipsis
//     }
//     return description; // If under the limit, return the full description
//   };
//   const box = {
//     height: "420Px",
//   };
//   return (
//     <>
//       <div className="container">
//         <div className="row justify-content-center p-3">
//           <div className="col-lg-6">
//             <form
//               className="d-flex new-srchbox mb-3"
//               onSubmit={handleVoopanSearch}
//             >
//               <input
//                 className="new-srch"
//                 type="search"
//                 placeholder="Search for Voopons"
//                 aria-label="Search"
//                 value={searchValue}
//                 onChange={handleSearchValue}
//               />
//               <button className="srch-btn" type="submit">
//                 <Image width={15} height={16} src="/images/search.png" alt="" />
//               </button>
//             </form>
//           </div>
//         </div>
//         <div className="row">

//           <div className="col-lg-12 col-md-12">
//             <div className="row" ref={targetDivRef}>
//               <div className="col-lg-12 mb-3">
//                 <div className="show-cal-loc-range">
//                   <div className="calendar">
//                     <div
//                       className="broker-date"
//                       onClick={() => setLocation(false)}
//                     >
//                       <CustomDatePicker
//                         date={dateFilter}
//                         onChange={handleDateFilter}
//                       />
//                     </div>
//                   </div>
//                   <div className="location-drop">
//                     <a
//                       onClick={() => setLocation(location ? false : true)}
//                       className="btn btn-location text-left"
//                       // href="#"
//                       role="button"
//                     >
//                       {" "}
//                       Location{" "}
//                     </a>
//                     <div
//                       className="location-drop-list"
//                       style={{ display: location ? "block" : "none" }}
//                     >
//                       <form>
//                         <AutoCompleteGoogle
//                           select={locationFilter}
//                           setSelect={handleSelectLocation}
//                         />
//                       </form>
//                     </div>
//                   </div>
//                   <div className="dropdown mile-rad-range date-range">
//                     <a
//                       className="btn btn-date-range text-left"
//                       type="button"
//                       id="date-range-drop"
//                       data-bs-toggle="dropdown"
//                       aria-expanded="false"
//                       onClick={() => setLocation(false)}
//                     >
//                       Select your Mile Radius{" "}
//                     </a>

//                     <Slider
//                       initialValueFrom={0}
//                       initialValueTo={100}
//                       handleSliderValues={handleSlider}
//                     />
//                   </div>
//                 </div>
//               </div>

//               {Array.isArray(renderList) &&
//                 renderList.length > 0 &&
//                 renderList.map((item, index) => {
//                   return (
//                     <div key={item.id} className="col-lg-4">
//                       <div className="voopan-box" style={box}>
//                         {checkExpirationStatus(item?.voopons_valid_thru) && (
//                           <span className="expiring-soon">Expiring soon</span>
//                         )}
//                         <div className="voopon-logo">
//                           <Image
//                             width={125}
//                             height={125}
//                             src={
//                               item?.vooponimage?.image_name
//                                 ? `${BASE_URL}${item?.vooponimage?.image_name}`
//                                 : "/images/voopons-logo-1.png"
//                             }
//                             alt=""
//                           />
//                         </div>
//                         <div style={{ height: "50%" }}>
//                           <div className="voopon-heading">
//                             {truncateDescription(item?.voopons_name, 2)}
//                           </div>

//                           <div
//                             style={{
//                               display: "flex",
//                               alignItems: "center",
//                             }}
//                           >
//                             <h5
//                               style={{
//                                 margin: 0,
//                                 fontSize: 22,

//                                 width: "100%", // Ensures it spans the whole row
//                                 display: "block", // Standard block behavior
//                               }}
//                             >
//                               {truncateDescription(
//                                 item?.voopons_description,
//                                 MAX_WORDS
//                               )}
//                             </h5>
//
//                             <LanguageIcon
//                               onClick={() => {
//                                 const url = item?.event_link;

//                                 if (url) {
//                                   const validUrl = url.startsWith("http")
//                                     ? url
//                                     : `https://${url}`;

//                                   window.open(
//                                     validUrl,
//                                     "_blank",
//                                     "noopener,noreferrer"
//                                   );
//                                 }
//                               }}
//                               sx={{
//                                 cursor: "pointer",
//                                 backgroundColor: "#f3f4f6",
//                                 borderRadius: "4px",
//                                 fontSize: "24px",
//                                 padding: "4px",
//                               }}
//                             />
//
//                           </div>

//                           <span>
//                             <Image
//                               width={20}
//                               height={20}
//                               src="/images/calendar.png"
//                               alt=""
//                             />{" "}
//                             Start Date:{" "}
//                             {DateTime.fromFormat(
//                               item?.voopons_date,
//                               "yyyy-MM-dd"
//                             ).toFormat("MMMM dd, yyyy")}
//                             <br />
//                             <Image
//                               width={20}
//                               height={20}
//                               src="/images/calendar.png"
//                               alt=""
//                             />{" "}
//                             End Date:{" "}
//                             {DateTime.fromFormat(
//                               item?.voopons_valid_thru,
//                               "yyyy-MM-dd"
//                             ).toFormat("MMMM dd, yyyy")}
//                           </span>

//                           <span>
//                             <p>Code: {item?.voopon_code}</p>
//                           </span>

//                           <div
//                             style={{
//                               display: "flex",
//                               alignItems: "center", // Vertically centers the text with the image
//                               gap: "15px", // Space between image and text
//                               padding: "10px",
//                             }}
//                           >
//                             {/* 1. Circular Image Container */}
//                             <div
//                               style={{
//                                 width: "60px", // Size of the circle
//                                 height: "60px",
//                                 borderRadius: "50%",
//                                 overflow: "hidden",
//                                 position: "relative",
//                                 border: "1px solid #ddd",
//                                 flexShrink: 0, // Prevents the circle from squeezing
//                               }}
//                             >
//                               <Image
//                                 src={
//                                   item?.business_details?.profile_image
//                                     ? `${BASE_URL}${item.business_details.profile_image}`
//                                     : "/images/placeholder-user.png"
//                                 }
//                                 alt="Promoter"
//                                 fill
//                                 style={{ objectFit: "cover" }}
//                               />
//                             </div>

//                             {/* 2. Promoter Text on the Right */}
//                             <div
//                               style={{
//                                 display: "flex",
//                                 flexDirection: "column",
//                               }}
//                             >
//                               <span
//                                 style={{
//                                   fontSize: "14px",
//                                   color: "#888",
//                                   fontWeight: "500",
//                                   lineHeight: "1",
//                                 }}
//                               >
//                                 {item?.business_id ? "Business" : "Promoter"}
//                               </span>
//                               <span
//                                 style={{
//                                   fontSize: "18px",
//                                   fontWeight: "700",
//                                   color: "#000",
//                                   marginTop: "4px",
//                                 }}
//                               >
//                                 {item?.business_details?.name}
//                                 {console.log(item, "tube time")}
//                               </span>
//                             </div>
//                           </div>
//                         </div>
//                         <Link
//                           className="btn btn-viewmore"
//                           // href={`/voopons/${item.id}?promoter_id=${item.promoter_id}`}
//                           href={`/voopons/${item.unique_number}`}
//                           role="button"
//                         >
//                           View More
//                         </Link>
//                       </div>
//                     </div>
//                   );
//                 })}
//               {Array.isArray(renderList) && renderList.length === 0 && (
//                 <div className="row">
//                   <p className="noDataText">No Voopons </p>
//                 </div>
//               )}
//               <CustomPagination
//                 dataArray={tempVoopanList}
//                 pageNo={pageNo}
//                 clickPageNumber={handlePageNumber}
//                 pageLimit={9}
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default ClientComponent;
