"use client";

import React, { useState, useLayoutEffect } from "react";
import ClientComponent from "./ClientComponent";
import { BASE_URL } from "@/constant/constant";
import { countCategory, filterEvent } from "@/utils/eventFunction";
import Loader from "@/components/custom/Loader";
import { useAuth } from "../UserProvider";
import { useRouter } from "next/navigation";
import useLocalStorage from "@/constant/useLocalStorage";

async function getData(token) {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  const resCategory = await fetch(`${BASE_URL}/api/user_category_list`, {
    method: "POST",
  });

  const resVoopanList = await fetch(`${BASE_URL}/api/user_voopon_list_web`, {
    method: "POST",
    headers,
  });

  // Check HTTP 401 Unauthorized status on user_voopon_list_web
  if (resVoopanList.status === 401) {
    const error = new Error("Unauthorized");
    error.status = 401;
    throw error;
  }

  const resultCat = await resCategory.json();
  const resultEvent = await resVoopanList.json();

  // Check API body code 401 on user_voopon_list_web
  if (resultEvent?.code == 401) {
    const error = new Error("Unauthorized");
    error.status = 401;
    throw error;
  }

  if (
    !resCategory.ok ||
    !resVoopanList.ok ||
    resultCat.code != 200 ||
    resultEvent.code != 200
  ) {
    throw new Error("Failed to fetch data");
  }

  const templist = resultEvent.data?.map((item) => ({
    ...item,
    unique_number: item.category_id,
    category_id:
      item?.event_data?.category_id || item?.business_event_data?.category_id,
    subcategory_id:
      item?.event_data?.subcategory_id ||
      item?.business_event_data?.category_id,
  }));

  return {
    categoryList: countCategory(resultCat.data, templist),
    voopanList: filterEvent(templist, resultCat.data),
  };
}

const Voopons = () => {
  const { userDetails, logout } = useAuth();
  const [data, setData] = useState({
    categoryList: [],
    voopanList: [],
  });

  const router = useRouter();
  const [localStorage, setLocalStorage] = useLocalStorage("loginUser", null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleUnauthorized = () => {
    if (logout) logout();
    setLocalStorage(null);
    router.push("/auth-users");
  };

  useLayoutEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getData(userDetails?.token);
        setData(result);
      } catch (err) {
        if (err?.status === 401 || err?.message === "Unauthorized") {
          handleUnauthorized();
          return;
        }
        setError(err?.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userDetails]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          alignSelf: "center",
        }}
      >
        <Loader loading={loading} />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

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
        <div className="back-btn" style={{ cursor: "pointer", width: "100%" }}>
          <a
            to="#"
            onClick={(e) => {
              e.preventDefault();
              window.history.back();
            }}
          >
            <img src="./images/left-arrow.svg" alt="Back" />
          </a>
        </div>
        <h1> Explore Voopons</h1>
        <p>Find Your A-ha!</p>
      </div>
      <ClientComponent
        categoryList={data.categoryList}
        voopanList={data.voopanList}
      />
    </>
  );
};

export default Voopons;

// "use client";

// import React, { useState, useEffect, useLayoutEffect } from "react";
// import ClientComponent from "./ClientComponent";
// import { BASE_URL } from "@/constant/constant";
// import { countCategory, filterEvent } from "@/utils/eventFunction";
// import Loader from "@/components/custom/Loader";
// import { useAuth } from "../UserProvider";
// // import {Link} from "react-router-dom";

// async function getData() {
//   const resCategory = await fetch(`${BASE_URL}/api/user_category_list`, {
//     method: "POST",
//   });

//   const resVoopanList = await fetch(`${BASE_URL}/api/user_voopon_list_web`, {
//     method: "POST",
//   });

//   if (!resCategory.ok || !resVoopanList.ok) {
//     throw new Error("Failed to fetch data");
//   }

//   const resultCat = await resCategory.json();
//   const resultEvent = await resVoopanList.json();
//   const templist = resultEvent.data?.map((item) => ({
//     ...item,
//     unique_number: item.category_id,
//     category_id:
//       item?.event_data?.category_id || item?.business_event_data?.category_id,
//     subcategory_id:
//       item?.event_data?.subcategory_id ||
//       item?.business_event_data?.category_id,
//   }));

//   return {
//     categoryList: countCategory(resultCat.data, templist),
//     voopanList: filterEvent(templist, resultCat.data),
//   };
// }

// const Voopons = () => {
//   const { userDetails } = useAuth();
//   const [data, setData] = useState({
//     categoryList: [],
//     voopanList: [],
//   });

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useLayoutEffect(() => {
//     const fetchData = async () => {
//       // if (!userDetails || !userDetails.user_id) {
//       //   setLoading(false);
//       //   return;
//       // }

//       try {
//         const result = await getData();
//         setData(result);
//       } catch (err) {
//         setError(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [userDetails]);

//   if (loading) {
//     return (
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           alignSelf: "center",
//         }}
//       >
//         <Loader loading={loading} />
//       </div>
//     );
//   }

//   if (error) {
//     return <div>Error: {error}</div>;
//   }

//   return (
//     <>
//       <div
//         className="inner-banner"
//         style={{
//           backgroundImage: "url(/images/about-bnr.png)",
//           backgroundRepeat: "no-repeat",
//           backgroundSize: "cover",
//         }}
//       >
//         <div className="back-btn"  style={{ cursor: "pointer",width:"100%" }}>
//           <a
//             to="#"
//             onClick={(e) => {
//               e.preventDefault();
//               window.history.back();
//             }}
//           >
//             <img src="./images/left-arrow.svg" alt="Back" />
//           </a>
//         </div>
//         <h1> Explore Voopons</h1>
//         <p>Find Your A-ha!</p>
//       </div>
//       <ClientComponent
//         categoryList={data.categoryList}
//         voopanList={data.voopanList}
//       />
//     </>
//   );
// };

// export default Voopons;
