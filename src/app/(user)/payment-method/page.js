"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/UserProvider";
import { toast } from "react-toastify";
import { postFetchDataWithAuth } from "@/fetchData/fetchApi";
import AddCard from "@/components/Modal/addCard";

import { Box, Skeleton } from "@mui/material";
import CardList from "./components/CardList";

const PaymentMethod = () => {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, userDetails } = useAuth();
  const [cardList, setCardList] = useState([]);
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (isAuthenticated && userDetails?.token) {
      fetchCardList();
    }
  }, [isAuthenticated, reload]);
  const fetchCardList = async () => {
    setLoading(true);
    try {
      const response = await postFetchDataWithAuth({
        data: { user_id: userDetails?.user_id },
        endpoint: "user_AllCard",
        authToken: userDetails?.token,
      });
      if (response?.data) {
        setCardList(response?.data);
      } else if (response?.message === "No card saved.") {
        setCardList([]);
      } else {
        throw response;
      }
    } catch (error) {
      if (error !== "No card saved." && error !== undefined) {
        const errorMessage =
          typeof error === "string" ? `${error}` : error?.message;
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };
  const userCardSave = async (tok) => {
    try {
      const response = await postFetchDataWithAuth({
        data: { user_id: userDetails?.user_id, token: tok?.id },
        endpoint: "user_CardSave",
        authToken: userDetails?.token,
      });
      if (response?.data) {
        setReload(!reload);
      } else {
        throw response;
      }
    } catch (error) {
      const errorMessage =
        typeof error === "string"
          ? `${error}`
          : error?.message
          ? error?.message
          : `${error}`;
      toast.error(errorMessage);
    }
  };
  const userCardDelete = async (cardId) => {
    try {
      const response = await postFetchDataWithAuth({
        data: { user_id: userDetails?.user_id, card_id: cardId },
        endpoint: "user_CardDelete",
        authToken: userDetails?.token,
      });
      if (response.hasOwnProperty("data")) {
        toast.success(response?.message);
        setReload(!reload);
      } else {
        throw response;
      }
    } catch (error) {
      const errorMessage =
        typeof error === "string"
          ? `${error}`
          : error?.message
          ? error?.message
          : `${error}`;
      toast.error(errorMessage);
    }
  };
  return (
    <div className="user-dashboard-data">
      {loading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Skeleton variant="rounded" width={"60%"} height={160} />
          <Skeleton variant="rounded" width={210} height={40} sx={{ mt: 2 }} />
        </Box>
      )}
      {!loading && cardList?.length === 0 && (
        <div className="user-payment-method">
          <div className="user-card-icon">
            <Image
              width={100}
              height={76}
              src="/images/user-dashboard/payment-method/card-info-icon.svg"
              alt=""
            />
          </div>
          <h1>You have no saved cards.</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean
            commod o ligula eget dolor.
          </p>

          <a href="#" onClick={() => setOpen(true)}>
            Add Card
          </a>
        </div>
      )}
      {!loading && cardList?.length > 0 && (
        <CardList
          setOpen={setOpen}
          userCardDelete={userCardDelete}
          cardList={cardList}
          isCardPaymentEnabled={false}
          callPaymentCard={() => console.log("")}
        />
      )}
      <AddCard open={open} setOpen={setOpen} callBack={userCardSave} />
    </div>
  );
};

export default PaymentMethod;
