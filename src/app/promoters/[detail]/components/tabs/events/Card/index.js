"use client";
import { BASE_URL } from "@/constant/constant";
import { convertTo12HourFormat } from "@/utils/eventFunction";
import VisibilityIcon from "@mui/icons-material/Visibility";
import LanguageIcon from "@mui/icons-material/Language";
import { DateTime } from "luxon";
import VooponModal from "@/components/VooponModal";
import { useState } from "react";
import Image from "next/image";

const Card = ({ cardData }) => {
  const [open, setOpen] = useState(false);
  const [activeData, setActiveData] = useState(null);

  // LOGIC: Determine if Business or Promoter
  // We check the nested events_data or the top level business_id
  const isBusiness = !!(
    cardData?.business_details ||
    cardData?.events_data?.business_details ||
    cardData?.events_data_business?.business_details
  );

  const creator = isBusiness
    ? cardData?.business_details || cardData?.events_data?.business_details
    : cardData?.promoter_details || cardData?.events_data?.promoter_details;

  const userType = isBusiness ? "Business" : "Promoter";

  const checkedId =
    cardData?.events_data?.checked_id ||
    cardData?.events_data_business?.checked_id ||
    cardData?.checked_id;

  const imageSrc = cardData?.events_data?.eventimage?.image_name
    ? `${BASE_URL}/${cardData?.events_data?.eventimage?.image_name}`
    : cardData?.business_event_image?.image_name
      ? `${BASE_URL}/${cardData?.business_event_image?.image_name}`
      : "/images/near-event1.png";

  if (!cardData) return null;

  return (
    <>
      <div
        className="col-lg-3 col-md-6 mb-4"
        style={{ display: "flex", flexDirection: "column" }}
      >
        <div
          className="event-brand-box"
          style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            borderRadius: "15px",
            overflow: "hidden",
            border: "1px solid #eee",
          }}
        >
          <div className="brand-logo" style={{ position: "relative" }}>
            <img
              height={223}
              style={{ objectFit: "cover", width: "100%" }}
              src={imageSrc}
              alt="event"
            />
            <div className="event-price">
              {cardData?.events_data?.events_price == "0" ||
                cardData?.events_price == "0" ||
                cardData?.events_data_business?.events_price == "0"
                ? "Free"
                : "$" +
                (cardData?.events_data?.events_price ||
                  cardData?.events_data_business?.events_price ||
                  cardData?.events_price)}
            </div>
          </div>

          <div
            className="event-pad"
            style={{
              padding: "15px",
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
            }}
          >
            <div style={{ flexGrow: 1 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >
                <h6
                  className="title-capitilize"
                  style={{ margin: 0, fontWeight: "700", fontSize: "16px" }}
                >
                  {cardData?.events_data?.events_name ||
                    cardData?.events_data_business?.events_name ||
                    cardData?.events_name}
                </h6>
                <div style={{ display: "flex", gap: "5px" }}>
                  {/* <VisibilityIcon
                    onClick={() => {
                      setActiveData(cardData);
                      setOpen(true);
                    }}
                    sx={{
                      cursor: "pointer",
                      backgroundColor: "#f8f9fa",
                      borderRadius: "4px",
                      fontSize: "24px",
                      padding: "4px",
                    }}
                  /> */}

                  <img
                    src="/images/new-event-eyeicon.png"
                    alt="view event"
                    width={24}
                    height={24}
                    onClick={() => {
                      setActiveData(cardData);
                      setOpen(true);
                    }}
                    style={{
                      cursor: "pointer",
                      backgroundColor: "#f8f9fa",
                      borderRadius: "4px",
                      padding: "4px",
                      objectFit: "contain"
                    }}
                  />
                  <LanguageIcon
                    onClick={() => {
                      const url = cardData?.event_link;
                      if (url) {
                        const validUrl = url.startsWith("http")
                          ? url
                          : `https://${url}`;
                        window.open(validUrl, "_blank", "noopener,noreferrer");
                      }
                    }}
                    sx={{
                      cursor: "pointer",
                      backgroundColor: "#f8f9fa",
                      borderRadius: "4px",
                      fontSize: "24px",
                      padding: "4px",
                    }}
                  />
                </div>
              </div>

              <p
                className="truncate-text"
                style={{
                  fontSize: "13px",
                  color: "#666",
                  marginBottom: "15px",
                }}
              >
                {cardData?.events_data?.events_description ||
                  cardData?.events_data_business?.events_description ||
                  cardData?.events_description}
              </p>

              <div className="point-icon" style={{ fontSize: "13px" }}>
                <div>
                  <img src="/images/location-dot.png" alt="" />{" "}
                  {cardData?.event_away_distance || 0} miles away
                </div>
                <div>
                  <img src="/images/watch.png" alt="" />{" "}
                  {cardData?.events_data?.events_start_time ||
                    cardData?.events_start_time}{" "}
                  to{" "}
                  {cardData?.events_data?.events_end_time ||
                    cardData?.events_end_time}
                </div>
                <div>
                  <img src="/images/calendar.png" alt="" /> Start:{" "}
                  {DateTime.fromISO(
                    cardData?.events_data?.events_date || cardData?.events_date
                  ).toFormat("MMM dd, yyyy")}
                </div>
                <div style={{ marginBottom: "10px" }}>
                  <strong>Code:</strong> {cardData?.event_code || "N/A"}
                </div>
              </div>
            </div>

            {/* --- NEW PROMOTER/BUSINESS UI SECTION --- */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 0",
                borderTop: "1px solid #f0f0f0",
                marginBottom: "10px",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  position: "relative",
                  border: "1px solid #eee",
                  flexShrink: 0,
                }}
              >
                <Image
                  src={
                    creator?.profile_image
                      ? `${BASE_URL}${creator.profile_image}`
                      : "/images/placeholder-user.png"
                  }
                  alt="creator"
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                }}
              >
                <span
                  style={{
                    fontSize: "10px",
                    color: "#FF0015",
                    fontWeight: "700",
                    textTransform: "uppercase",
                  }}
                >
                  {userType}
                </span>
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#333",
                    whiteSpace: "nowrap",
                    理论: "ellipsis",
                    overflow: "hidden",
                  }}
                >
                  {creator?.name || "User"}
                </span>
              </div>
            </div>

            <a
              className="btn btn-viewmore-border"
              href={`/events/${checkedId}?promoter_id=${cardData?.promoter_id}`}
              role="button"
              style={{ width: "100%", textAlign: "center" }}
            >
              View More
            </a>
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

