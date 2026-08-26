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

  if (resCategory.status === 401) {
    const error = new Error("Unauthorized");
    error.status = 401;
    throw error;
  }

  const formData = new FormData();
  formData.append("user_id", id);

  const resBusiness = await fetch(
    `${BASE_URL}/api/user_business_list_categories`,
    {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (resBusiness.status === 401) {
    const error = new Error("Unauthorized");
    error.status = 401;
    throw error;
  }

  const resultCat = await resCategory.json();
  const resBusinessData = await resBusiness.json();

  if (resultCat?.code == 401 || resBusinessData?.code == 401) {
    const error = new Error("Unauthorized");
    error.status = 401;
    throw error;
  }

  const filteredData = resBusinessData?.data
    ?.filter((item) => item.business_data_show)
    .map((item) => ({
      ...item,
      ...item.business_data_show,
      business_data_show: null,
      outerId: item.id,
    }));

  if (resultCat.code != 200 || resBusinessData.code != 200) {
    throw new Error("Failed to fetch data");
  }

  return {
    categoryList: countCategory(resultCat.data, filteredData),
    resBusinessesList: filterEvent(filteredData, resultCat.data),
  };
}

const Businesses = () => {
  const { userDetails, logout } = useAuth();
  const [data, setData] = useState({
    categoryList: [],
    resBusinessesList: [],
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
        const result = await getData(userDetails.user_id, userDetails?.token);
        setData(result);
      } catch (err) {
        if (err?.status === 401 || err?.message === "Unauthorized") {
          if (logout) logout();
          setLocalStorage(null);
          router.push("/auth-users");
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
        <h1> Explore Businesses </h1>
        <p>Find Your A-ha!</p>
      </div>
      <ClientComponent
        categoryList={data?.categoryList}
        businessList={data?.resBusinessesList}
      />
    </>
  );
};

export default Businesses;
//

// "use client";
// import Link from "next/link";
// import Image from "next/image";
// import { BASE_URL } from "@/constant/constant";
// import { separatePromoterData } from "@/utils/promoter";
// import ClientComponent from "./ClientComponent";
// import { countCategory, filterEvent } from "@/utils/eventFunction";
// import Loader from "@/components/custom/Loader";
// import { useLayoutEffect, useState } from "react";
// import { useAuth } from "../UserProvider";
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

//   const resBusiness = await fetch(
//     `${BASE_URL}/api/user_business_list_categories`,
//     {
//       method: "POST",
//       body: formData,
//     }
//   );

//   const resultCat = await resCategory.json();
//   const resBusinessData = await resBusiness.json();
//   const filteredData = resBusinessData?.data
//     ?.filter((item) => item.business_data_show)
//     .map((item) => ({
//       ...item,
//       ...item.business_data_show,
//       business_data_show: null,
//       outerId: item.id,
//     }));

//   if (resultCat.code != 200 || resBusinessData.code != 200) {
//     throw new Error("Failed to fetch data");
//   }

//   return {
//     categoryList: countCategory(resultCat.data, filteredData),
//     resBusinessesList: filterEvent(filteredData, resultCat.data),
//   };
// }

// const Businesses = () => {
//   // const { categoryList, bussinessesList } = await getData();

//   const { userDetails } = useAuth();
//   const [data, setData] = useState({
//     categoryList: [],
//     resBusinessesList: [],
//   });
//   const router = useRouter();

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [localStorage, setLocalStorage] = useLocalStorage("loginUser", null);
//   useLayoutEffect(() => {
//     const fetchData = async () => {
//       // if (!userDetails || !userDetails.user_id) {
//       //   router.push("auth-users");
//       //   setLoading(false);
//       //   return;
//       // }

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
//   }, [userDetails]);

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
//         <h1> Explore Businesses </h1>
//         <p>Find Your A-ha!</p>
//       </div>
//       <ClientComponent
//         categoryList={data?.categoryList}
//         businessList={data?.resBusinessesList}

//         // categoryList={{}}
//         // businessList={{}}
//       />
//     </>
//   );
// };

// export default Businesses;
