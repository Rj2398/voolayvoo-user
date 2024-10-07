// "use client";

// import { useAuth } from "@/app/UserProvider";
// import ClientComponent from "./ClientComponent";
// import { postData, postFetchDataWithAuth } from "@/fetchData/fetchApi";
// import { useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import { BASE_URL } from "@/constant/constant";

// const EventDetail = ({
//   params: { detail },
//   searchParams: { promoter_id },
// }: {
//   params: { detail: number };
//   searchParams: { promoter_id: number };
// }) => {
//   const [eventDetail, setEventDetail] = useState<any>({});
//   const [qrCode, setQrCode] = useState<any>({});
//   const { isAuthenticated, userDetails } = useAuth();
//   useEffect(() => {
//     if (promoter_id && detail && isAuthenticated) {
//       fetchEventDetail();
//     }
//   }, [detail, promoter_id, isAuthenticated]);
//   const generateQRCode = async (matchNumber: string) => {
//     try {
//       const response = await postFetchDataWithAuth({
//         data: { user_id: userDetails?.user_id, match_number: matchNumber },
//         endpoint: "user_qr_code_get",
//         authToken: userDetails?.token,
//       });

//       if (response?.success) {
//         setQrCode(response?.data?.[0]);
//       }
//     } catch (error) {
//       toast.error(`${error}`);
//     }
//   };
//   const fetchEventDetail = async () => {
//     try {
//       const resultEvent = await postFetchDataWithAuth({
//         data: { user_id: userDetails?.user_id },
//         endpoint: "user_my_event_list",
//         authToken: userDetails?.token,
//       });

//       if (Array.isArray(resultEvent?.data)) {
//         const templist = resultEvent.data.find(
//           (item: any) => Number(item?.promoter_event_id) === Number(detail)
//         );
//         const resEvent = await postData({
//           data: { event_id: detail, promoter_id },
//           endpoint: "user_event_detail_list",
//         });
//         if (resEvent?.id) {
//           setEventDetail({
//             ...resEvent,
//             event_quantity: templist?.event_quantity,
//           });
//         }
//         generateQRCode(templist?.match_number);
//       } else {
//         throw resultEvent;
//       }
//     } catch (error: any) {
//       const errorMessage =
//         typeof error === "string"
//           ? `${error}`
//           : error?.message
//           ? error?.message
//           : `${error}`;
//       toast.error(errorMessage);
//     }
//   };
//   return <ClientComponent eventDetail={eventDetail} qrCode={qrCode} />;
// };

// export default EventDetail;

// code written by rajan
"use client";
import ClientComponent from "./ClientComponent";
import { useLayoutEffect, useState } from "react";
import { BASE_URL } from "@/constant/constant";

import { useAuth } from "@/app/UserProvider";
import Loader from "@/components/custom/Loader";
async function getData(user_id, token, check_id, match_number) {
  console.log(
    user_id,
    token,
    check_id,
    match_number,
    "this isi the loop calling"
  );

  const formData = new FormData();

  formData.append("user_id", user_id);
  formData.append("event_unique_number", check_id);
  formData.append("match_number", match_number);

  const resEvent = await fetch(
    `${BASE_URL}/api/auth/user_my_event_detail_list_web`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  const eventDetails = await resEvent.json();

  return {
    my_event_details: eventDetails.data,
  };
}

const EventDetail = ({ params: { detail }, searchParams: { event_uinqu } }) => {
  const { userDetails } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    const fetchData = async () => {
      if (!userDetails || !userDetails.user_id) {
        setLoading(false);
        return;
      }

      try {
        const result = await getData(
          userDetails.user_id,
          userDetails.token,
          detail,
          event_uinqu
        );
        setData(result.my_event_details);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userDetails, detail, event_uinqu]);

  if (loading) {
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
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return <ClientComponent eventDetail={data} qrCode={{}} />;
};

export default EventDetail;