export default Card;

// import { BASE_URL } from "@/constant/constant";
// import { convertTo12HourFormat } from "@/utils/eventFunction";
// import VisibilityIcon from "@mui/icons-material/Visibility";

// import LanguageIcon from "@mui/icons-material/Language";
// import { DateTime } from "luxon";
// import VooponModal from "@/components/VooponModal";
// import { useState } from "react";
// // /images/near-event1.png
// const Card = ({ cardData }) => {
//   const [open, setOpen] = useState(false);
//   const [activeData, setActiveData] = useState(null);

//   const checkedId =
//     cardData?.events_data?.checked_id ||
//     cardData?.events_data_business?.checked_id ||
//     cardData?.checked_id;

//   const imageSrc = cardData?.events_data?.eventimage?.image_name
//     ? `${BASE_URL}/${cardData?.events_data?.eventimage?.image_name}`
//     : cardData?.business_event_image?.image_name
//     ? `${BASE_URL}/${cardData?.business_event_image?.image_name}`
//     : "/images/near-event1.png";

//   // Optional: Prevent rendering until image data is ready
//   if (!cardData) return null;
//   return (
//     <>
//       <div
//         className="col-lg-3 col-md-6"
//         style={{ display: "flex", flexDirection: "column" }}
//       >
//         <div
//           className="event-brand-box"
//           style={{
//             height: "100%",
//             display: "flex",
//             flexDirection: "column",
//             justifyContent: "space-between",
//           }}
//         >
//           <div className="brand-logo">
//             <img
//               height={223}
//               style={{ objectFit: "cover" }}
//               src={imageSrc}
//               alt="event"
//             />
//             <div className="event-price">
//               {" "}
//               {cardData?.events_data?.events_price == "0" ||
//               cardData?.events_price == "0" ||
//               cardData?.events_data_business?.events_price == "0"
//                 ? "Free"
//                 : "$" +
//                   (cardData?.events_data?.events_price ||
//                     cardData?.events_data_business?.events_price ||
//                     cardData?.events_price)}
//             </div>
//           </div>
//           <div className="event-pad">
//             <div style={{ height: "80%" }}>
//               <div
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "space-between",
//                 }}
//               >
//                 <h6 className="title-capitilize" style={{ margin: 0 }}>
//                   {cardData?.events_data?.events_name ||
//                     cardData?.events_data_business?.events_name ||
//                     cardData?.events_name}
//                 </h6>
//                 <VisibilityIcon
//                   onClick={() => {
//                     // Set the data first

