
"use client";

import { use, useEffect, useState } from "react";
import { BASE_URL } from "@/constant/constant";
import { getFormData } from "@/fetchData/fetchApi";
import ClientComponent from "./ClientComponent";
import { useAuth } from "@/app/UserProvider";
import Loader from "@/components/custom/Loader";

async function getData(detail, promoter_id, token) {
  const headers = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Ensure body is properly structured; do NOT set Content-Type header manually for FormData
  const bodyPayload = getFormData({
    event_unique_number: detail,
    ...(promoter_id ? { promoter_id } : {})
  });

  const resEvent = await fetch(`${BASE_URL}/api/user_event_detail_list`, {
    method: "POST",
    headers,
    body: bodyPayload,
  });

  if (!resEvent.ok) {
    throw new Error(`HTTP error! status: ${resEvent.status}`);
  }

  const eventDetails = await resEvent.json();

  return {
    event_detail: eventDetails?.data ?? null,
  };
}

const Detail = ({ params, searchParams }) => {
  // Unwrap params if they are passed as promises (Next.js 15 compatibility)
  const resolvedParams = params instanceof Promise ? use(params) : params;
  const resolvedSearchParams = searchParams instanceof Promise ? use(searchParams) : searchParams;

  const detail = resolvedParams?.detail;
  const promoter_id = resolvedSearchParams?.promoter_id;

  const { userDetails } = useAuth();
  const token = userDetails?.token;

  const [data, setData] = useState({ event_detail: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (!detail) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const result = await getData(detail, promoter_id, token);
        if (isMounted) {
          setData(result);
        }
      } catch (error) {
        console.error("Failed to fetch event detail:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [detail, promoter_id, token]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <Loader loading={loading} />
      </div>
    );
  }

  return <ClientComponent eventDetail={data.event_detail} />;
};

export default Detail;




// "use client";

// import { useEffect, useState } from "react";
// import { BASE_URL } from "@/constant/constant";
// import { getFormData } from "@/fetchData/fetchApi";
// import ClientComponent from "./ClientComponent";
// import { useAuth } from "@/app/UserProvider";
// import Loader from "@/components/custom/Loader";

// async function getData(detail, promoter_id, token) {
//   const headers = token ? { Authorization: `Bearer ${token}` } : {};

//   const resEvent = await fetch(`${BASE_URL}/api/user_event_detail_list`, {
//     method: "POST",
//     headers,
//     body: getFormData({ event_unique_number: detail }),
//   });

//   const eventDetails = await resEvent.json();

//   return {
//     event_detail: eventDetails.data,
//   };
// }

// const Detail = ({ params, searchParams }) => {
//   const detail = params?.detail;
//   const promoter_id = searchParams?.promoter_id;

//   const { userDetails } = useAuth();
//   const [data, setData] = useState({ event_detail: null });
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       if (!detail) {
//         setLoading(false);
//         return;
//       }

//       try {
//         setLoading(true);
//         const result = await getData(detail, promoter_id, userDetails?.token);
//         setData(result);
//       } catch (error) {
//         console.error("Failed to fetch event detail:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [detail, promoter_id, userDetails]);

//   if (loading) {
//     return (
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           minHeight: "50vh",
//         }}
//       >
//         <Loader loading={loading} />
//       </div>
//     );
//   }

//   return <ClientComponent eventDetail={data.event_detail} />;
// };

// export default Detail;

// "use server";

// import { BASE_URL } from "@/constant/constant";
// import { getFormData } from "@/fetchData/fetchApi";
// import ClientComponent from "./ClientComponent";

// async function getData(detail,promoter_id, token) {
//   const resEvent = await fetch(`${BASE_URL}/api/user_event_detail_list`, {
//     method: "POST",
//     // body: getFormData({ event_id: detail, promoter_id }),
//     body: getFormData({ event_unique_number: detail }),
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
//   // 90662978
//   //77130166
//   const eventDetails = await resEvent.json();
//   // const resRelatedVoopon = await fetch(
//   //   `${BASE_URL}/api/user_voopon_list_related_event`,
//   //   {
//   //     method: "POST",
//   //     body: getFormData({ event_id: detail, promoter_id }),
//   //   }
//   // );
//   // const relatedVoopon = await resRelatedVoopon.json();

//   return {
//     event_detail: eventDetails.data,
//     // related_voopon: relatedVoopon?.data,
//   };
// }

// const Detail = async ({
//   params: { detail },
//   searchParams: { promoter_id },
// }) => {
//   const { userDetails, logout } = useAuth();
//   const { event_detail } = await getData(detail, promoter_id, userDetails?.token);

//   return (
//     <ClientComponent
//       eventDetail={event_detail}
//       // relatedVoopon={related_voopon}
//     />
//   );
// };

// export default Detail;
