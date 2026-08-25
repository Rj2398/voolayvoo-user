"use client";
import Image from "next/image";
import Tabs from "./components/tabs";
import { BASE_URL } from "@/constant/constant";
import { getFormData } from "@/fetchData/fetchApi";
import { Rating } from "@mui/material";
import FollowerDetails from "./components/FollowerDetails";
import { useAuth } from "@/app/UserProvider";
import { useState, useLayoutEffect } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/custom/Loader";
import useLocalStorage from "@/constant/useLocalStorage";

async function getData(detail, token) {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  const promoterDetailsPromise = fetch(
    `${BASE_URL}/api/user_promoter_details_list`,
    {
      method: "POST",
      headers,
      body: getFormData({ promoter_id: detail }),
    }
  );

  const promoRatingPromise = fetch(
    `${BASE_URL}/api/user_promoter_overall_rating_get`,
    {
      method: "POST",
      headers,
      body: getFormData({ promoter_id: detail }),
    }
  );

  const photosPromise = fetch(`${BASE_URL}/api/user_promoter_photos_get`, {
    method: "POST",
    headers,
    body: getFormData({ promoter_id: detail }),
  });

  const eventsPromise = fetch(`${BASE_URL}/api/user_promoter_event_get`, {
    method: "POST",
    headers,
    body: getFormData({ promoter_id: detail }),
  });

  const voopanPromise = fetch(`${BASE_URL}/api/user_promoter_voopon_list`, {
    method: "POST",
    headers,
    body: getFormData({ promoter_id: detail }),
  });

  const [resPromoter, resPromo_Rating, resphotos, resEvents, resVoopan] =
    await Promise.all([
      promoterDetailsPromise,
      promoRatingPromise,
      photosPromise,
      eventsPromise,
      voopanPromise,
    ]);

  if (
    resPromoter.status === 401 ||
    resPromo_Rating.status === 401 ||
    resphotos.status === 401 ||
    resEvents.status === 401 ||
    resVoopan.status === 401
  ) {
    const error = new Error("Unauthorized");
    error.status = 401;
    throw error;
  }

  const [
    promoterDetails,
    resPromo_RatingRes,
    promoterTabPhoto,
    promoterTabEvents,
    promoterTabVoopan,
  ] = await Promise.all([
    resPromoter.json(),
    resPromo_Rating.json(),
    resphotos.json(),
    resEvents.json(),
    resVoopan.json(),
  ]);

  if (
    promoterDetails?.code == 401 ||
    resPromo_RatingRes?.code == 401 ||
    promoterTabPhoto?.code == 401 ||
    promoterTabEvents?.code == 401 ||
    promoterTabVoopan?.code == 401
  ) {
    const error = new Error("Unauthorized");
    error.status = 401;
    throw error;
  }

  const eventList = [
    ...(promoterTabEvents?.data?.event_data || []),
    ...(promoterTabEvents?.data?.event_data_collaborator || []).map(
      (it) => it.events_data
    ),
  ];

  const voopanList = [
    ...(promoterTabVoopan?.data?.user_voopon_data || []),
    ...(promoterTabVoopan?.data?.user_collaborators_voopon_data || []).map(
      (it) => it?.data_voopon
    ),
  ];

  return {
    promoter_detail: promoterDetails.data?.[0],
    rating_details: {
      promoter_rating: promoterDetails.data?.[1]?.[0] || 0,
      promoter_count: promoterDetails.data?.[1]?.[1] || 0,
    },
    tabs: {
      photos: promoterTabPhoto.data,
      events: eventList,
      voopans: voopanList,
      ratingData: resPromo_RatingRes.data,
    },
  };
}

