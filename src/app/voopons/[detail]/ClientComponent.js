"use client";
import { Suspense, useState } from "react";
import Image from "next/image";
import Collaborator from "./components/Modal/collaborator";
import Quantity from "@/components/Quantity";
import { DateTime } from "luxon";
import { BASE_URL } from "@/constant/constant";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useAuth } from "@/app/UserProvider";
import { postFetchDataWithAuth } from "@/fetchData/fetchApi";
import { toast } from "react-toastify";
import CheckPayment from "@/components/Modal/CheckPayment";

const ClientComponent = ({ voopon_detail }) => {
  const [open, setOpen] = useState(false);
  const [openCard, setOpenCard] = useState(false);
  const [voopansPrice, setVoopansPrice] = useState(
    voopon_detail?.voopon_one?.voopons_price ||
      voopon_detail?.voopon_two?.voopons_price ||
      0
  );

  const [quantity, setQuantity] = useState(1);
  const { isAuthenticated, userDetails } = useAuth();
  const [reload, setReload] = useState(false);
  const router = useRouter();
  let pathName = usePathname();
  const params = useParams();

  const searchParams = useSearchParams();
  const tempPathName =
    pathName + `?promoter_id=${searchParams.get("promoter_id")}`;
  const handleBookNow = () => {
    if (!isAuthenticated) {
      // router.push(`/login?lastPath=${tempPathName}`);
      router.push(`/auth-users`);
    } else {
      // setOpenCard(true);

      if (voopansPrice === 0) {
        setOpenCard(false);
        freeBuyNow();
      } else if (voopansPrice !== 0) {
        setOpenCard(true);
      }
    }
  };

  const handleQuantity = (qty) => {
    setQuantity(qty);
    setVoopansPrice(
      qty *
        (voopon_detail?.voopon_one?.voopons_price ||
          voopon_detail?.voopon_two?.voopons_price ||
          0)
    );
  };

  const freeBuyNow = async () => {
    try {
      const requestData = {
        user_id: `${userDetails?.user_id}`,
        email: userDetails?.email,
        price: `${voopansPrice}`,
        unique_number: params.detail,
        voopon_quantity: `${quantity}`,
        event_quantity: null,
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
    } catch (error) {}
  };

  const callBack = async (card) => {
    let requestData;
    if (card?.token) {
      requestData = {
        user_id: `${userDetails?.user_id}`,
        email: userDetails?.email,
        price: `${voopansPrice}`,
        unique_number: params.detail,
        voopon_quantity: `${quantity}`,
        event_quantity: null,
        token: card?.token,
      };
    } else if (card?.customer_id) {
      requestData = {
        user_id: `${userDetails?.user_id}`,
        email: userDetails?.email,
        price: `${voopansPrice}`,
        voopon_quantity: `${quantity}`,
        customer_id: card?.customer_id,
        event_quantity: null,
        unique_number: params.detail,
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
  return (
    <>
      <div className="col-lg-6">
        <div className="details-text-box">
          <h2 className="title-capitilize">
            {" "}
            {voopon_detail?.voopon_one?.voopons_name ||
              voopon_detail?.voopon_two?.voopons_name}{" "}
          </h2>
          <p>
            {voopon_detail?.voopon_one?.voopons_description ||
              voopon_detail?.voopon_two?.voopons_description}
          </p>
          {/* 
          {voopon_detail?.voopon_one?.collaborator_data?.length > 0 && (
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
              {/*  */}
          {/* <span>
                {voopon_detail?.voopon_one?.collaborator_data?.length > 0 &&
                  voopon_detail?.voopon_one?.collaborator_data.map(
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

                {voopon_detail?.voopon_one?.collaborator_data?.length > 3 && (
                  <div className="more">
                    {" "}
                    +{voopon_detail?.voopon_one?.collaborator_data?.length -
                      3}{" "}
                  </div>
                )}
              </span> */}
          {/* </div> */}
          {/* )} */}

          {(voopon_detail?.voopon_one?.collaborator_data?.length > 0 ||
            voopon_detail?.voopon_two?.collaborator_data?.length > 0) && (
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
                {[
                  ...(voopon_detail?.voopon_one?.collaborator_data || []),
                  ...(voopon_detail?.voopon_two?.collaborator_data || []),
                ]
                  .slice(0, 3)
                  .map((collaborator, idx) => (
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
                  ))}

                {[
                  ...(voopon_detail?.voopon_one?.collaborator_data || []),
                  ...(voopon_detail?.voopon_two?.collaborator_data || []),
                ].length > 3 && (
                  <div className="more">
                    +
                    {[
                      ...(voopon_detail?.voopon_one?.collaborator_data || []),
                      ...(voopon_detail?.voopon_two?.collaborator_data || []),
                    ].length - 3}
                  </div>
                )}
              </span>
            </div>
          )}

          <Collaborator
            open={open}
            setOpen={setOpen}
            data={
              voopon_detail?.voopon_one?.collaborator_data ||
              voopon_detail?.voopon_two?.collaborator_data
            }
          />
          <CheckPayment
            open={openCard}
            setOpen={setOpenCard}
            callBack={callBack}
            reloadList={reload}
          />

          <div className="row mt-3">
            <div className="col-lg-8 col-md-8">
              <div className="location-box">
                <h4> Location </h4>
                <span>
                  {" "}
                  {voopon_detail?.voopon_one?.location ||
                    voopon_detail?.voopon_two?.location}{" "}
                </span>
              </div>
            </div>
            <div className="col-lg-4 col-md-4">
              <div className="valid-thru">
                <h4> Valid Thru </h4>
                <span>
                  {" "}
                  {voopon_detail?.voopon_one?.voopons_valid_thru ||
                    (voopon_detail?.voopon_two?.voopons_valid_thru &&
                      DateTime.fromFormat(
                        voopon_detail?.voopon_one?.voopons_valid_thru ||
                          voopon_detail?.voopon_two?.voopons_valid_thru,
                        "yyyy-MM-dd"
                      ).toFormat("MMM dd, yyyy"))}
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
                    {Number(voopansPrice) == 0
                      ? "Free"
                      : "$" + voopansPrice}{" "}
                  </span>
                </h4>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="quantity">
                <h4> Quantity:</h4>
                <Quantity
                  limit={Number(
                    // voopon_detail?.event_one?.buyer_per_voopons ||
                    //   voopon_detail?.event_two?.buyer_per_voopons ||
                    100
                  )}
                  updateQuantity={handleQuantity}
                />
              </div>
            </div>
          </div>
          <div className="row mt-2 align-items-center">
            <div className="col-lg-8 col-md-6">
              <a
                onClick={handleBookNow}
                className="btn btn-learnmore"
                // href="#"
                role="button"
              >
                {Number(voopansPrice) == 0 ? "Grab Deal" : "Buy Now"}
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
                    <a href="https://www.x.com" target="_blank">
                      <Image
                        width={24}
                        height={24}
                        src="/images/social-icon-1.svg"
                        alt="images"
                      />
                    </a>
                  </span>
                  <span>
                    <a href="https://www.whatsapp.com/" target="_blank">
                      <Image
                        width={24}
                        height={24}
                        src="/images/social-icon-2.svg"
                        alt="images"
                      />
                    </a>
                  </span>
                  <span>
                    <a href="https://www.instagram.com" target="_blank">
                      <Image
                        width={24}
                        height={24}
                        src="/images/social-icon-3.svg"
                        alt="images"
                      />
                    </a>
                  </span>
                  <span>
                    <a href="https://www.facebook.com" target="_blank">
                      <Image
                        width={24}
                        height={24}
                        src="/images/social-icon-4.svg"
                        alt="images"
                      />
                    </a>
                  </span>
                  <span>
                    <a href="https://www.snapchat.com/" target="_blank">
                      <Image
                        width={24}
                        height={24}
                        src="/images/social-icon-5.svg"
                        alt="images"
                      />
                    </a>
                  </span>
                  <span>
                    <a href="https://www.linkedin.com/" target="_blank">
                      <Image
                        width={24}
                        height={24}
                        src="/images/social-icon-6.svg"
                        alt="images"
                      />
                    </a>
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
