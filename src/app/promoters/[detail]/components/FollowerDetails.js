"use client";
import { useAuth } from "@/app/UserProvider";
import { BASE_URL } from "@/constant/constant";
import { postData, postFetchDataWithAuth } from "@/fetchData/fetchApi";
import axios from "axios";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function FollowerDetails({ promoter_id }) {
  const { isAuthenticated, userDetails } = useAuth();
  const [followerData, setFollowerData] = useState({});

  const [reload, setReload] = useState(false);
  const [checkedFollow, setCheckedFollow] = useState(null);

  const router = useRouter();
  let pathName = usePathname();
  //

  useEffect(() => {
    getFollowStatus();
  }, [reload]);

  const getFollowStatus = async () => {
    const formData = new FormData();
    formData.append("user_id", userDetails.user_id);

    formData.append("promoter_id", promoter_id);

    try {
      const response = await axios.post(
        `${BASE_URL}/api/user_promoter_follow_status_web`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${userDetails?.token}`,
          },
        }
      );

      if (response?.data) setCheckedFollow(response?.data?.data?.follow_status);
      setReload((prev) => !prev);
      // setCheckStatus(response?.data?.data);
    } catch (error) {
      // console.error('Error:', error.response ? error.response.data : error.message);
    }
  };

  //

  //
  // useEffect(() => {
  //   async function fetchData() {
  //     try {
  //       const response = await postData({
  //         data: {
  //           user_id: userDetails?.user_id,
  //           promoter_id: promoter_id,
  //         },
  //         endpoint: "user_follow_get",
  //       });

  //       if (response) {
  //         let newData = {};
  //         if (typeof response[0] !== "object") {
  //           newData["noOfFollower"] = response[0];
  //         } else {
  //           newData = { ...response[0] };
  //           newData["noOfFollower"] = response[1];
  //         }

  //         setFollowerData(newData);
  //       }
  //     } catch (error) {
  //       toast.error(`${error}`);
  //     }
  //   }
  //   if (userDetails?.user_id && promoter_id) {
  //     fetchData();
  //   }
  //   // eslint-disable-next-line
  // }, [userDetails?.user_id, reload]);

  // const handleUnfollow = async () => {
  //   try {
  //     const formdata = {
  //       promoter_id: promoter_id,
  //       follow_status: 0,
  //       user_id: userDetails.user_id,
  //     };
  //     const response = await postFetchDataWithAuth({
  //       data: formdata,
  //       endpoint: "user_follower_promoter",
  //       authToken: userDetails.token,
  //     });

  //     if (response.success) {
  //       setReload(!reload);
  //     }
  //   } catch (error: any) {
  //     const errorMessage =
  //       typeof error === "string"
  //         ? `${error}`
  //         : error?.message
  //         ? error?.message
  //         : `${error}`;
  //     toast.error(errorMessage);
  //   }
  // };
  // const handlefollow = async () => {
  //   if (!isAuthenticated) {
  //     router.push(`/login?lastPath=${pathName}`);
  //   } else if (isAuthenticated) {
  //     try {
  //       const formdata = {
  //         promoter_id: promoter_id,
  //         follow_status: 1,
  //         user_id: userDetails.user_id,
  //       };
  //       const response = await postFetchDataWithAuth({
  //         data: formdata,
  //         endpoint: "user_follower_promoter",
  //         authToken: userDetails.token,
  //       });

  //       if (response.success) {
  //         setReload(!reload);
  //       }
  //     } catch (error: any) {
  //       const errorMessage =
  //         typeof error === "string"
  //           ? `${error}`
  //           : error?.message
  //           ? error?.message
  //           : `${error}`;
  //       toast.error(errorMessage);
  //     }
  //   }
  // };

  const followByUsers = async (id) => {
    const formData = new FormData();
    formData.append("user_id", userDetails.user_id);

    formData.append("promoter_id", promoter_id);
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
      // setCheckedFollow((pre) => !pre);
      setReload((prev) => !prev);
      // setCheckStatus(response?.data?.data);
    } catch (error) {
      // console.error('Error:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="flowers">
      <span>
        <Image width={33} height={20} src="/images/followers-icon.png" alt="" />{" "}
        {}Followers
      </span>

      <span>
        {checkedFollow == "1" ? (
          <a
            // href="#"
            className="followers-btn"
            onClick={() => followByUsers(0)}
          >
            Unfollow
          </a>
        ) : (
          <a
            // href="#"
            className="followers-btn"
            onClick={() => followByUsers(1)}
          >
            Follow
          </a>
        )}
      </span>
    </div>
  );
}
