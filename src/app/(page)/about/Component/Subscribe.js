"use client";
import { Modal } from "@mui/material";
import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useForm } from "react-hook-form";
import { emailPattern } from "@/constant/validation";
import { toast } from "react-toastify";
import { postData } from "@/fetchData/fetchApi";
// import Image from "next/image";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 2,

  p: 3,
};

export default function Subscribe() {
  const [open, setOpen] = React.useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    reset({ user_email: "" });
    setOpen(false);
  };
  const onSubmit = (e) => {
    postFetch();
    async function postFetch() {
      try {
        const response = await postData({
          data: e,
          endpoint: "user_subscribe_voolayvoo",
        });

        if (response.user_email) {
          toast.success(`You have Subscribe to our news letter`);
        } else {
          throw response;
        }
      } catch (error) {
        toast.error(`${error}`);
      } finally {
        reset();
        handleClose();
      }
    }
  };
  return (
    <>
      <a className="btn btn-learnmore" role="button" onClick={handleOpen}>
        Subscribe
      </a>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{
          display: "flex",

          alignItems: "center",
          justifyContent: "center",
          border: "none",
        }}
      >
        <Box
          sx={{
            position: "relative",
            minWidth: 400,
            maxWidth: 500,
            width: "100%",
            bgcolor: "background.paper",
            borderRadius: 2,
            border: "none",
            boxShadow: (theme) => theme.shadows[5],
            p: 4,
          }}
        >
          <div className="modal-header pb-4">
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              sx={{ position: "absolute" }}
            >
              Subscribe to get update
            </Typography>
            <button type="button" className="close" onClick={handleClose}>
              <span aria-hidden="true">
                <img src="/images/cross.svg" alt="" />
              </span>
            </button>
          </div>

          <form
            className="d-flex sub-srchbox mt-2"
            onSubmit={handleSubmit(onSubmit)}
          >
            <input
              className="suscribe-srch"
              type="mail"
              placeholder="Enter your Email"
              {...register("user_email", {
                required: true,
                pattern: {
                  value: emailPattern,
                  message: "Invalid email ",
                },
              })}
              autoComplete="off"
            />

            <button className="subscribe-btn" type="submit">
              {" "}
              Subscribe{" "}
            </button>
          </form>
          {errors?.user_email && (
            <span className="text-danger">
              {errors.user_email.message?.toString()}
            </span>
          )}
          {errors.subscribe && (
            <span className="text-danger">
              {errors.subscribe.message?.toString()}
            </span>
          )}
        </Box>
      </Modal>
    </>
  );
}
