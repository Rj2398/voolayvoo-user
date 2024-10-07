"use client";
import { useAuth } from "@/app/UserProvider";
import InterestsList from "@/components/Interests/InterestsList";
import { BASE_URL } from "@/constant/constant";
import { useEffect, useState } from "react";

async function getData(user_id) {
  const formData = new FormData();
  formData.append("user_id", user_id);
  const resCategory = await fetch(
    `${BASE_URL}/api/user_category_sub_category_mobile`,
    {
      method: "POST",
      body: formData,
    }
  );

  const resultCat = await resCategory.json();

  const categoryMap = {};

  // resultCat?.data?.forEach((item) => {
  //   if (!categoryMap[item.category_id]) {
  //     categoryMap[item.category_id] = {
  //       category_id: item.category_id,
  //       category_name: item.category_name,
  //       subcategory: [],
  //     };
  //   }
  //   categoryMap[item.category_id].subcategory.push({
  //     sub_category_id: item.sub_category_id,
  //     sub_category_name: item.sub_category_name,
  //   });
  // });

  // Transform the data into categoryMap
  resultCat.data?.forEach((item) => {
    if (!categoryMap[item.id]) {
      categoryMap[item.id] = {
        category_id: item.id,
        category_name: item.category_name,
        like: item.like,
        subcategory: [],
      };
    }
    item.sub_category.forEach((sub) => {
      categoryMap[item.id].subcategory.push({
        sub_category_id: sub.id,
        sub_category_name: sub.sub_category_name,
        like: sub.like,
      });
    });
  });

  if (!resCategory.ok) {
    throw new Error("Failed to fetch data");
  }

  return {
    list: Object.values(categoryMap),
  };
}

const Interests = () => {
  const { userDetails } = useAuth();
  // const { list } = await getData();
  const [data, setData] = useState({ list: [] });

  useEffect(() => {
    const fetchData = async () => {
      if (!userDetails || !userDetails.user_id) {
        return;
      }

      try {
        const result = await getData(userDetails.user_id);
        setData(result);
      } catch (err) {
      } finally {
      }
    };
    fetchData();
  }, [userDetails]);

  return (
    <div className="user-dashboard-data">
      <div className="user-inrest">
        <div className="deals-inner interests-inner p-0">
          <h1 className="text-center mr-0 mb-4">My Interests</h1>
          <InterestsList list={data.list} fullwidth={true} />
        </div>
      </div>
    </div>
  );
};

export default Interests;
