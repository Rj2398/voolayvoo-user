"use client";

import { postData } from "@/fetchData/fetchApi";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const SubscribeHome = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data) => {
    if (!data.user_email) {
      // Manually trigger validation to show a toast if email is missing
      toast.error("Email is required");
      return;
    }
    try {
      const response = await postData({
        data: data,
        endpoint: "user_subscribe_voolayvoo",
      });
      if (response.user_email) {
        toast.success(`You have Subscribe to our news letter`);
      } else {
        throw response;
      }
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  const handleError = () => {
    if (errors.user_email) {
      toast.error(errors.user_email.message);
    }
  };
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-lg-8 text-center heading">
          <span> Get latest updates from VoolayVoo? </span>
        </div>
        <div className="col-lg-6">
          <form
            className="d-flex sub-srchbox mt-2"
            onSubmit={handleSubmit(onSubmit, handleError)}
          >
            <input
              {...register("user_email", {
                required: {
                  value: true,
                  message: "Email is required",
                },
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: "Enter a valid email address",
                },
              })}
              className="suscribe-srch"
              type="mail"
              placeholder="Enter your Email"
            />

            <button className="subscribe-btn" type="submit">
              {" "}
              Subscribe{" "}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default SubscribeHome;