const Detail = ({ params }) => {
  const detail = params?.detail;
  const { userDetails, logout } = useAuth();
  const router = useRouter();
  const [localStorage, setLocalStorage] = useLocalStorage("loginUser", null);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleUnauthorized = () => {
    if (logout) logout();
    setLocalStorage(null);
    router.push("/auth-users");
  };

  useLayoutEffect(() => {
    const fetchData = async () => {
      if (!detail) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const result = await getData(detail, userDetails?.token);
        setData(result);
      } catch (err) {
        if (err?.status === 401 || err?.message === "Unauthorized") {
          handleUnauthorized();
          return;
        }
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [detail, userDetails]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <Loader loading={loading} />
      </div>
    );
  }

  if (!data || error) {
    return <div>Error loading promoter details or data not found.</div>;
  }

  const { promoter_detail, tabs, rating_details } = data;

  return (
    <>
      <section className="details-page">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="slider-box">
                <Image
                  width={596}
                  height={355}
                  className="w-100"
                  style={{ objectFit: "contain" }}
                  src={
                    promoter_detail?.profile_image
                      ? `${BASE_URL}/${promoter_detail?.profile_image}`
                      : "/images/promoter/promo-details-pic.png"
                  }
                  alt=""
                  id="product-single-image"
                />
              </div>
            </div>
            <div className="col-lg-6">
              <div className="details-text-box-business">
                <div className="busines-logo-hd mb-2">
                  <h1 className="title-capitilize">{promoter_detail?.name}</h1>
                  {promoter_detail?.badge_status === 1 && (
                    <span style={{ marginBottom: "10px" }}>
                      <Image
                        width={32}
                        height={32}
                        src="/images/verifiedLogo.png"
                        alt=""
                      />
                    </span>
                  )}
                </div>
                <p>{promoter_detail?.description}</p>
                <div className="row mb-3">
                  <div className="col-lg-7 col-md-6">
                    <FollowerDetails
                      promoter_id={promoter_detail?.id}
                      follow_count={promoter_detail?.follow_count}
                    />
                  </div>
                  {rating_details?.promoter_rating !== 0 && (
                    <div className="col-lg-5 col-md-6">
                      <div className="rating-box">
                        {" "}
                        {rating_details?.promoter_rating}
                        <Rating
                          name="prmoter-rating"
                          value={rating_details?.promoter_rating}
                          readOnly
                        />
                        {rating_details?.promoter_count}
                      </div>
                    </div>
                  )}
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
                      Website link not available
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
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${promoter_detail?.latitude},${promoter_detail?.longitude}`}
                      >
                        Direction
                      </a>{" "}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Tabs tabs={tabs} promoterId={detail} />
    </>
  );
};

export default Detail;

// // "use server"; // Keep this if you intend to use server components, but `use client` is also present
// "use client";
// import Image from "next/image";
// import Tabs from "./components/tabs";
// import { BASE_URL } from "@/constant/constant";
// import { getFormData } from "@/fetchData/fetchApi"; // Assuming getFormData is a utility
// import { Rating } from "@mui/material";
// import FollowerDetails from "./components/FollowerDetails";

// async function getData(detail) {
//   // Removed userID as it wasn't used
//   try {
//     // Prepare all promises concurrently
//     const promoterDetailsPromise = fetch(
//       `${BASE_URL}/api/user_promoter_details_list`,
//       {
//         method: "POST",
//         body: getFormData({ promoter_id: detail }),
//       }
//     );

//     const promoRatingPromise = fetch(
//       `${BASE_URL}/api/user_promoter_overall_rating_get`,
//       {
//         method: "POST",
//         body: getFormData({ promoter_id: detail }),
//       }
//     );

//     const photosPromise = fetch(`${BASE_URL}/api/user_promoter_photos_get`, {
//       method: "POST",
//       body: getFormData({ promoter_id: detail }),
//     });

//     const eventsPromise = fetch(`${BASE_URL}/api/user_promoter_event_get`, {
//       method: "POST",
//       body: getFormData({ promoter_id: detail }),
//     });

//     const voopanPromise = fetch(`${BASE_URL}/api/user_promoter_voopon_list`, {
//       method: "POST",
//       body: getFormData({ promoter_id: detail }),
//     });

//     // Await all promises simultaneously using Promise.all
//     const [resPromoter, resPromo_Rating, resphotos, resEvents, resVoopan] =
//       await Promise.all([
//         promoterDetailsPromise,
//         promoRatingPromise,
//         photosPromise,
//         eventsPromise,
//         voopanPromise,
//       ]);

//     // Parse all responses concurrently
//     const [
//       promoterDetails,
//       resPromo_RatingRes,
//       promoterTabPhoto,
//       promoterTabEvents,
//       promoterTabVoopan,
//     ] = await Promise.all([
//       resPromoter.json(),
//       resPromo_Rating.json(),
//       resphotos.json(),
//       resEvents.json(),
//       resVoopan.json(),
//     ]);

//     const eventList = [
//       ...(promoterTabEvents?.data?.event_data || []), // Use || [] for safety
//       ...(promoterTabEvents?.data?.event_data_collaborator || []).map(
//         (it) => it.events_data
//       ),
//     ];

//     const voopanList = [
//       ...(promoterTabVoopan?.data?.user_voopon_data || []), // Use || [] for safety
//       ...(promoterTabVoopan?.data?.user_collaborators_voopon_data || []).map(
//         (it) => it?.data_voopon
//       ),
//     ];

//     return {
//       promoter_detail: promoterDetails.data?.[0], // Add optional chaining
//       rating_details: {
//         promoter_rating: promoterDetails.data?.[1]?.[0] || 0,
//         promoter_count: promoterDetails.data?.[1]?.[1] || 0,
//       },
//       tabs: {
//         photos: promoterTabPhoto.data,
//         events: eventList,
//         voopans: voopanList,
//         ratingData: resPromo_RatingRes.data,
//       },
//     };
//   } catch (error) {
//     console.error("Failed to fetch data:", error);
//     return null;
//   }
// }

// const Detail = async ({ params: { detail } }) => {
//   const data = await getData(detail); // Rename to `data` for clarity

//   if (!data) {
//     // Handle case where data fetching failed
//     return <div>Error loading promoter details or data not found.</div>;
//   }

//   const { promoter_detail, tabs, rating_details } = data;
//   // console.log(promoter_detail, "TEST *******");
//   // console.log(rating_details, "promoter_detail"); // This will show in server console if it's a server component

//   return (
//     <>
//       <section className="details-page">
//         <div className="container">
//           <div className="row">
//             <div className="col-lg-6">
//               <div className="slider-box">
//                 <Image
//                   width={596}
//                   height={355}
//                   className="w-100"
//                   style={{ objectFit: "contain" }}
//                   src={
//                     promoter_detail?.profile_image
//                       ? `${BASE_URL}/${promoter_detail?.profile_image}`
//                       : "/images/promoter/promo-details-pic.png"
//                   }
//                   alt=""
//                   id="product-single-image"
//                 />
//               </div>
//             </div>
//             <div className="col-lg-6">
//               <div className="details-text-box-business">
//                 <div className="busines-logo-hd mb-2">
//                   <h1 className="title-capitilize">{promoter_detail?.name}</h1>
//                   {promoter_detail?.badge_status === 1 && (
//                     <span style={{ marginBottom: "10px" }}>
//                       <Image
//                         width={32}
//                         height={32}
//                         src="/images/verifiedLogo.png"
//                         alt=""
//                       />
//                     </span>
//                   )}
//                 </div>
//                 <p>{promoter_detail?.description}</p>
//                 <div className="row mb-3">
//                   <div className="col-lg-7 col-md-6">
//                     {/* {console.log(promoter_detail.follow_count, "*************")} */}
//                     <FollowerDetails
//                       promoter_id={promoter_detail?.id}
//                       follow_count={promoter_detail.follow_count}
//                     />
//                   </div>
//                   {rating_details.promoter_rating !== 0 && (
//                     <div className="col-lg-5 col-md-6">
//                       <div className="rating-box">
//                         {" "}
//                         {rating_details.promoter_rating}
//                         <Rating
//                           name="prmoter-rating"
//                           value={rating_details.promoter_rating}
//                           readOnly
//                         />
//                         {rating_details.promoter_count}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//                 <div className="row mb-4">
//                   <div className="col-lg-7 col-md-6">
//                     <div className="websites">
//                       <Image
//                         width={21}
//                         height={21}
//                         src="/images/world.svg"
//                         alt=""
//                       />{" "}
//                       {/* You had commented this out, leaving it as is. Ensure data?.DetailsData?.businessdetails?.website is available or handle gracefully */}
//                       Website link not available {/* Placeholder */}
//                     </div>
//                   </div>
//                   <div className="col-lg-5 col-md-6">
//                     <div className="direction">
//                       <Image
//                         width={25}
//                         height={25}
//                         src="/images/direction.png"
//                         alt=""
//                       />{" "}
//                       <a
//                         href={`https://www.google.com/maps/dir/?api=1&destination=${promoter_detail?.latitude},${promoter_detail?.longitude}`}
//                       >
//                         Direction
//                       </a>{" "}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       <Tabs tabs={tabs} promoterId={detail} />
//     </>
//   );
// };

// export default Detail;
