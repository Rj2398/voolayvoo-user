"use client";

import { useState, useEffect, useLayoutEffect } from "react";
import ClientComponent from "./ClientComponent";
import { BASE_URL } from "@/constant/constant";
import { countCategory, filterEvent } from "@/utils/eventFunction";
import { useAuth } from "@/app/UserProvider";
import Loader from "@/components/custom/Loader";
import { useRouter } from "next/navigation";
import useLocalStorage from "@/constant/useLocalStorage";

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

  // Check for HTTP 401 Unauthorized status
  if (resCategory.status === 401 || resEventList.status === 401) {
    const error = new Error("Unauthorized");
    error.status = 401;
    throw error;
  }

  const resultCat = await resCategory.json();
  const resultEvent = await resEventList.json();

  // Check for API response body code 401
  if (resultCat?.code == 401 || resultEvent?.code == 401) {
    const error = new Error("Unauthorized");
    error.status = 401;
    throw error;
  }

  if (
    !resCategory.ok ||
    !resEventList.ok ||
    resultCat.code != 200 ||
    resultEvent.code != 200
  ) {
    throw new Error("Failed to fetch data");
  }

  return {
    categoryList: countCategory(resultCat.data, resultEvent.data),
    eventList: filterEvent(resultEvent.data, resultCat.data),
  };
}

const Events = () => {
  const { userDetails, logout } = useAuth();
  const [data, setData] = useState({ categoryList: [], eventList: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [localStorage, setLocalStorage] = useLocalStorage("loginUser", null);
  const router = useRouter();

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
        const result = await getData(userDetails.user_id);
        setData(result);
      } catch (err) {
        if (err?.status === 401 || err?.message === "Unauthorized") {
          if (logout) logout();
          setLocalStorage(null);
          router.push("/login");
          return;
        }
        setError(err?.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userDetails, router]);

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

// "use client";

// import { useState, useEffect, useLayoutEffect } from "react";
// import ClientComponent from "./ClientComponent";
// import { BASE_URL } from "@/constant/constant";
// import { countCategory, filterEvent } from "@/utils/eventFunction";
// import { useAuth } from "@/app/UserProvider";
// import Loader from "@/components/custom/Loader";
// import { useRouter } from "next/navigation";
// import useLocalStorage from "@/constant/useLocalStorage";

// async function getData(id) {
//   const resCategory = await fetch(`${BASE_URL}/api/user_category_list`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });

//   const formData = new FormData();
//   formData.append("user_id", id);

//   const resEventList = await fetch(`${BASE_URL}/api/user_event_list`, {
//     method: "POST",
//     body: formData,
//   });

//   const resultCat = await resCategory.json();
//   const resultEvent = await resEventList.json();

//   if (!resCategory.ok || !resEventList.ok) {
//     throw new Error("Failed to fetch data");
//   }

//   return {
//     categoryList: countCategory(resultCat.data, resultEvent.data),
//     eventList: filterEvent(resultEvent.data, resultCat.data),
//   };
// }

// const Events = () => {
//   const { userDetails } = useAuth();
//   const [data, setData] = useState({ categoryList: [], eventList: [] });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [localStorage, setLocalStorage] = useLocalStorage("loginUser", null);
//   const router = useRouter();
//   useLayoutEffect(() => {
//     const fetchData = async () => {
//       if (!localStorage) {
//         router.push("auth-users");
//         setLoading(false);
//         return;
//       }
//       if (!userDetails || !userDetails.user_id) {
//         setLoading(false);
//         return;
//       }

//       try {
//         const result = await getData(userDetails.user_id);
//         setData(result);
//       } catch (err) {
//         setError(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [userDetails, router]);

//   if (loading)
//     return (
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//         }}
//       >
//         <Loader loading={loading} />
//       </div>
//     );
//   if (error) return <div>Error: {error}</div>;

//   return (
//     <ClientComponent
//       categoryList={data?.categoryList}
//       eventList={data?.eventList}
//     />
//   );
// };

// export default Events;
