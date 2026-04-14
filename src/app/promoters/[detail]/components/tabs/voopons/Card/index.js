"use client";
import { BASE_URL } from "@/constant/constant";
import { checkExpirationStatus } from "@/utils/voopanFunction";
import { DateTime } from "luxon";
import Image from "next/image";
import LanguageIcon from "@mui/icons-material/Language";

const Card = ({ data }) => {
  // LOGIC: Determine if Business or Promoter
  const isBusiness = !!data?.business_id;
  const creator = isBusiness ? data?.business_details : data?.promoter_details;
  const userType = isBusiness ? "Business" : "Promoter";

  return (
    <div className="col-lg-3 col-md-6 mb-4">
      <div
        className="voopan-box"
        style={{
          padding: "20px",
          borderRadius: "20px",
          border: "1px solid #eee",
          backgroundColor: "#fff",
          textAlign: "center", // CRITICAL: Centers everything
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "100%",
          boxShadow: "0px 4px 10px rgba(0,0,0,0.05)",
        }}
      >
        {checkExpirationStatus(data?.voopons_valid_thru) && (
          <span className="expiring-soon">Expiring soon</span>
        )}

        {/* 1. Logo - Circular with color or Contain */}
        <div
          style={{
            width: "110px",
            height: "110px",
            borderRadius: "50%",
            backgroundColor: "#f8f9fa",
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
              data?.vooponimage?.image_name
                ? `${BASE_URL}${data.vooponimage.image_name}`
                : "/images/voopons-logo-1.png"
            }
            style={{ objectFit: "contain" }}
            alt="logo"
          />
        </div>

        {/* 2. Red Heading & Language Icon Wrapper */}
        <div style={{ position: "relative", width: "100%" }}>
          <div
            style={{
              color: "#FF0015",
              fontSize: "22px",
              fontWeight: "900",
              marginBottom: "5px",
            }}
          >
            {data?.voopons_name}
          </div>
          <LanguageIcon
            onClick={() => {
              const url = data?.voopon_link;
              if (url)
                window.open(
                  url.startsWith("http") ? url : `https://${url}`,
                  "_blank"
                );
            }}
            sx={{
              position: "absolute",
              right: 0,
              top: "5px",
              cursor: "pointer",
              backgroundColor: "#f3f4f6",
              borderRadius: "4px",
              fontSize: "20px",
              padding: "2px",
            }}
          />
        </div>

        {/* 3. Description */}
        <div
          style={{
            fontSize: "16px",
            color: "#444",
            marginBottom: "15px",
            fontWeight: "500",
          }}
        >
          {data?.voopons_description}
        </div>

        {/* 4. Dates and Code */}
        <div style={{ fontSize: "15px", color: "#333", marginBottom: "15px" }}>
          <div style={{ fontWeight: "700" }}>
            Start:{" "}
            <span style={{ fontWeight: "400" }}>
              {DateTime.fromFormat(data?.voopons_date, "yyyy-MM-dd").toFormat(
                "MMM dd, yyyy"
              )}
            </span>
          </div>
          <div style={{ fontWeight: "700" }}>
            End:{" "}
            <span style={{ fontWeight: "400" }}>
              {DateTime.fromFormat(
                data?.voopons_valid_thru,
                "yyyy-MM-dd"
              ).toFormat("MMM dd, yyyy")}
            </span>
          </div>
          <div style={{ marginTop: "8px", fontWeight: "900" }}>
            Code: {data?.voopon_code || "N/A"}
          </div>
        </div>

        {/* 5. Business/Promoter Section (Matches image_cc1921.png) */}
        <div
          style={{
            width: "100%",
            borderTop: "1px solid #eee",
            paddingTop: "15px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "20px",
            justifyContent: "flex-start",
            textAlign: "left",
          }}
        >
          <div
            style={{
              width: "45px",
              height: "45px",
              borderRadius: "50%",
              overflow: "hidden",
              position: "relative",
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
          <div>
            <div
              style={{
                fontSize: "10px",
                color: "#FF0015",
                fontWeight: "900",
                textTransform: "uppercase",
              }}
            >
              {userType}
            </div>
            <div style={{ fontSize: "15px", fontWeight: "700", color: "#333" }}>
              {creator?.name || "User"}
            </div>
          </div>
        </div>

        {/* 6. Red Pill Button */}
        <a
          href={`/voopons/${data.unique_number}`}
          style={{
            backgroundColor: "#FF0015",
            color: "#fff",
            borderRadius: "50px", // Full rounded pill
            padding: "12px 0",
            fontWeight: "900",
            fontSize: "18px",
            textDecoration: "none",
            width: "100%", // Full width of the card padding
            marginTop: "auto",
          }}
        >
          View More
        </a>
      </div>
    </div>
  );
};

export default Card;

// import { BASE_URL } from "@/constant/constant";
// import { checkExpirationStatus } from "@/utils/voopanFunction";
// import { DateTime } from "luxon";
// import Image from "next/image";
// import LanguageIcon from "@mui/icons-material/Language";
// const Card = ({ data }) => {
//   return (
//     <div className="col-lg-3 col-md-6">
//       <div className="voopan-box">
//         {checkExpirationStatus(data?.voopons_valid_thru) && (
//           <span className="expiring-soon">Expiring soon</span>
//         )}
//         <div className="voopon-logo">
//           <Image
//             width={125}
//             height={125}
//             src={
//               data?.vooponimage?.image_name
//                 ? `${BASE_URL}${data?.vooponimage?.image_name}`
//                 : data?.business_voopon_image?.image_name
//                 ? `${BASE_URL}${data?.business_voopon_image?.image_name}`
//                 : "/images/voopons-logo-1.png"
//             }
//             style={{ objectFit: "cover" }}
//             alt="voopons"
//           />
//         </div>
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//           }}
//         >
//           <div className="voopon-heading">{data?.voopons_name} </div>
//           <div style={{ marginTop: "20px" }}>
//             <LanguageIcon
//               onClick={() => {
//                 const url = data?.voopon_link;
//                 if (url) {
//                   const validUrl = url.startsWith("http")
//                     ? url
//                     : `https://${url}`;
//                   window.open(validUrl, "_blank", "noopener,noreferrer");
//                 }
//               }}
//               sx={{
//                 cursor: "pointer",
//                 backgroundColor: "#fff",
//                 borderRadius: "4px",
//                 fontSize: "24px",
//                 padding: "4px",
//               }}
//             />
//           </div>
//         </div>

//         <h5>{data?.voopons_description}</h5>
//         <p>
//           Start Date :
//           {DateTime.fromFormat(data?.voopons_date, "yyyy-MM-dd").toFormat(
//             "MMMM dd, yyyy"
//           )}
//         </p>
//         <p>
//           End Date :
//           {DateTime.fromFormat(data?.voopons_valid_thru, "yyyy-MM-dd").toFormat(
//             "MMMM dd, yyyy"
//           )}
//         </p>

//         <p>Code :{data?.voopon_code || "Not available"}</p>

//         <a
//           className="btn btn-viewmore"
//           href={`/voopons/${data.category_id}`}
//           role="button"
//         >
//           View More
//         </a>
//       </div>
//     </div>
//   );
// };

// export default Card;
