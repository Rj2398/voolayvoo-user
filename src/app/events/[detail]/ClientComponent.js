"use client";
import { useState } from "react";
import Image from "next/image";
import Voopons from "./components/voopons";
import Collaborator from "@/app/voopons/[detail]/components/Modal/collaborator";
import { DateTime } from "luxon";
import Link from "next/link";
import { BASE_URL } from "@/constant/constant";
import Quantity from "@/components/Quantity";
import Carousel from "@/components/Carousel";
import { useAuth } from "@/app/UserProvider";
// import BackButton from "../../BackButton"
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { toast } from "react-toastify";
import { postData, postFetchDataWithAuth } from "@/fetchData/fetchApi";
import CheckPayment from "@/components/Modal/CheckPayment";
import { Rating } from "@mui/material";

const ClientComponent = ({ eventDetail, relatedVoopon = [] }) => {
  const [open, setOpen] = useState(false);
  const [openCard, setOpenCard] = useState(false);
  // const [eventPrice, setEventPrice] = useState<number>(
  //   eventDetail?.event_one?.hasOwnProperty("events_price")
  //     ? Number(eventDetail?.event_one?.events_price)
  //     : 0
  // );

  const params = useParams();

  //  code written by rajan
  const [eventPrice, setEventPrice] = useState(
    eventDetail?.event_one?.hasOwnProperty("events_price")
      ? Number(eventDetail?.event_one?.events_price)
      : eventDetail?.event_two?.hasOwnProperty("events_price")
        ? Number(eventDetail?.event_two?.events_price)
        : 0
  );

  const [quantity, setQuantity] = useState(1);
  const { isAuthenticated, userDetails } = useAuth();
  const router = useRouter();
  let pathName = usePathname();
  const [reload, setReload] = useState(false);

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

  // event details call

  // const handleQuantity = (qty) => {
  //   setQuantity(qty);
  //   setEventPrice(
  //     eventDetail?.event_one?.hasOwnProperty("events_price")
  //       ? Number(eventDetail?.event_one?.events_price) * qty
  //       : 0
  //   );
  // };

  //  code written by rajan

  const handleQuantity = (qty) => {
    setQuantity(qty);
    const price = eventDetail?.event_one?.hasOwnProperty("events_price")
      ? Number(eventDetail?.event_one?.events_price)
      : eventDetail?.event_two?.hasOwnProperty("events_price")
        ? Number(eventDetail?.event_two?.events_price)
        : 0;
    setEventPrice(price * qty);
  };

  const handleBookNow = () => {
    if (!isAuthenticated) {
      router.push(`/login?lastPath=${tempPathName}`);
    } else {
      if (eventPrice === 0) {
        setOpenCard(false);
        freeBuyNow();
      } else if (eventPrice !== 0) {
        setOpenCard(true);
      }
    }
  };

  const callBack = async (card) => {
    let requestData;
    if (card?.token) {
      requestData = {
        user_id: `${userDetails?.user_id}`,
        unique_number: params?.detail,
        price: eventPrice,
        event_quantity: `${quantity}`,
        voopon_quantity: null,
        token: card?.token,
      };
    } else if (card?.customer_id) {
      requestData = {
        user_id: `${userDetails?.user_id}`,
        unique_number: params?.detail,
        price: eventPrice,
        event_quantity: `${quantity}`,
        voopon_quantity: null,
        customer_id: card?.customer_id,
      };
    }

    try {
      const response = await postFetchDataWithAuth({
        data: requestData,
        endpoint: "user_buy_now",
        authToken: userDetails.token,
      });
      if (response.success) {
        setReload(!reload);
        toast.success(`Payment successful`);
        setOpenCard(false);
      } else {
        throw response;
      }
    } catch (error) {
      const errorMessage =
        typeof error === "string"
          ? `${error}`
          : error?.message
            ? error?.message
            : `${error}`;
      toast.error(errorMessage);
    }
  };

  const freeBuyNow = async () => {
    try {
      const requestData = {
        user_id: `${userDetails?.user_id}`,
        unique_number: params?.detail,
        price: eventPrice,
        event_quantity: `${quantity}`,
        voopon_quantity: null,
      };

      const response = await postFetchDataWithAuth({
        data: requestData,
        endpoint: "user_free_buy_now",
        authToken: userDetails.token,
      });

      if (response.success) {
        setReload(!reload);
        toast.success(`Grab deal successful`);
        setOpenCard(false);
      } else {
        throw response;
      }
    } catch (error) { }
  };

  return (
    <>
      <section className="details-page">
        {/* <BackButton /> */}
        <div className="back-btn" style={{ cursor: "pointer", width: "100%", color:"black", padding:"10px 25px" }}>
          <a
            to="#"
            onClick={(e) => {
              e.preventDefault();
              window.history.back();
            }}
          >
            <img src="/images/left-arrow.svg" alt="Back" 
            style={{filter: "brightness(0) saturate(100%)"}} />
          </a>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="slider-box">
                {/* <img
                  className="w-100"
                  src={
                    eventDetail?.event_two?.business_events_image[0]?.image_name
                      ? `${BASE_URL}/${eventDetail?.event_two?.business_events_image[0]?.image_name}`
                      : "/images/banners/slide1.png"
                  }
                  alt=""
                  id="product-main-image"
                /> */}

                <img
                  className="w-100"
                  src={
                    eventDetail?.event_one?.eventsimage[0]?.image_name ||
                      eventDetail?.event_two?.business_events_image[0]?.image_name
                      ? `${BASE_URL}/${eventDetail?.event_one?.eventsimage[0]?.image_name ||
                      eventDetail?.event_two?.business_events_image[0]
                        ?.image_name
                      }`
                      : "/images/banners/slide1.png"
                  }
                  alt=""
                  id="product-main-image"
                />

                <Carousel
                  RenderComponent={() => null}
                  itemsPerPage={4}
                  isImage={true}
                  itemsList={
                    eventDetail?.event_one?.eventsimage ||
                    eventDetail?.event_two?.business_events_image
                  }
                />
              </div>
            </div>
            <div className="col-lg-6">
              <div className="details-text-box">
                <h2 className="title-capitilize">
                  {" "}
                  {eventDetail?.event_one?.events_name ||
                    eventDetail?.event_two?.events_name}
                </h2>
                <p className="paragraph-wrap">
                  {eventDetail?.event_one?.events_description ||
                    eventDetail?.event_two?.events_description}{" "}
                </p>
                {/*  for collaborator */}
                {/* <div className="colibraters-rating">
                  {eventDetail?.event_one?.collaborator_data?.length !== 0 && (
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
                        Collaborator(s):{" "}
                      </span>
                      <span>
                        {eventDetail?.event_one?.collaborator_data?.length >
                          0 &&
                          eventDetail?.event_one?.collaborator_data.map(
                            (collaborator, idx) => {
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
                            }
                          )}

                        {eventDetail?.event_one?.collaborator_data?.length >
                          3 && (
                          <div className="more">
                            {" "}
                            +
                            {eventDetail?.event_one?.collaborator_data?.length -
                              3}{" "}
                          </div>
                        )}
                      </span>
                    </div>
                  )}
                  {/*  for rating */}
                {/* {Array.isArray(eventDetail?.rating_data) &&
                  eventDetail?.rating_data?.[0] !== 0 &&
                  eventDetail?.rating_data?.[1] !== 0 &&
                  eventDetail?.rating_data?.length > 1 && (
                    <div className="rating-box">
                      {" "}
                      {eventDetail?.rating_data?.[0].toFixed(1)}{" "}
                      <span>
                        <Rating
                          name="read-star"
                          value={eventDetail?.rating_data?.[0].toFixed(2)}
                          readOnly
                          precision={0.5}
                        />
                      </span>{" "}
                      ({eventDetail?.rating_data?.[1]})
                    </div>
                  )} */}
                {/* </div> */}
                {/*  code written by rajan */}

                <div className="colibraters-rating">
                  {/* For event_one */}
                  {(eventDetail?.event_one?.collaborator_data?.length !== 0 ||
                    eventDetail?.event_two?.collaborator_data?.length !==
                    0) && (
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
                          Collaborator(s):{" "}
                        </span>
                        <span>
                          {/* For event_one collaborators */}
                          {eventDetail?.event_one?.collaborator_data?.length >
                            0 &&
                            eventDetail?.event_one?.collaborator_data.map(
                              (collaborator, idx) => {
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
                              }
                            )}
                          {/* For event_two collaborators */}
                          {eventDetail?.event_two?.collaborator_data?.length >
                            0 &&
                            eventDetail?.event_two?.collaborator_data.map(
                              (collaborator, idx) => {
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
                              }
                            )}

                          {/* Show additional collaborators */}
                          {(eventDetail?.event_one?.collaborator_data?.length >
                            3 ||
                            eventDetail?.event_two?.collaborator_data?.length >
                            3) && (
                              <div className="more">
                                {" "}
                                +
                                {Math.max(
                                  eventDetail?.event_one?.collaborator_data
                                    ?.length || 0,
                                  eventDetail?.event_two?.collaborator_data
                                    ?.length || 0
                                ) - 3}{" "}
                              </div>
                            )}
                        </span>
                      </div>
                    )}

                  {/* For rating */}
                  {(Array.isArray(eventDetail?.event_one?.rating_data) &&
                    eventDetail?.event_one?.rating_data?.[0] !== 0 &&
                    eventDetail?.event_one?.rating_data?.[1] !== 0 &&
                    eventDetail?.event_one?.rating_data?.length > 1) ||
                    (Array.isArray(eventDetail?.event_two?.rating_data) &&
                      eventDetail?.event_two?.rating_data?.[0] !== 0 &&
                      eventDetail?.event_two?.rating_data?.[1] !== 0 &&
                      eventDetail?.event_two?.rating_data?.length > 1) ? (
                    <div className="rating-box">
                      {" "}
                      {eventDetail?.event_one?.rating_data?.[0]?.toFixed(1) ||
                        eventDetail?.event_two?.rating_data?.[0]?.toFixed(
                          1
                        )}{" "}
                      <span>
                        <Rating
                          name="read-star"
                          value={
                            eventDetail?.event_one?.rating_data?.[0]?.toFixed(
                              2
                            ) ||
                            eventDetail?.event_two?.rating_data?.[0]?.toFixed(2)
                          }
                          readOnly
                          precision={0.5}
                        />
                      </span>{" "}
                      (
                      {eventDetail?.event_one?.rating_data?.[1] ||
                        eventDetail?.event_two?.rating_data?.[1]}
                      )
                    </div>
                  ) : null}
                </div>

                <Collaborator
                  open={open}
                  setOpen={setOpen}
                  data={
                    eventDetail?.event_one?.collaborator_data ||
                    eventDetail?.event_two?.collaborator_data
                  }
                />
                <CheckPayment
                  open={openCard}
                  setOpen={setOpenCard}
                  callBack={callBack}
                  reloadList={reload}
                />

                <div className="row mt-2 align-items-center">
                  <div className="col-lg-7 col-md-6">
                    <div className="quantity">
                      <h4> Quantity:</h4>
                      <Quantity limit={1000} updateQuantity={handleQuantity} />
                    </div>
                  </div>
                  <div className="col-lg-5 col-md-6">
                    <div className="price-box">
                      <h4>
                        {" "}
                        Price:{" "}
                        <span>
                          {eventPrice === 0 ? "Free" : "$" + eventPrice}{" "}
                        </span>
                      </h4>
                    </div>
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-lg-7 col-md-6">
                    <div className="valid-thru">
                      <h4> Date & Time </h4>
                      <span>
                        {eventDetail?.event_one?.events_date ||
                          (eventDetail?.event_two?.events_date &&
                            DateTime.fromFormat(
                              eventDetail?.event_one?.events_date ||
                              eventDetail?.event_two?.events_date,
                              "yyyy-MM-dd"
                            ).toFormat("MMM dd, yyyy"))}{" "}
                      </span>
                    </div>
                  </div>
                  <div className="col-lg-5 col-md-6">
                    <div className="location-box">
                      <h4> Location </h4>
                      <span>
                        {" "}
                        {eventDetail?.event_one?.location ||
                          eventDetail?.event_two?.location}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="row mt-2 align-items-center">
                  <div className="col-lg-8 col-md-6">
                    <a
                      onClick={handleBookNow}
                      className="btn btn-learnmore"
                      role="button"
                    >
                      {eventPrice === 0 ? "Grab Deal" : "Book Now"}
                    </a>
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
          </div>
        </div>
      </section>

      <section className="about-details">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="heading-sec">About this Event</div>
              <p className="paragraph-wrap">
                {eventDetail?.event_one?.events_about ||
                  eventDetail?.event_two?.events_about}
              </p>
              <div className="heading-sec">Event Highlights</div>
              <p className="paragraph-wrap">
                {eventDetail?.event_one?.events_highlights ||
                  eventDetail?.event_two?.events_highlights}
              </p>
              {/* <ul>
                <li>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry&apos;s
                  standard dummy text.
                </li>
                <li>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry&apos;s
                  standard dummy text.Lorem Ipsum is{" "}
                </li>
                <li>
                  simply dummy text of the printing and typesetting industry.
                  Lorem Ipsum has been the industry&apos;s standard dummy text.
                </li>
                <li>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry&apos;s
                  standard dummy text.
                </li>
                <li>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry&apos;s
                  standard dummy text.
                </li>
              </ul> */}
            </div>
          </div>
        </div>
      </section>

      {Array.isArray(relatedVoopon) && relatedVoopon.length > 0 && (
        <Voopons listData={relatedVoopon} />
      )}
    </>
  );
};

export default ClientComponent;
