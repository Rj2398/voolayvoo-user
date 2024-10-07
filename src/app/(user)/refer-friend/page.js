"use client";
import { useAuth } from "@/app/UserProvider";
import ShareReferral from "@/components/Modal/ShareReferral";
import { postFetchDataWithAuth } from "@/fetchData/fetchApi";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ReferFriend = () => {
  const { isAuthenticated, userDetails } = useAuth();
  const [loading, setLoading] = useState(true);
  const [referralCode, setReferralData] = useState({});
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (isAuthenticated) {
      fetchReferCode();
    }
  }, [isAuthenticated]);
  const fetchReferCode = async () => {
    setLoading(true);
    try {
      const response = await postFetchDataWithAuth({
        data: { user_id: userDetails.user_id },
        endpoint: "user_referral_code_get",
        authToken: userDetails.token,
      });

      if (response?.success) {
        setReferralData(response?.data?.[0]);
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
    } finally {
      setLoading(false);
    }
  };

  function copyText(e) {
    e.preventDefault();
    navigator.clipboard.writeText(referralCode?.referral_code);
    toast.info("Refer Friend code copy");
  }
  const handleReferralFriend = (e) => {
    e.preventDefault();
    setOpen(true);
  };
  return (
    <>
      <div className="user-dashboard-data">
        <div className="user-my-favorites">
          <h1>Refer a Friend</h1>
        </div>
        <div className="user-refer-wrap">
          <div className="user-refer-inner">
            <h1>How it works</h1>
            <ul>
              <li>
                Invite your friends, just share your link to download the App.
              </li>
              <li>Earn Voopons.</li>
              <li>Congratulations! Voopon is on its way.</li>
              <li>Lorem Ipsum is simply dummy text.</li>
              <li>Lorem Ipsum is simply dummy text.</li>
              <li>Lorem Ipsum is simply dummy text.</li>
            </ul>
            <h1>Points Earned</h1>
            <p>
              {referralCode?.referral_point_earn || 0}/
              {referralCode?.referral_point_total}
            </p>
            <meter
              id="disk_d"
              value={
                Number(referralCode?.referral_point_earn) /
                Number(referralCode?.referral_point_total)
              }
            >
              {/* 50% */}
            </meter>
            <p>
              <span>
                You&apos;re only{" "}
                {referralCode?.referral_point_total -
                  referralCode?.referral_point_earn}{" "}
                points away from receiving an amazing voopon.
              </span>
            </p>
            <p>
              Points expire 12 months after your most recent <br /> transaction
              on 04/08/2024.
            </p>
          </div>
          <div className="user-refer-right">
            <Image
              width={321}
              height={308}
              src="/images/user-dashboard/refer-friend/side-image.svg"
              alt=""
            />
          </div>
          <div className="user-refer-btn">
            <a href="#" onClick={handleReferralFriend}>
              <Image
                width={15}
                height={16}
                src="/images/share-white.svg"
                alt=""
              />
              Refer Friend
            </a>
            <a href="#" onClick={copyText}>
              <Image
                width={20}
                height={23}
                src="/images/user-dashboard/refer-friend/copy.svg"
                alt=""
              />
            </a>
          </div>
          <ShareReferral
            open={open}
            setOpen={setOpen}
            code={referralCode?.referral_code}
          />
        </div>
      </div>
    </>
  );
};

export default ReferFriend;
