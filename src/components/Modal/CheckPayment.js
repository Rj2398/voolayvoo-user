"use client";
import CardList from "@/app/(user)/payment-method/components/CardList";
import { Modal, Box, Skeleton } from "@mui/material";
import AddCard from "./addCard";
import { toast } from "react-toastify";
import { postFetchDataWithAuth } from "@/fetchData/fetchApi";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/UserProvider";
import Image from "next/image";

const CheckPayment = ({ open, setOpen, callBack, reloadList }) => {
  const [openCard, setOpenCard] = useState(false);
  const { isAuthenticated, userDetails } = useAuth();
  const [cardList, setCardList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && open) {
      fetchCardList();
    }
  }, [reloadList, isAuthenticated, open]);

  const fetchCardList = async () => {
    setLoading(true);
    try {
      const response = await postFetchDataWithAuth({
        data: { user_id: userDetails.user_id },
        endpoint: "user_AllCard",
        authToken: userDetails.token,
      });
      if (response?.data) {
        setCardList(response?.data);
      } else {
        setCardList([]);
      }
    } catch (error) {
      setCardList([]);
      // Silent error if no card saved, otherwise show toast
      if (error?.message !== "No card saved.") {
        console.error("Fetch card error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCard = () => {
    setOpenCard(true);
  };

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      className="password-popup"
    >
      <Box sx={{ outline: "none" }}>
        <div
          className="modal fade show"
          style={{
            display: openCard ? "none" : "block",
            paddingRight: "0px",
            position: "relative",
          }}
        >
          <div className="modal-dialog card-width">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title modal-title-center add-card-hd">
                  {cardList.length > 0 ? "Select Card" : "Add New Card"}
                </h5>
                <button
                  onClick={() => setOpen(false)}
                  type="button"
                  className="close collab-btn"
                >
                  <Image
                    width={28}
                    height={28}
                    src="/images/cross.svg"
                    alt="close"
                  />
                </button>
              </div>
              <div className="modal-body">
                {loading ? (
                  <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                    <Skeleton variant="rounded" width={"100%"} height={160} />
                  </Box>
                ) : cardList.length > 0 ? (
                  /* CASE 1: USER HAS SAVED CARDS */
                  <CardList
                    setOpen={handleOpenCard}
                    userCardDelete={() => fetchCardList()}
                    cardList={cardList}
                    isCardPaymentEnabled={true}
                    callPaymentCard={(card) => {
                      console.log("Existing Card Selected:", card);
                      callBack({ customer_id: card?.customer_id });
                    }}
                  />
                ) : (
                  /* CASE 2: NO CARDS - SHOW ADD CARD FORM DIRECTLY */
                  <AddCard
                    setOpen={setOpen}
                    open={open}
                    callBack={(tok) => {
                      console.log("New Card Token Generated:", tok);
                      callBack({ token: tok?.id });
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Nested AddCard Modal if user clicks 'Add New' from the list view */}
        {openCard && (
          <AddCard
            setOpen={setOpenCard}
            open={openCard}
            callBack={(tok) => {
              callBack({ token: tok?.id });
            }}
          />
        )}
      </Box>
    </Modal>
  );
};

export default CheckPayment;

// "use client";
// import CardList from "@/app/(user)/payment-method/components/CardList";
// import { Modal, Box, Skeleton } from "@mui/material";
// import AddCard from "./addCard";
// import { toast } from "react-toastify";
// import { postFetchDataWithAuth } from "@/fetchData/fetchApi";
// import { useEffect, useState } from "react";
// import { useAuth } from "@/app/UserProvider";
// import Image from "next/image";

// const CheckPayment = ({ open, setOpen, callBack, reloadList }) => {
//   const [openCard, setOpenCard] = useState(false);
//   const { isAuthenticated, userDetails } = useAuth();
//   const [cardList, setCardList] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (isAuthenticated) {
//       fetchCardList();
//     }
//   }, [reloadList, isAuthenticated]);
//   const fetchCardList = async () => {

//     setLoading(true);
//     try {
//       const response = await postFetchDataWithAuth({
//         data: { user_id: userDetails.user_id },
//         endpoint: "user_AllCard",
//         authToken: userDetails.token,
//       });
//       if (response?.data) {
//         setCardList(response?.data);
//       } else {
//         throw response;
//       }
//     } catch (error) {
//       const errorMessage =
//         typeof error === "string"
//           ? `${error}`
//           : error?.message
//           ? error?.message
//           : `${error}`;
//       if (errorMessage === "No card saved.") {
//         setCardList([]);
//       } else {
//         toast.error(errorMessage);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleOpenCard = () => {
//     setOpenCard(true);
//   };
//   if (cardList.length > 0) {
//     return (
//       <Modal open={open} className="password-popup">
//         <Box>
//           <div
//             className="modal fade show"
//             id={"payemntCard"}
//             style={{
//               display: openCard ? "none" : "block",
//               paddingRight: "0px",
//             }}
//           >
//             <div className="modal-dialog card-width">
//               <div className="modal-content">
//                 <div className="modal-header">
//                   <h5
//                     className="modal-title modal-title-center add-card-hd"
//                     id=""
//                   >
//                     Select Card
//                   </h5>
//                   <button
//                     onClick={() => setOpen(false)}
//                     type="button"
//                     className="close collab-btn"
//                   >
//                     <span aria-hidden="true">
//                       <Image
//                         width={28}
//                         height={28}
//                         src="/images/cross.svg"
//                         alt=""
//                       />
//                     </span>
//                   </button>
//                 </div>
//                 <div className="modal-body">
//                   {loading && (
//                     <Box
//                       sx={{
//                         display: "flex",
//                         justifyContent: "center",
//                         alignItems: "center",
//                         flexDirection: "column",
//                       }}
//                     >
//                       <Skeleton variant="rounded" width={"60%"} height={160} />
//                       <Skeleton
//                         variant="rounded"
//                         width={210}
//                         height={40}
//                         sx={{ mt: 2 }}
//                       />
//                     </Box>
//                   )}
//                   {!loading && cardList?.length > 0 && (
//                     <CardList
//                       setOpen={handleOpenCard}
//                       userCardDelete={() => console.log()}
//                       cardList={cardList}
//                       isCardPaymentEnabled={true}
//                       callPaymentCard={(card) =>
//                         callBack({ customer_id: card?.customer_id })
//                       }
//                     />
//                   )}
//                   <AddCard
//                     setOpen={
//                       !loading && cardList?.length === 0 ? setOpen : setOpenCard
//                     }
//                     open={!loading && cardList?.length === 0 ? open : openCard}
//                     callBack={(tok) => callBack({ token: tok?.id })}
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </Box>
//       </Modal>
//     );
//   } else {
//     return (
//       <AddCard
//         setOpen={setOpen}
//         open={open}
//         callBack={(tok) => callBack({ token: tok?.id })}
//       />
//     );
//   }
// };

// export default CheckPayment;
