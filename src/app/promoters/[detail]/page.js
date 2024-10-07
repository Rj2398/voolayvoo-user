"use server";
import Image from "next/image";
import Tabs from "./components/tabs";
import { BASE_URL } from "@/constant/constant";
import { getFormData } from "@/fetchData/fetchApi";
import { Rating } from "@mui/material";
import FollowerDetails from "./components/FollowerDetails";
async function getData(detail, userID) {
  try {
    const resPromoter = await fetch(
      `${BASE_URL}/api/user_promoter_details_list`,
      {
        method: "POST",
        body: getFormData({ promoter_id: detail }),
      }
    );

    //
    const resPromo_Rating = await fetch(
      `${BASE_URL}/api/user_promoter_overall_rating_get`,
      {
        method: "POST",
        body: getFormData({ promoter_id: detail }),
      }
    );

    //
    const resphotos = await fetch(`${BASE_URL}/api/user_promoter_photos_get`, {
      method: "POST",
      body: getFormData({ promoter_id: detail }),
    });
    const resEvents = await fetch(`${BASE_URL}/api/user_promoter_event_get`, {
      method: "POST",
      body: getFormData({ promoter_id: detail }),
    });
    const resVoopan = await fetch(`${BASE_URL}/api/user_promoter_voopon_list`, {
      method: "POST",
      body: getFormData({ promoter_id: detail }),
    });

    const resPromo_RatingRes = await resPromo_Rating.json();
    console.log(resPromo_RatingRes, "res data of promoter data");

    const promoterDetails = await resPromoter.json();
    const promoterTabEvents = await resEvents.json();
    const promoterTabPhoto = await resphotos.json();
    const promoterTabVoopan = await resVoopan.json();
    const eventList = [
      ...promoterTabEvents?.data?.event_data,
      ...promoterTabEvents?.data?.event_data_collaborator.map(
        (it) => it.events_data
      ),
    ];

    const voopanList = [
      ...promoterTabVoopan?.data?.user_voopon_data,
      ...promoterTabVoopan?.data?.user_collaborators_voopon_data.map(
        (it) => it?.data_voopon
      ),
    ];
    return {
      promoter_detail: promoterDetails.data[0],
      // check_follow_status: promoterDetails,

      rating_details: {
        promoter_rating: promoterDetails.data?.[1]?.[0] || 0,
        promoter_count: promoterDetails.data?.[1]?.[1] | 0,
      },
      tabs: {
        photos: promoterTabPhoto.data,
        events: eventList,
        voopans: voopanList,
        ratingData: resPromo_RatingRes.data,
      },
    };
  } catch (error) {
    console.error("Failed to fetch data:", error);
    // Handle the error appropriately, maybe return a default value or rethrow
    return null;
  }
}
const Detail = async ({ params: { detail } }) => {
  const { promoter_detail, tabs, rating_details } = await getData(detail);
  // const followStatus = check_follow_status?.data[2]?.follow_status;
  // console.log(check_follow_status, "shdfjkhasjkdfhshdfsdjk");

  // console.log(followStatus, "rajan malakar");

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
                  {/* <span>
                    <Image
                      width={58}
                      height={56}
                      src="/images/business-logo.png"
                      alt=""
                    />
                  </span> */}
                  <h1 className="title-capitilize">{promoter_detail?.name}</h1>
                </div>
                <p>{promoter_detail?.description}</p>
                <div className="row mb-3">
                  <div className="col-lg-7 col-md-6">
                    <FollowerDetails
                      promoter_id={promoter_detail?.id}
                      // followStatus={followStatus}
                    />
                  </div>
                  {rating_details.promoter_rating !== 0 && (
                    <div className="col-lg-5 col-md-6">
                      <div className="rating-box">
                        {" "}
                        {rating_details.promoter_rating}
                        <Rating
                          name="prmoter-rating"
                          value={rating_details.promoter_rating}
                          readOnly
                        />
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
                        {rating_details.promoter_count}
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
                      <a href="#">www.Lobsterdogesfoodtruck.com</a>
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

      <Tabs tabs={tabs} promoterId={detail} />
    </>
  );
};

export default Detail;
