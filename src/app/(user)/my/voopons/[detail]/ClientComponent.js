"use client";
import { useState } from "react";
import Image from "next/image";
import Collaborator from "@/app/voopons/[detail]/components/Modal/collaborator";
import { DateTime } from "luxon";
import Link from "next/link";
import { BASE_URL } from "@/constant/constant";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import ShowQrCode from "@/components/Modal/ShowQrCode";
import { Rating } from "@mui/material";

const ClientComponent = ({ vooponDetail, qrCode }) => {
  const [open, setOpen] = useState(false);
  const [openQrCode, setOpenQrCode] = useState(false);

  let pathName = usePathname();

  const searchParams = useSearchParams();
  const tempPathName =
    pathName + `?promoter_id=${searchParams.get("promoter_id")}`;
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

  const handleQrCode = () => {
    setOpenQrCode(true);
  };

  return (
    <>
      <div className="col-lg-6">
        <div className="details-text-box">
          <h2 className="title-capitilize"> {vooponDetail?.voopons_name} </h2>
          <p>{vooponDetail?.voopons_description}</p>

          {vooponDetail?.collaborator_data?.length > 0 && (
            <div className="collaborators">
              <span>
                <Image
                  width={31}
                  height={31}
                  src="/images/collabo-icon.png"
                  alt="images"
                  className="img-fluid"
                />
              </span>
              <span className="col-font" onClick={() => setOpen(true)}>
                Collaborator(s):
              </span>
              <span>
                {vooponDetail?.collaborator_data?.length > 0 &&
                  vooponDetail?.collaborator_data.map((collaborator, idx) => {
                    if (idx < 3) {
                      return (
                        <Image
                          key={collaborator?.id}
                          width={31}
                          height={31}
                          src={
                            collaborator?.promoter_data?.profile_image
                              ? `${BASE_URL}/${collaborator?.promoter_data?.profile_image}`
                              : "/images/colebr-1.png"
                          }
                          alt="images"
                          className="collabeIcon"
                        />
                      );
                    }
                  })}

                {vooponDetail?.collaborator_data?.length > 3 && (
                  <div className="more">
                    {" "}
                    +{vooponDetail?.collaborator_data?.length - 3}{" "}
                  </div>
                )}
              </span>
            </div>
          )}

          <Collaborator
            open={open}
            setOpen={setOpen}
            data={vooponDetail?.voopon_one?.collaborator_data}
          />
          <ShowQrCode
            open={openQrCode}
            setOpen={setOpenQrCode}
            codeData={qrCode}
            label={vooponDetail?.voopons_name?.toUpperCase() || "Voopan"}
          />

          <div className="row mt-3">
            <div className="col-lg-8 col-md-8">
              <div className="location-box">
                <h4> Location </h4>
                <span> {vooponDetail?.voopon_one?.location} </span>
              </div>
            </div>
            <div className="col-lg-4 col-md-4">
              <div className="valid-thru">
                <h4> Valid Thru </h4>
                <span>
                  {" "}
                  {vooponDetail?.voopon_one?.voopons_valid_thru &&
                    DateTime.fromFormat(
                      vooponDetail?.voopon_one?.voopons_valid_thru,
                      "yyyy-MM-dd"
                    ).toFormat("MMM dd, yyyy")}
                </span>
              </div>
            </div>
          </div>
          <div className="row mt-2 align-items-center">
            <div className="col-lg-8 col-md-6">
              <div className="price-box">
                <h4>
                  {" "}
                  Price:{" "}
                  <span>
                    {" "}
                    {vooponDetail?.voopon_one?.voopons_price === "0"
                      ? "Free"
                      : "$" + vooponDetail?.voopon_one?.voopons_price}{" "}
                  </span>
                </h4>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="quantityStatic">
                <h4>
                  {" "}
                  Quantity: <span> {vooponDetail?.voopon_one?.voopon_quantity} </span>
                </h4>
              </div>
            </div>
          </div>
          <div className="row mt-2 align-items-center">
            <div className="col-lg-8 col-md-6">
              <Link
                onClick={handleQrCode}
                className="btn btn-learnmore"
                role="button"
                href={"#"}
              >
                Voopan QR
              </Link>
            </div>
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
                  Share with friends{" "}
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
      </div>
    </>
  );
};

export default ClientComponent;
