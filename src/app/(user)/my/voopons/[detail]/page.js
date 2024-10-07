"use client";

import { useAuth } from "@/app/UserProvider";
import ClientComponent from "./ClientComponent";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useSearchParams } from "next/navigation";
import { BASE_URL } from "@/constant/constant";

const VooponDetail = () => {
  const { isAuthenticated, userDetails } = useAuth();
  const [vooponDetail, setVooponDetail] = useState(null); // Holds event details
  const params = useParams();
  const searchParams = useSearchParams();
  const match_number = searchParams.get("match_number");

  useEffect(() => {
    if (isAuthenticated && params.detail && match_number) {
      fetchEventDetail();
    }
  }, [isAuthenticated, params.detail, match_number]);

  const fetchEventDetail = async () => {
    try {
      if (!userDetails?.user_id || !params.detail || !match_number) {
        console.error("Missing necessary parameters.");
        return;
      }

      // Create FormData object
      const formData = new FormData();
      formData.append("user_id", userDetails.user_id);
      formData.append("voopon_unique_number", params.detail);
      formData.append("match_number", match_number);

      // Bearer token (make sure to handle this securely in production)
      const bearerToken =
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3Zvb2xleXZvby50Z2FzdGFnaW5nLmNvbS9hcGkvbG9naW4iLCJpYXQiOjE3MjE4MTkwNTEsImV4cCI6MTc1MzM3NjY1MSwibmJmIjoxNzIxODE5MDUxLCJqdGkiOiJrS2xDeTMxdDdSNGgzZTVxIiwic3ViIjoiMzY4IiwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.BZrPBg5l-oAL_wriB8XUNei3wq7f52xfgshLS5ovIk4"; // truncated for brevity

      // Send the POST request with FormData and Bearer token
      const response = await fetch(
        "https://vooleyvoo.tgastaging.com/api/auth/user_my_voopon_detail_list",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${bearerToken}`, // No need for nested template literals
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const resVoopon = await response.json();
      console.log(resVoopon, "response data");
      setVooponDetail(resVoopon.data);
    } catch (error) {
      console.error("Error fetching event details:", error);
    }
  };

  return (
    <>
      <section className="details-page">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="details-img" style={{ width: 596, height: 375 }}>
                {}{" "}
                <Image
                  width={596}
                  height={375}
                  src={
                    vooponDetail?.voopon_one?.vooponsimage[0]?.image_name
                      ? vooponDetail?.voopon_one?.vooponsimage[0]?.image_name
                      : "/images/amf-details.png"
                  }
                  // src={
                  //   vooponDetail?.voopon_one?.vooponsimage[0]
                  //     ? `${BASE_URL}/${
                  //         vooponDetail?.voopon_one?.vooponsimage[0]?.image_name
                  //       }`
                  //     : "/images/banners/slide1.png"
                  // }
                  alt="images"
                  className="img-voopon"
                />
              </div>
            </div>
            <ClientComponent
              vooponDetail={vooponDetail}
              qrCode={vooponDetail?.qr_code_image_one}
            />
          </div>
        </div>
      </section>

      <section className="about-details">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="heading-sec">
                {vooponDetail?.voopon_one?.voopons_name || "About this Voopons"}
              </div>
              <p>{vooponDetail?.voopon_one?.voopons_description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Uncomment when related event functionality is added */}
      {/* {relatedEvent?.id && <Events related_event={relatedEvent} />} */}
    </>
  );
};

export default VooponDetail;
