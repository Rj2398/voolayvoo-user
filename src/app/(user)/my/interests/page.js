"use client";
import { useAuth } from "@/app/UserProvider";
import InterestsList from "@/components/Interests/InterestsList";
import { BASE_URL } from "@/constant/constant";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useLocalStorage from "@/constant/useLocalStorage";

async function getData(user_id, token) {
  const formData = new FormData();
  formData.append("user_id", user_id);

  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  const resCategory = await fetch(
    `${BASE_URL}/api/user_category_sub_category_mobile`,
    {
      method: "POST",
      headers,
      body: formData,
    }
  );

  // Check HTTP 401 Unauthorized status
  if (resCategory.status === 401) {
    const error = new Error("Unauthorized");
    error.status = 401;
    throw error;
  }

  const resultCat = await resCategory.json();

  // Check API body code 401
  if (resultCat?.code == 401) {
    const error = new Error("Unauthorized");
    error.status = 401;
    throw error;
  }

  if (!resCategory.ok || resultCat?.code != 200) {
    throw new Error("Failed to fetch data");
  }

  const categoryMap = {};

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
    item.sub_category?.forEach((sub) => {
      categoryMap[item.id].subcategory.push({
        sub_category_id: sub.id,
        sub_category_name: sub.sub_category_name,
        like: sub.like,
      });
    });
  });

  return {
    list: Object.values(categoryMap),
  };
}

const Interests = () => {
  const { userDetails, logout } = useAuth();
  const router = useRouter();
  const [localStorage, setLocalStorage] = useLocalStorage("loginUser", null);
  const [data, setData] = useState({ list: [] });

  const handleUnauthorized = () => {
    if (logout) logout();
    setLocalStorage(null);
    router.push("/auth-users");
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!userDetails || !userDetails.user_id) {
        return;
      }

      try {
        const result = await getData(userDetails.user_id, userDetails?.token);
        setData(result);
      } catch (err) {
        if (err?.status === 401 || err?.message === "Unauthorized") {
          handleUnauthorized();
          return;
        }
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

// "use client";
// import { useAuth } from "@/app/UserProvider";
// import InterestsList from "@/components/Interests/InterestsList";
// import { BASE_URL } from "@/constant/constant";
// import { useEffect, useState } from "react";

// async function getData(user_id) {
//   const formData = new FormData();
//   formData.append("user_id", user_id);
//   const resCategory = await fetch(
//     `${BASE_URL}/api/user_category_sub_category_mobile`,
//     {
//       method: "POST",
//       body: formData,
//     }
//   );

//   const resultCat = await resCategory.json();

//   const categoryMap = {};

//   // resultCat?.data?.forEach((item) => {
//   //   if (!categoryMap[item.category_id]) {
//   //     categoryMap[item.category_id] = {
//   //       category_id: item.category_id,
//   //       category_name: item.category_name,
//   //       subcategory: [],
//   //     };
//   //   }
//   //   categoryMap[item.category_id].subcategory.push({
//   //     sub_category_id: item.sub_category_id,
//   //     sub_category_name: item.sub_category_name,
//   //   });
//   // });

//   // Transform the data into categoryMap
//   resultCat.data?.forEach((item) => {
//     if (!categoryMap[item.id]) {
//       categoryMap[item.id] = {
//         category_id: item.id,
//         category_name: item.category_name,
//         like: item.like,
//         subcategory: [],
//       };
//     }
//     item.sub_category.forEach((sub) => {
//       categoryMap[item.id].subcategory.push({
//         sub_category_id: sub.id,
//         sub_category_name: sub.sub_category_name,
//         like: sub.like,
//       });
//     });
//   });

//   if (!resCategory.ok) {
//     throw new Error("Failed to fetch data");
//   }

//   return {
//     list: Object.values(categoryMap),
//   };
// }

// const Interests = () => {
//   const { userDetails } = useAuth();
//   // const { list } = await getData();
//   const [data, setData] = useState({ list: [] });

//   useEffect(() => {
//     const fetchData = async () => {
//       if (!userDetails || !userDetails.user_id) {
//         return;
//       }

//       try {
//         const result = await getData(userDetails.user_id);
//         setData(result);
//       } catch (err) {
//       } finally {
//       }
//     };
//     fetchData();
//   }, [userDetails]);

//   return (
//     <div className="user-dashboard-data">
//       <div className="user-inrest">
//         <div className="deals-inner interests-inner p-0">
//           <h1 className="text-center mr-0 mb-4">My Interests</h1>
//           <InterestsList list={data.list} fullwidth={true} />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Interests;
