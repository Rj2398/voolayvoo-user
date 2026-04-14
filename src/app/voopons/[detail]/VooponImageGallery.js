"use client";

import React, { useState } from "react";
import Image from "next/image";
import FlagIcon from "@mui/icons-material/Flag";
import { IconButton, Tooltip } from "@mui/material";
import ReportModal from "@/components/ReportModal"; // Adjust path to your Modal

const VooponImageGallery = ({ voopon_detail, BASE_URL }) => {
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportData, setReportData] = useState(null);

  const handleOpenReport = () => {
    // Determine if it's a Business or Promoter
    const type = voopon_detail?.voopon_one?.promoter_id
      ? "Promoter"
      : "Business";
    const id = voopon_detail?.voopon_one?.id || voopon_detail?.voopon_two?.id;
    console.log(voopon_detail, "voopon_detailvoopon_detail");

    setReportData({
      event_id: "",
      voopon_id: id,
      type: type,
    });
    setIsReportOpen(true);
  };

  // Resolve the image source logic
  const imageSrc = voopon_detail?.voopon_one?.vooponsimage[0]?.image_name
    ? `${BASE_URL}/${voopon_detail?.voopon_one?.vooponsimage[0]?.image_name}`
    : voopon_detail?.voopon_two?.business_voopon_image?.image_name
    ? `${BASE_URL}/${voopon_detail?.voopon_two?.business_voopon_image?.image_name}`
    : "/images/amf-details.png";

  return (
    <>
      <div
        className="details-img"
        style={{
          width: 596,
          height: 375,
          position: "relative",
          overflow: "hidden",
          borderRadius: "12px",
          backgroundColor: "#f9f9f9",
        }}
      >
        {/* Report Action */}
        <Tooltip title="Report this Voopon">
          <IconButton
            onClick={handleOpenReport}
            sx={{
              position: "absolute",
              top: 15,
              right: 15,
              zIndex: 10,
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              backdropFilter: "blur(4px)",
              "&:hover": {
                backgroundColor: "#fff",
                color: "#FF0015",
              },
            }}
          >
            <FlagIcon sx={{ fontSize: "22px" }} />
          </IconButton>
        </Tooltip>

        <Image
          width={596}
          height={375}
          src={imageSrc}
          alt="voopon image"
          className="img-voopon"
          style={{ objectFit: "cover", width: "100%", height: "100%" }}
        />
      </div>

      {/* Modal is kept inside the client component so state is local */}
      <ReportModal
        open={isReportOpen}
        handleClose={() => setIsReportOpen(false)}
        reportData={reportData}
        eventOrVoopon={"Voopon"}
      />
    </>
  );
};

export default VooponImageGallery;
