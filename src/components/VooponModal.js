import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Modal,
  Box,
  IconButton,
  Pagination,
  Stack,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";
import { DateTime } from "luxon";
import LanguageIcon from "@mui/icons-material/Language";
import axios from "axios";
import { BASE_URL } from "@/constant/constant";
import { useAuth } from "@/app/UserProvider";
import { truncateDescriptionByWords } from "@/utils/eventFunction";

const VooponModal = ({ open, handleClose, activeData }) => {
  const { isAuthenticated, userDetails } = useAuth();

  const id = activeData?.id || activeData?.id;
  const user_type = activeData?.promoter_id
    ? "Promoter"
    : activeData?.business_id
    ? "Business"
    : null;

  const user_id = userDetails?.user_id;
  const token = userDetails?.token;

  const [localAllItems, setLocalAllItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => {
    const fetchAllVoopons = async () => {
      // 1. Check if modal is open and we have the necessary data to call the API
      if (!open || !activeData) return;

      setLoading(true);

      console.log(
        {
          // Make sure these names match what your backend expects
          type: user_type,
          user_id: user_id,
          user_type: "User", // Hardcoded as per your requirement
          id: id,
        },
        "*****Body**"
      );
      try {
        const response = await axios.post(
          `${BASE_URL}/api/event/voopon`,
          {
            // Make sure these names match what your backend expects
            type: user_type,
            user_id: user_id,
            user_type: "User", // Hardcoded as per your requirement
            id: id,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const fetchedArray = response?.data?.data;
        setLocalAllItems(fetchedArray);
        setCurrentPage(1);
      } catch (error) {
        console.error("Error fetching voopons:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllVoopons();
  }, [open, activeData, token]);

  // Local Pagination Math
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = localAllItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(localAllItems.length / itemsPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <Box
        sx={{
          outline: "none",
          width: "95%",
          maxWidth: "1100px",
          bgcolor: "#fff",
          position: "relative",
          padding: "50px 25px 30px 25px",
          borderRadius: "16px",
          minHeight: "350px", // Maintains size while loading
          boxShadow: 24,
        }}
      >
        <IconButton
          onClick={handleClose}
          sx={{ position: "absolute", right: 15, top: 15, zIndex: 10 }}
        >
          <CloseIcon />
        </IconButton>

        {/* LOADING STATE */}
        {loading ? (
          <Stack
            alignItems="center"
            justifyContent="center"
            sx={{ minHeight: "250px" }}
          >
            <CircularProgress color="primary" size={50} />
            <p style={{ marginTop: "15px", color: "#666", fontWeight: 500 }}>
              Fetching your voopons...
            </p>
          </Stack>
        ) : localAllItems.length > 0 ? (
          <>
            <div className="row">
              {currentItems.map((item, idx) => (
                <div key={item.id || idx} className="col-lg-4 col-md-6 mb-4">
                  <div
                    className="voopan-box"
                    style={{
                      margin: 0,
                      border: "1px solid #eee",
                      height: "100%",
                      padding: "20px",
                      borderRadius: "15px",
                      textAlign: "center", // Everything is centered in your reference
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    {/* 1. Circular Logo */}
                    <div
                      style={{
                        width: "100px",
                        height: "100px",
                        borderRadius: "50%",
                        overflow: "hidden",
                        backgroundColor: "#8EDADB", // Light teal background from image
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
                          item?.vooponimage && item.vooponimage.length > 0
                            ? `${BASE_URL}${item.vooponimage[0].image_name}`
                            : "/images/voopons-logo-1.png"
                        }
                        alt="Logo"
                        style={{ objectFit: "contain" }}
                      />
                    </div>

                    {/* 2. Red Title */}
                    <div
                      style={{
                        fontSize: "22px",
                        fontWeight: "900",
                        color: "#FF0015", // Bright red from image
                        marginBottom: "5px",
                      }}
                    >
                      {truncateDescriptionByWords(item?.voopons_name, 20)}
                    </div>

                    {/* 3. Description & World Icon */}
                    <div
                      style={{
                        position: "relative",
                        width: "100%",
                        marginBottom: "10px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "18px",
                          fontWeight: "700",
                          color: "#222",
                          lineHeight: "1.2",
                        }}
                      >
                        {truncateDescriptionByWords(
                          item.voopons_description,
                          20
                        )}
                      </div>
                      <LanguageIcon
                        onClick={() => window.open(item.voopon_link, "_blank")}
                        sx={{
                          position: "absolute",
                          right: 0,
                          top: "50%",
                          transform: "translateY(-50%)",
                          backgroundColor: "#f3f4f6",
                          borderRadius: "4px",
                          fontSize: "20px",
                          padding: "2px",
                          cursor: "pointer",
                        }}
                      />
                    </div>

                    {/* 4. Dates with Calendar Icon */}
                    <div
                      style={{
                        fontSize: "14px",
                        color: "#333",
                        textAlign: "left",
                        width: "fit-content",
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
                        <strong>Start Date:</strong>&nbsp;
                        {item?.voopons_date
                          ? DateTime.fromISO(item.voopons_date).toFormat(
                              "MMMM dd, yyyy"
                            )
                          : "N/A"}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: "8px",
                        }}
                      >
                        <Image
                          width={18}
                          height={18}
                          src="/images/calendar.png"
                          alt=""
                          style={{ marginRight: "8px" }}
                        />
                        <strong>End Date:</strong>&nbsp;
                        {item?.voopons_valid_thru
                          ? DateTime.fromISO(item.voopons_valid_thru).toFormat(
                              "MMMM dd, yyyy"
                            )
                          : "N/A"}
                      </div>
                    </div>

                    {/* 5. Code */}
                    <div
                      style={{
                        fontSize: "16px",
                        fontWeight: "600",
                        marginBottom: "15px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "16px",
                          fontWeight: "600",
                          marginBottom: "15px",
                        }}
                      >
                        Code:{" "}
                        {item?.voopon_code ? item.voopon_code : "Not Available"}
                      </div>
                    </div>

                    {/* 6. View More Button */}
                    <Link
                      className="btn btn-viewmore"
                      // href={`/voopons/${item.id}?promoter_id=${item.promoter_id}`}
                      href={`/voopons/${item.category_id}`}
                      role="button"
                    >
                      View More
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* LOCAL PAGINATION UI */}
            {totalPages > 1 && (
              <Stack spacing={2} sx={{ mt: 4, alignItems: "center" }}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                />
              </Stack>
            )}
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "60px", color: "#888" }}>
            No coupons available at the moment.
          </div>
        )}
      </Box>
    </Modal>
  );
};

export default VooponModal;

// import React, { useState, useEffect } from "react";
// import { Modal, Box, IconButton, Pagination, Stack } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import Image from "next/image";
// import { DateTime } from "luxon";
// import LanguageIcon from "@mui/icons-material/Language";

// const VooponModal = ({
//   open,
//   handleClose,
//   allItems = [],
//   initialIndex = 0,
//   BASE_URL,
//   activeData,
// }) => {
//   console.log(activeData, "activeDataactiveData");
//   // Local state to manage pagination
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 3;

//   // Reset to page 1 whenever the modal opens to ensure fresh view
//   useEffect(() => {
//     if (open) {
//       setCurrentPage(1);
//     }
//   }, [open]);

//   // Calculate pagination logic
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = allItems
//     ? allItems.slice(indexOfFirstItem, indexOfLastItem)
//     : [];
//   const totalPages = Math.ceil((allItems?.length || 0) / itemsPerPage);

//   const handlePageChange = (event, value) => {
//     setCurrentPage(value);
//   };

//   return (
//     <Modal
//       open={open}
//       onClose={handleClose}
//       sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
//     >
//       <Box
//         sx={{
//           outline: "none",
//           width: "95%",
//           maxWidth: "1100px", // Width for 3 items
//           bgcolor: "#fff",
//           position: "relative",
//           padding: "50px 25px 30px 25px",
//           borderRadius: "16px",
//           boxShadow: 24,
//         }}
//       >
//         {/* Close Button */}
//         <IconButton
//           onClick={handleClose}
//           sx={{
//             position: "absolute",
//             right: 15,
//             top: 15,
//             zIndex: 10,
//             backgroundColor: "#f5f5f5",
//             "&:hover": { backgroundColor: "#e0e0e0" },
//           }}
//         >
//           <CloseIcon />
//         </IconButton>

//         {/* Content Section */}
//         {allItems && allItems.length > 0 ? (
//           <>
//             <div className="row">
//               {currentItems.map((item, idx) => (
//                 <div key={item.id || idx} className="col-lg-4 col-md-6 mb-4">
//                   <div
//                     className="voopan-box"
//                     style={{
//                       margin: 0,
//                       border: "1px solid #eee",
//                       height: "100%",
//                       display: "flex",
//                       flexDirection: "column",
//                       justifyContent: "space-between",
//                     }}
//                   >
//                     <div>
//                       <div className="voopon-logo">
//                         <Image
//                           width={100}
//                           height={100}
//                           src={
//                             item?.vooponimage?.image_name
//                               ? `${BASE_URL}${item.vooponimage.image_name}`
//                               : "/images/voopons-logo-1.png"
//                           }
//                           alt="Voopon"
//                           style={{ objectFit: "contain" }}
//                         />
//                       </div>

//                       <div
//                         className="voopon-heading"
//                         style={{
//                           fontSize: "18px",
//                           marginTop: "10px",
//                           fontWeight: "bold",
//                         }}
//                       >
//                         {item?.voopons_name}
//                       </div>

//                       <div
//                         style={{
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "space-between",
//                           marginTop: "8px",
//                         }}
//                       >
//                         <h5
//                           style={{ margin: 0, fontSize: "16px", color: "#555" }}
//                         >
//                           Code: {item?.voopon_code}
//                         </h5>

//                         <LanguageIcon
//                           onClick={() => {
//                             if (item?.event_link) {
//                               const url = item.event_link.startsWith("http")
//                                 ? item.event_link
//                                 : `https://${item.event_link}`;
//                               window.open(url, "_blank", "noopener,noreferrer");
//                             }
//                           }}
//                           sx={{
//                             cursor: "pointer",
//                             backgroundColor: "#f0f7ff",
//                             borderRadius: "4px",
//                             fontSize: "24px",
//                             padding: "4px",
//                             color: "#007bff",
//                           }}
//                         />
//                       </div>

//                       <div
//                         style={{
//                           fontSize: "13px",
//                           color: "#777",
//                           marginTop: "12px",
//                         }}
//                       >
//                         <div>
//                           <strong>Valid From:</strong>{" "}
//                           {item?.voopons_date
//                             ? DateTime.fromFormat(
//                                 item.voopons_date,
//                                 "yyyy-MM-dd"
//                               ).toFormat("MMM dd, yyyy")
//                             : "N/A"}
//                         </div>
//                         <div>
//                           <strong>Valid Thru:</strong>{" "}
//                           {item?.voopons_valid_thru
//                             ? DateTime.fromFormat(
//                                 item.voopons_valid_thru,
//                                 "yyyy-MM-dd"
//                               ).toFormat("MMM dd, yyyy")
//                             : "N/A"}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Pagination Controls */}
//             {totalPages > 1 && (
//               <Stack spacing={2} sx={{ mt: 4, alignItems: "center" }}>
//                 <Pagination
//                   count={totalPages}
//                   page={currentPage}
//                   onChange={handlePageChange}
//                   color="primary"
//                   variant="outlined"
//                   shape="rounded"
//                 />
//               </Stack>
//             )}
//           </>
//         ) : (
//           <div
//             style={{
//               textAlign: "center",
//               padding: "40px",
//               fontSize: "18px",
//               color: "#888",
//             }}
//           >
//             No coupons available to display.
//           </div>
//         )}
//       </Box>
//     </Modal>
//   );
// };

// export default VooponModal;
