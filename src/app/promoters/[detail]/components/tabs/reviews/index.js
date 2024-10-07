"use client";
import React from "react";
import Card from "./Card";
import { useForm } from "react-hook-form";
import { Rating } from "@mui/material";
import { toast } from "react-toastify";
import { useAuth } from "@/app/UserProvider";
import { postFetchDataWithAuth } from "@/fetchData/fetchApi";
import Image from "next/image";

const Reviews = ({ promoterId, ratingData }) => {
  const { handleSubmit, register, setValue, getValues, reset } = useForm();
  const { userDetails } = useAuth();

  console.log(ratingData, "rating data comes form this*******");

  // const searchParams = useSearchParams();
  const onSubmit = (e) => {
    postFeeback();
    async function postFeeback() {
      try {
        const formdata = {
          user_id: userDetails.user_id,
          promoter_id: promoterId,
          ...e,
        };

        const response = await postFetchDataWithAuth({
          data: formdata,
          endpoint: "user_promoter_rating",
          authToken: userDetails.token,
        });
        if (response.success) {
          setValue("over_all_experience", "");
          setValue("how_likely_use_again", "");
          setValue("how_likely_recommend_friend", "");
          setValue("how_likely_use_again", "");
          setValue("how_likely_recommend_friend", "");
          reset();
          toast.success(response.message);
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
    }
  };

  return (
    <>
      <div
        className="tab-pane fade"
        id="reviews"
        role="tabpanel"
        aria-labelledby="reviews-tab"
      >
        <div className="rating-box-details mb-4">
          <div className="rating-points">
            <div className="rating-number">
              {" "}
              {ratingData?.average_total_count_star}
            </div>
            <div className="rating-star">
              {/* <span>
                <img src="../images/star-big.png" alt="" />
              </span>
              <span>
                <img src="../images/star-big.png" alt="" />
              </span>
              <span>
                <img src="../images/star-big.png" alt="" />
              </span>
              <span>
                <img src="../images/star-big.png" alt="" />
              </span>
              <span>
                <img src="../images/star-big-blank.png" alt="" />
              </span> */}
              <Rating
                value={ratingData?.average_total_count_star}
                onChange={(event, newValue) => {}}
                precision={0.5}
                disabled={true}
              />
            </div>
            <p>
              (
              {ratingData?.business_count_user_toatl ??
                ratingData?.promoter_count_user_toatl}
              ) Reviews
            </p>
            {/* <a href="#" data-bs-toggle="modal" data-bs-target="#write-review">
              Write a Review
            </a> */}
          </div>

          <div className="rating-details">
            <div className="rating-flex">
              <div className="rating-star-box">
                <Rating
                  value={ratingData?.how_likely_recommend_friend_calculate}
                  onChange={(event, newValue) => {}}
                  precision={0.5}
                  disabled={true}
                />
                {/* <span>
                  <img src="../images/star-rate.png" alt="" />
                </span>
                <span>
                  <img src="../images/star-rate.png" alt="" />
                </span>
                <span>
                  <img src="../images/star-rate.png" alt="" />
                </span>
                <span>
                  <img src="../images/star-rate.png" alt="" />
                </span>
                <span>
                  <img src="../images/star-rate.png" alt="" />
                </span> */}
              </div>
              <div className="progress-box">
                <div className="progress">
                  <div
                    className="progress-bar"
                    role="progressbar"
                    style={{
                      width: `${
                        ratingData?.how_likely_recommend_friend_calculate * 10
                      }%`,
                    }}
                    aria-valuenow={50}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  ></div>
                </div>
              </div>
              {/* <div className="rat-number"> (80) </div> */}
            </div>
            <div className="rating-flex">
              <div className="rating-star-box">
                <Rating
                  value={ratingData?.how_likely_use_again_calculate}
                  onChange={(event, newValue) => {}}
                  precision={0.5}
                  disabled={true}
                />
                {/* <span>
                  <img src="../images/star-rate.png" alt="" />
                </span>
                <span>
                  <img src="../images/star-rate.png" alt="" />
                </span>
                <span>
                  <img src="../images/star-rate.png" alt="" />
                </span>
                <span>
                  <img src="../images/star-rate.png" alt="" />
                </span>
                <span>
                  <img src="../images/star-rate.png" alt="" />
                </span> */}
              </div>
              <div className="progress-box">
                <div className="progress">
                  <div
                    className="progress-bar"
                    role="progressbar"
                    style={{
                      width: `${
                        ratingData?.how_likely_use_again_calculate * 10
                      }%`,
                    }}
                    aria-valuenow={25}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  ></div>
                </div>
              </div>
              {/* <div className="rat-number"> (30) </div> */}
            </div>
            <div className="rating-flex">
              <div className="rating-star-box">
                <Rating
                  value={ratingData?.knowledge_calculate}
                  onChange={(event, newValue) => {}}
                  precision={0.5}
                  disabled={true}
                />
                {/* <span>
                  <img src="../images/star-rate.png" alt="" />
                </span>
                <span>
                  <img src="../images/star-rate.png" alt="" />
                </span>
                <span>
                  <img src="../images/star-rate.png" alt="" />
                </span>
                <span>
                  <img src="../images/star-rate.png" alt="" />
                </span>
                <span>
                  <img src="../images/star-rate.png" alt="" />
                </span> */}
              </div>
              <div className="progress-box">
                <div className="progress">
                  <div
                    className="progress-bar"
                    role="progressbar"
                    style={{
                      width: `${ratingData?.knowledge_calculate * 10}%`,
                    }}
                    aria-valuenow={0}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  ></div>
                </div>
              </div>
              {/* <div className="rat-number"> (0) </div> */}
            </div>

            <div className="rating-flex">
              <div className="rating-star-box">
                <Rating
                  value={ratingData?.over_all_experience_calculate}
                  onChange={(event, newValue) => {}}
                  precision={0.5}
                  disabled={true}
                />

                {/* <span>
                  <img src="../images/star-rate.png" alt="" />
                </span>
                <span>
                  <img src="../images/star-rate.png" alt="" />
                </span>
                <span>
                  <img src="../images/star-rate.png" alt="" />
                </span>
                <span>
                  <img src="../images/star-rate.png" alt="" />
                </span>
                <span>
                  <img src="../images/star-rate.png" alt="" />
                </span> */}
              </div>
              <div className="progress-box">
                <div className="progress">
                  <div
                    className="progress-bar"
                    role="progressbar"
                    style={{
                      width: `${
                        ratingData?.over_all_experience_calculate * 10
                      }%`,
                    }}
                    aria-valuenow={0}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  ></div>
                </div>
              </div>
              {/* <div className="rat-number"> (0) </div> */}
            </div>
            <div className="rating-flex">
              <div className="rating-star-box">
                <Rating
                  value={ratingData?.professionalism_calculate}
                  onChange={(event, newValue) => {}}
                  precision={0.5}
                  disabled={true}
                />
                {/* <span>
                  <img src="../images/star-rate.png" alt="" />
                </span>
                <span>
                  <img src="../images/star-rate.png" alt="" />
                </span>
                <span>
                  <img src="../images/star-rate.png" alt="" />
                </span>
                <span>
                  <img src="../images/star-rate.png" alt="" />
                </span>
                <span>
                  <img src="../images/star-rate.png" alt="" />
                </span> */}
              </div>
              <div className="progress-box">
                <div className="progress">
                  <div
                    className="progress-bar"
                    role="progressbar"
                    style={{
                      width: `${ratingData?.professionalism_calculate * 10}%`,
                    }}
                    aria-valuenow={0}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  ></div>
                </div>
              </div>
              {/* <div className="rat-number"> (0) </div> */}
            </div>

            <div className="rating-flex">
              <div className="rating-star-box">
                <Rating
                  value={ratingData?.service_time_quality_calculate}
                  onChange={(event, newValue) => {}}
                  precision={0.5}
                  disabled={true}
                />
                {/* <span>
                  <img src="../images/star-rate.png" alt="" />
                </span>
                <span>
                  <img src="../images/star-rate.png" alt="" />
                </span>
                <span>
                  <img src="../images/star-rate.png" alt="" />
                </span>
                <span>
                  <img src="../images/star-rate.png" alt="" />
                </span>
                <span>
                  <img src="../images/star-rate.png" alt="" />
                </span> */}
              </div>
              <div className="progress-box">
                <div className="progress">
                  <div
                    className="progress-bar"
                    role="progressbar"
                    style={{
                      width: `${
                        ratingData?.service_time_quality_calculate * 10
                      }%`,
                    }}
                    aria-valuenow={0}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  ></div>
                </div>
              </div>
              {/* <div className="rat-number"> (0) </div> */}
            </div>
          </div>
        </div>

        <Card DataMap={ratingData?.user_data_comment} />
        {/* WRITE-A-REVIEW-POPUP */}
        <div
          className="modal fade"
          id="write-review"
          tabIndex={-1}
          aria-labelledby="buy-voopon"
          aria-hidden="true"
        >
          <div className="modal-dialog card-width">
            <div className="modal-content">
              <div className="modal-header pb-4">
                <button
                  type="button"
                  className="close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">
                    <img src="/images/cross.svg" alt="" />
                  </span>
                </button>
              </div>
              <div className="modal-body pt-0">
                <div className="write-review-in">
                  <h1>How was your Experience?</h1>
                  <div className="write-review-image">
                    <img src="/images/review-pop.svg" alt="" />
                  </div>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="full-stars-example-two">
                      <h4>Over All Experience</h4>
                      <div className="rating-group">
                        <Rating
                          size="large"
                          defaultValue={0}
                          name="over_all_experience"
                          value={getValues("over_all_experience")}
                          onChange={(event, newValue) => {
                            setValue("over_all_experience", newValue);
                          }}
                          // {...register("over_all_experience")}
                        />
                      </div>
                    </div>
                    <div className="full-stars-example-two">
                      <h4>How likely are you to use us again?</h4>
                      <div className="rating-group">
                        <Rating
                          size="large"
                          defaultValue={0}
                          name="how_likely_use_again"
                          value={getValues("how_likely_use_again")}
                          onChange={(event, newValue) => {
                            setValue("how_likely_use_again", newValue);
                          }}
                        />
                      </div>
                    </div>
                    <div className="full-stars-example-two">
                      <h4>How likely are you to recommend us?</h4>
                      <div className="rating-group">
                        <Rating
                          size="large"
                          defaultValue={0}
                          name="how_likely_recommend_friend"
                          value={getValues("how_likely_recommend_friend")}
                          onChange={(event, newValue) => {
                            setValue("how_likely_recommend_friend", newValue);
                          }}
                        />
                      </div>
                    </div>
                    <div className="full-stars-example-two">
                      <h4>Are we engaged in work as professionals?</h4>
                      <div className="rating-group">
                        <Rating
                          size="large"
                          defaultValue={0}
                          name="professionalism"
                          value={getValues("professionalism")}
                          onChange={(event, newValue) => {
                            setValue("professionalism", newValue);
                          }}
                        />
                      </div>
                    </div>
                    <div className="full-stars-example-two">
                      <h4>Are we doing our best work?</h4>
                      <div className="rating-group">
                        <Rating
                          size="large"
                          defaultValue={0}
                          name="knowledge"
                          value={getValues("knowledge")}
                          onChange={(event, newValue) => {
                            setValue("knowledge", newValue);
                          }}
                        />
                      </div>
                    </div>
                    <div className="full-stars-example-two">
                      <h4>Quality of Event, Product or Service</h4>
                      <div className="rating-group">
                        <Rating
                          size="large"
                          defaultValue={0}
                          name="service_time_quality"
                          value={getValues("service_time_quality")}
                          onChange={(event, newValue) => {
                            setValue("service_time_quality", newValue);
                          }}
                        />
                      </div>
                    </div>
                    <textarea
                      placeholder="Any Additional Notes"
                      defaultValue={""}
                      {...register("description")}
                    />
                    <input type="submit" defaultValue="SUBMIT" />
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Reviews;
