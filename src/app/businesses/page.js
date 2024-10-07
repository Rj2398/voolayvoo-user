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

// async function getData() {
//   const resBusinessesList = await fetch(`${BASE_URL}/api/user_business_list_categories`, {
//     method: "POST",
//   });

//   const resultBusinesses = await resBusinessesList.json();

//   const { promoterList, categoryList } = separatePromoterData(
//     resultBusinesses.data
//   );

//   return {
//     categoryList: categoryList,
//     bussinessesList: promoterList,
//   };
// }

async function getData(id) {
  const resCategory = await fetch(`${BASE_URL}/api/user_category_list`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const formData = new FormData();
  formData.append("user_id", id);

  const resBusiness = await fetch(
    `${BASE_URL}/api/user_business_list_categories`,
    {
      method: "POST",
      body: formData,
    }
  );

  const resultCat = await resCategory.json();
  const resBusinessData = await resBusiness.json();
  // console.log(resBusinessData?.data, "hello usejhfjshdj");
  const filteredData = resBusinessData?.data
    ?.filter((item) => item.business_data_show)
    .map((item) => ({
      ...item,
      ...item.business_data_show,
      business_data_show: null,
      outerId: item.id,
    }));
  console.log(filteredData, "filtereddatattatataaatadd ");

  if (resultCat.code != 200 || resBusinessData.code != 200) {
    throw new Error("Failed to fetch data");
  }

  return {
    categoryList: countCategory(resultCat.data, filteredData),
    resBusinessesList: filterEvent(filteredData, resultCat.data),
  };
}

const Businesses = () => {
  // const { categoryList, bussinessesList } = await getData();

  const { userDetails } = useAuth();
  const [data, setData] = useState({
    categoryList: [],
    resBusinessesList: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useLayoutEffect(() => {
    const fetchData = async () => {
      if (!userDetails || !userDetails.user_id) {
        setLoading(false);
        return;
      }

      try {
        const result = await getData(userDetails.user_id);
        setData(result);
      } catch (err) {
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
  // if (error) {
  //   const errorMessage =
  //     typeof error === "object"
  //       ? error.message || JSON.stringify(error)
  //       : error;

  //   return <div>Error: {errorMessage}</div>;
  // }
  // console.log(data, "business data categoryfhsjkhfjkashff");
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
        <h1> Explore Businesses </h1>
        <p>Find Your A-ha!</p>
      </div>
      <ClientComponent
        categoryList={data?.categoryList}
        businessList={data?.resBusinessesList}

        // categoryList={{}}
        // businessList={{}}
      />
    </>
  );
};

export default Businesses;
