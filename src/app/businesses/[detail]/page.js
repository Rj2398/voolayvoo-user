"use client";
import Image from "next/image";
import Tabs from "@/app/promoters/[detail]/components/tabs";
import { BASE_URL } from "@/constant/constant";
import { countCategory, filterEvent } from "@/utils/eventFunction";
import { useAuth } from "@/app/UserProvider";
import { useLayoutEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Loader from "@/components/custom/Loader";
import axios from "axios";
import { Button } from "@mui/material";
import path from "path";

async function getData(id, user_id) {
  const formData = new FormData();
  formData.append("business_id", id);
  formData.append("user_id", user_id);

  const resDetails = await fetch(
    `${BASE_URL}/api/business_details_profile_web`,
    {
      method: "POST",
      body: formData,
    }
  );

  const resEvent = await fetch(`${BASE_URL}/api/business_event_get`, {
    method: "POST",
    body: formData,
  });

  const resVoopons = await fetch(`${BASE_URL}/api/business_voopon_date_get`, {
    method: "POST",
    body: formData,
  });

  const resAllPhotos = await fetch(
    `${BASE_URL}/api/business_collaborator_photos_all`,
    {
      method: "POST",
      body: formData,
    }
  );

  // rating api for business

  const resRating = await fetch(
    `${BASE_URL}/api/user_business_overall_rating_get`,
    {
      method: "POST",
      body: formData,
    }
  );

  const resBusinessRating = await resRating.json();
  console.log(resBusinessRating, "res respond draashfjkhsdk");

  const resultEvent = await resEvent.json();
  const reslutVoopons = await resVoopons.json();
  const resultAllPhotos = await resAllPhotos.json();
  const resultDetails = await resDetails.json();
  const detail = resultDetails?.data;

  // const  resultDetailsData= resDetails.data;
  const { data } = resultAllPhotos;

  // Assuming response.data is the object containing your data
  const {
    event_data,
    event_data_collaborator_both,
    promoter_collaboratore_event_data_get,
    business_promoter_event_data_get,
  } = resultEvent.data;

  // Merging all arrays into one
  const mergedEventData = [
    ...business_promoter_event_data_get,
    ...promoter_collaboratore_event_data_get,
    ...event_data_collaborator_both,
    ...event_data,
  ];
  const {
    useralldeatils,
    useralldeatils_1,
    useralldeatils_2,
    useralldeatils_3,
  } = reslutVoopons.data;

  // Merging all arrays into one
  const mergedVooponsData = [
    ...useralldeatils,
    ...useralldeatils_1,
    ...useralldeatils_2,
    ...useralldeatils_3,
  ];

  if (
    resultEvent.code != 200 ||
    reslutVoopons.code != 200 ||
    resultAllPhotos.code != 200
  ) {
    throw new Error("Failed to fetch data");
  }

  return {
    EventList: mergedEventData,
    VooponsList: mergedVooponsData,
    AllPhotosList: data,
    DetailsData: detail,
    BusinessRatingResponse: resBusinessRating.data,
  };
}

const Detail = () => {
  const { userDetails, isAuthenticated } = useAuth();
  const router = useRouter();

  //

  const searchParams = useSearchParams();
  let pathName = usePathname();

  const tempPathName =
    pathName + `?business_id=${searchParams.get("business_id")}`;
  console.log(tempPathName, "pathe nameeeeeeeeeeeee");
  //

  const business_id = searchParams.get("business_id");

  const [data, setData] = useState({
    EventList: [],
    VooponsList: [],
    AllPhotosList: [],
    DetailsData: null,
    BusinessRatingResponse: null,
  });
  // console.log(data?.AllPhotosList.length, "AllPhotosList");
  // console.log(data?.VooponsList.length, "VooponsList");

  console.log(data?.BusinessRatingResponse, "ratingData)()()()()(");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [checkFollow, setCheckedFollow] = useState(false);
  // code for follow

  const followByUsers = async (id) => {
    const formData = new FormData();
    formData.append("user_id", userDetails.user_id);

    formData.append("business_id", business_id);
    formData.append("follow_status", id);

    try {
      const response = await axios.post(
        `${BASE_URL}/api/auth/user_follower_promoter_business`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${userDetails?.token}`,
          },
        }
      );
      console.log("Response:11121212121", response.data);
      setCheckedFollow((pre) => !pre);
      // setCheckStatus(response?.data?.data);
    } catch (error) {
      // console.error('Error:', error.response ? error.response.data : error.message);
    }
  };

  //code for follow
  useLayoutEffect(() => {
    const fetchData = async () => {
      if (!userDetails || !userDetails.user_id) {
        setLoading(false);
        return;
      }

      try {
        const result = await getData(business_id, userDetails.user_id);
        console.log(result, "&&&&&&&&&&&&&&&");

        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userDetails, business_id, checkFollow]);

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Loader loading={loading} />
      </div>
    );

  const tabs = {
    events: data?.EventList, // The event data
    voopans: data?.VooponsList, // The voopon data
    photos: data?.AllPhotosList, // The photos data
    ratingData: data?.BusinessRatingResponse,
  };

  const totalRating = data?.DetailsData?.rating_data?.total_rating || 0;
  const maxRating = 5; // Assuming the rating is out of 5

  // Generate filled stars
  const filledStars = Array.from({ length: totalRating }, (_, index) => (
    <span key={`filled-star-${index}`}>
      <Image
        width={27}
        height={25}
        src="/images/star-rate.png"
        alt={`Star ${index + 1}`}
      />
    </span>
  ));

  // Generate blank stars
  const blankStars = Array.from(
    { length: maxRating - totalRating },
    (_, index) => (
      <span key={`blank-star-${index}`}>
        <Image
          width={27}
          height={25}
          src="/images/star-rate-blank.png"
          alt={`Blank Star ${index + 1}`}
        />
      </span>
    )
  );

  return (
    <>
      <section className="details-page">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="slider-box">
                <Image
                  width={596}
                  height={315}
                  className="w-100"
                  src={
                    data?.DetailsData?.businessdetails !== null
                      ? `${BASE_URL}/${data.DetailsData?.businessdetails?.profile_image}`
                      : "/images/banners/slide1.png"
                  }
                  alt=""
                  id="product-main-image"
                />
                {/* <div
                  id="pro-slider"
                  className="product-image-slider owl-carousel"
                >
                  <img
                    src="../images/banners/slide1.png"
                    alt=""
                    className="image-list image-list-bdr w-100"
                  />
                  <img
                    src="../images/banners/slide2.png"
                    alt=""
                    className="image-list w-100"
                  />
                  <img
                    src="../images/banners/slide3.png"
                    alt=""
                    className="image-list w-100"
                  />
                  <img
                    src="../images/banners/slide1.png"
                    alt=""
                    className="image-list w-100"
                  />
                  <img
                    src="../images/banners/slide2.png"
                    alt=""
                    className="image-list w-100"
                  />
                  <img
                    src="../images/banners/slide3.png"
                    alt=""
                    className="image-list w-100"
                  />
                </div> */}
              </div>
            </div>
            <div className="col-lg-6">
              <div className="details-text-box-business">
                <div className="busines-logo-hd mb-2">
                  <span>
                    <Image
                      width={58}
                      height={56}
                      src="/images/business-logo.png"
                      alt=""
                    />
                  </span>
                  <h1>{data?.DetailsData?.businessdetails?.name} </h1>
                </div>
                <p>{data?.DetailsData?.businessdetails?.description}</p>
                <div className="row mb-3">
                  <div className="col-lg-7 col-md-6">
                    <div className="flowers">
                      <span>
                        <Image
                          width={33}
                          height={20}
                          src="/images/followers-icon.png"
                          alt=""
                        />{" "}
                        {data?.DetailsData?.followers_count} Followers
                      </span>

                      {data?.DetailsData?.follow_status?.follow_status ==
                      "1" ? (
                        <span>
                          <a
                            // href="#"
                            // className="followers-btn"
                            className="followers-btn"
                            onClick={() => {
                              if (!isAuthenticated) {
                                // router.push("/login");
                                router.push(`/login?lastPath=${tempPathName}`);
                              } else {
                                followByUsers(0);
                              }
                            }}
                          >
                            Unfollow
                          </a>
                        </span>
                      ) : (
                        <span>
                          <a
                            // href="#"
                            // className="followers-btn"
                            className="followers-btn"
                            onClick={() => {
                              if (!isAuthenticated) {
                                // router.push("/login");
                                router.push(`/login?lastPath=${tempPathName}`);
                              } else {
                                followByUsers(1);
                              }
                            }}
                          >
                            Follow
                          </a>
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-5 col-md-6">
                    <div className="rating-box">
                      {" "}
                      {data?.DetailsData?.rating_data?.total_rating}
                      {filledStars}
                      {blankStars}
                      {/* <span>
                        <Image
                          width={27}
                          height={25}
                          src="/images/star-rate.png"
                          alt=""
                        />
                      </span>
                      <span>
                        <Image
                          width={27}
                          height={25}
                          src="/images/star-rate.png"
                          alt=""
                        />
                      </span>
                      <span>
                        <Image
                          width={27}
                          height={25}
                          src="/images/star-rate.png"
                          alt=""
                        />
                      </span>
                      <span>
                        <Image
                          width={27}
                          height={25}
                          src="/images/star-rate.png"
                          alt=""
                        />
                      </span>
                      <span>
                        <Image
                          width={27}
                          height={25}
                          src="/images/star-rate-blank.png"
                          alt=""
                        />
                      </span> */}
                      {data?.DetailsData?.rating_data?.business_count}
                    </div>
                  </div>
                </div>
                <div className="row mb-4">
                  <div className="col-lg-7 col-md-6">
                    <div className="websites">
                      <Image
                        width={21}
                        height={21}
                        src="/images/world.svg"
                        alt=""
                      />{" "}
                      {/* <a href="#">
                        {data?.DetailsData?.businessdetails?.website}
                      </a>{" "} */}
                      <a
                        href={
                          data?.DetailsData?.businessdetails?.website
                            ? `https://${data?.DetailsData?.businessdetails?.website}`
                            : "#"
                        }
                        target={
                          data?.DetailsData?.businessdetails?.website
                            ? "_blank"
                            : ""
                        }
                        rel={
                          data?.DetailsData?.businessdetails?.website
                            ? "noopener noreferrer"
                            : ""
                        }
                      >
                        {data?.DetailsData?.businessdetails?.website ||
                          "Website link not available"}
                      </a>
                    </div>
                  </div>
                  <div className="col-lg-5 col-md-6">
                    <div className="direction">
                      <Image
                        width={25}
                        height={25}
                        src="/images/direction.png"
                        alt=""
                      />{" "}
                      <a href="#">Direction</a>{" "}
                      <p> {data?.DetailsData?.businessdetails?.location}</p>
                    </div>
                  </div>
                </div>
                {/* <div className="row mb-3">
                  <div className="col-lg-7 col-md-6">
                    <div className="cate-subcat">
                      <b> Category: </b> Lorem Ipsum
                    </div>
                  </div>
                  <div className="col-lg-5 col-md-6">
                    <div className="cate-subcat">
                      <b> Sub-Category: </b>Lorem Ipsum
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Tabs tabs={tabs} promoterId={0} />
    </>
  );
};

export default Detail;