//                     setActiveData(cardData);
//                     console.log(cardData, "123456789788");
//                     setOpen(true);
//                   }}
//                   sx={{
//                     cursor: "pointer",
//                     backgroundColor: "#fff",
//                     borderRadius: "4px",
//                     fontSize: "26px",
//                     padding: "4px",
//                   }}
//                 />
//                 <LanguageIcon
//                   onClick={() => {
//                     const url = cardData?.event_link;
//                     if (url) {
//                       const validUrl = url.startsWith("http")
//                         ? url
//                         : `https://${url}`;
//                       window.open(validUrl, "_blank", "noopener,noreferrer");
//                     }
//                   }}
//                   sx={{
//                     cursor: "pointer",
//                     backgroundColor: "#fff",
//                     borderRadius: "4px",
//                     fontSize: "24px",
//                     padding: "4px",
//                   }}
//                 />
//               </div>
//               <p className="truncate-text">
//                 {cardData?.events_data?.events_description ||
//                   cardData?.events_data_business?.events_description ||
//                   cardData?.events_description}
//               </p>
//               <div className="point-icon">
//                 <div style={{ width: "80%" }}>
//                   <img src="/images/location-dot.png" alt="" />{" "}
//                   {cardData?.event_away_distance || 0} miles away{" "}
//                 </div>

//                 <div>
//                   <img src="/images/watch.png" alt="" />
//                   {/* {convertTo12HourFormat(cardData?.events_start_time)} to{" "}
//                 {convertTo12HourFormat(cardData?.events_end_time)}{" "} */}
//                   {cardData?.events_data?.events_start_time ||
//                     cardData?.events_data_business?.events_start_time ||
//                     cardData?.events_start_time}{" "}
//                   to{" "}
//                   {cardData?.events_data?.events_end_time ||
//                     cardData?.events_data_business?.events_end_time ||
//                     cardData?.events_end_time}
//                 </div>

//                 <div>
//                   <img src="/images/calendar.png" alt="" />
//                   Start date:{" "}
//                   {DateTime.fromISO(
//                     cardData?.events_data?.events_date ||
//                       cardData?.events_data_business?.events_date ||
//                       cardData?.events_date
//                   ).toFormat("MMMM dd, yyyy")}
//                 </div>

//                 <div>
//                   <img src="/images/calendar.png" alt="" />
//                   End date:{" "}
//                   {DateTime.fromISO(
//                     cardData?.events_data?.events_end_date ||
//                       cardData?.events_data_business?.events_end_date ||
//                       cardData?.events_end_date
//                   ).toFormat("MMMM dd, yyyy")}
//                 </div>

//                 <div style={{ marginLeft: "23px", marginBottom: "10px" }}>
//                   <img src="" alt="" />
//                   {/* {convertTo12HourFormat(cardData?.events_start_time)} to{" "}
//                     {convertTo12HourFormat(cardData?.events_end_time)}{" "} */}
//                   Code :{cardData?.event_code || "Not available"}
//                 </div>

//               </div>
//             </div>
//             <a
//               className="btn btn-viewmore-border mb-3"
//               // href={`/events/${cardData.checked_id}?promoter_id=${cardData.promoter_id}`}
//               href={`/events/${checkedId}?promoter_id=${cardData?.promoter_id}`}
//               role="button"
//             >
//               View More
//             </a>
//           </div>
//         </div>
//       </div>

//       <VooponModal
//         open={open}
//         handleClose={() => setOpen(false)}
//         allItems={[]}
//         BASE_URL={BASE_URL}
//         activeData={activeData}
//       />
//     </>
//   );
// };

// export default Card;
