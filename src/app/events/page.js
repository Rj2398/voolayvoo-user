"use client";

import { useState, useEffect, useLayoutEffect } from "react";
import ClientComponent from "./ClientComponent";
import { BASE_URL } from "@/constant/constant";
import { countCategory, filterEvent } from "@/utils/eventFunction";
import { useAuth } from "@/app/UserProvider";
import Loader from "@/components/custom/Loader";

async function getData(id) {
  const resCategory = await fetch(`${BASE_URL}/api/user_category_list`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const formData = new FormData();
  formData.append("user_id", id);

  const resEventList = await fetch(`${BASE_URL}/api/user_event_list`, {
    method: "POST",
    body: formData,
  });

  const resultCat = await resCategory.json();
  const resultEvent = await resEventList.json();

  if (!resCategory.ok || !resEventList.ok) {
    throw new Error("Failed to fetch data");
  }

  return {
    categoryList: countCategory(resultCat.data, resultEvent.data),
    eventList: filterEvent(resultEvent.data, resultCat.data),
  };
}

const Events = () => {
  const { userDetails } = useAuth();
  const [data, setData] = useState({ categoryList: [], eventList: [] });
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
  if (error) return <div>Error: {error}</div>;

  return (
    <ClientComponent
      categoryList={data?.categoryList}
      eventList={data?.eventList}
    />
  );
};

export default Events;
