"use client";
import { useAuth } from "@/app/UserProvider";
import { BASE_URL } from "@/constant/constant";
import axios from "axios";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function FollowerDetails({ promoter_id, follow_count }) {
  const { isAuthenticated, userDetails } = useAuth();
  const [checkedFollow, setCheckedFollow] = useState(null);
  const [count, setCount] = useState(follow_count);
  const router = useRouter();
  let pathName = usePathname();

  // Call getFollowStatus when component mounts and when userDetails or promoter_id changes
  useEffect(() => {
    if (userDetails?.user_id && promoter_id) {
      getFollowStatus();
    }
  }, [userDetails?.user_id, promoter_id]); // Depend on userDetails.user_id and promoter_id

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

      if (response?.data) {
        setCheckedFollow(response?.data?.data?.follow_status);
      }
    } catch (error) {
      console.error(
        "Error fetching follow status:",
        error.response ? error.response.data : error.message
      );
      // Handle error, maybe show a toast
    }
  };

  const followByUsers = async (followStatus) => {
    if (!isAuthenticated) {
      router.push(`/login?lastPath=${pathName}`);
      return;
    }

    const formData = new FormData();
    formData.append("user_id", userDetails.user_id);
    formData.append("promoter_id", promoter_id);
    formData.append("follow_status", followStatus);

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
      // If the API call is successful, update the local state to reflect the change
      // and then re-fetch the status to be sure, or just update based on the action.
      if (response.data.success) {
        // Assuming your API returns a 'success' field
        setCheckedFollow(followStatus.toString()); // Update local state immediately
        if (followStatus === 1) {
          setCount(count + 1);
        } else {
          // Only subtract if count is already above 0
          setCount(count > 0 ? count - 1 : 0);
        }
        // You might want to re-fetch the status after a successful follow/unfollow to ensure consistency
        // getFollowStatus();
      }
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
      toast.error("Failed to update follow status."); // Inform the user
    }
  };

  return (
    <div className="flowers">
      <span>
        <Image width={33} height={20} src="/images/followers-icon.png" alt="" />{" "}
        {count} Followers
      </span>

      <span>
        {checkedFollow === "1" ? ( // Ensure strict comparison
          <a
            className="followers-btn"
            onClick={() => followByUsers(0)} // Pass 0 for unfollow
          >
            Unfollow
          </a>
        ) : (
          <a
            className="followers-btn"
            onClick={() => followByUsers(1)} // Pass 1 for follow
          >
            Follow
          </a>
        )}
      </span>
    </div>
  );
}
