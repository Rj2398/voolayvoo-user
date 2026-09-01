"use client";
import Link from "next/link";
import Image from "next/image";
import { BASE_URL } from "@/constant/constant";
import { separatePromoterData } from "@/utils/promoter";
import ClientComponent from "./ClientComponent";
import { countCategory, filterEvent } from "@/utils/eventFunction";
import Loader from "@/components/custom/Loader";
import { useLayoutEffect, useState } from "react";
import { useAuth } from "../UserProvider";
import { useRouter } from "next/navigation";
import useLocalStorage from "@/constant/useLocalStorage";

async function getData(id, token) {
  const resCategory = await fetch(`${BASE_URL}/api/user_category_list`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const formData = new FormData();
  formData.append("user_id", id);

  const resPromoter = await fetch(
    `${BASE_URL}/api/user_business_list_categories`,
    {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  // Check for HTTP 401 Unauthorized status on user_business_list_categories only
  if (resPromoter.status === 401) {
    const error = new Error("Unauthorized");
    error.status = 401;
    throw error;
  }

  const resultCat = await resCategory.json();
  const resPromoterData = await resPromoter.json();

  // Check for API response body code 401 on user_business_list_categories only
  if (resPromoterData?.code == 401) {
    const error = new Error("Unauthorized");
    error.status = 401;
    throw error;
  }

  const filteredData = resPromoterData?.data
    ?.filter((item) => item.promoter_data_show)
    .map((item) => ({
      ...item,
      ...item.promoter_data_show,
      promoter_data_show: null,
      outerId: item.id,
    }));

  if (resultCat.code != 200 || resPromoterData.code != 200) {
    throw new Error("Failed to fetch data");
  }

  return {
    categoryList: countCategory(resultCat.data, filteredData),
    resPromoteresList: filterEvent(filteredData, resultCat.data),
  };
}

const Promoters = () => {
  const { userDetails, logout } = useAuth();
  const [data, setData] = useState({
    categoryList: [],
    resPromoteresList: [],
  });

  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [localStorage, setLocalStorage] = useLocalStorage("loginUser", null);

  useLayoutEffect(() => {
    const fetchData = async () => {
      if (!localStorage) {
        router.push("/auth-users");
        setLoading(false);
        return;
      }
      if (!userDetails || !userDetails.user_id) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const result = await getData(userDetails.user_id, userDetails?.token);
        if (result) {
          setData(result);
          setLoading(false);
        }
      } catch (err) {
        if (err?.status === 401 || err?.message === "Unauthorized") {
          if (logout) logout();
          setLocalStorage(null);
          router.push("/login");
          return;
        }
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userDetails]);

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

  return (
    <>
      <div
        className="inner-banner"
        style={{
          backgroundImage: "url(/images/about-bnr.png)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <h1> Explore Promoters </h1>
        <p>Find Your A-ha!</p>
      </div>
      <ClientComponent
        categoryList={data?.categoryList}
        promoterList={data?.resPromoteresList}
      />
    </>
  );
};

export default Promoters;
