"use client";
import Image from "next/image";
import { useState, useRef, Suspense } from "react";
import { useForm } from "react-hook-form";

import Dialog from "./components/success";
import useLocalStorage, { removeStorage } from "@/constant/useLocalStorage";
import { toast } from "react-toastify";
import { postDataWithoutAuth } from "@/fetchData/fetchApi";
import { passwordPattern } from "@/constant/validation";

const ResetPassword = () => {
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState({
    new: false,
    confirm: false,
  });
  const [localStorage, setLocalStorage] = useLocalStorage("forgetUser", null);
  const formElement = useRef(null);
  const [showIcon, setShowIcon] = useState({
    new: { type: "hide", show: false },
    confirm: { type: "hide", show: false },
  });
  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields },
    setError,
    watch,
  } = useForm({ mode: "onChange" });

  const newPasswordRef = useRef();
  newPasswordRef.current = watch("password");

  const confirPasswordRef = useRef();
  confirPasswordRef.current = watch("confirmPassword");
  const validatePassword = (value) => {
    // Password must be at least 8 characters long and contain at least one number, one alphabet, and one special character
    setError("confirmPassword", {
      type: "manual",
      message: "",
    });
    if (confirPasswordRef.current !== value) {
      setShowIcon((e) => ({ ...e, confirm: { type: "visible", show: false } }));
    } else if (confirPasswordRef.current === value) {
      setShowIcon((e) => ({ ...e, confirm: { type: "visible", show: true } }));
    }
    if (!passwordPattern.test(value)) {
      setShowIcon((e) => ({ ...e, new: { type: "visible", show: false } }));
    } else if (passwordPattern.test(value)) {
      setShowIcon((e) => ({ ...e, new: { type: "visible", show: true } }));
    }
  };

  const validateConfirmPassword = (value) => {
    if (newPasswordRef.current !== value) {
      setShowIcon((e) => ({ ...e, confirm: { type: "visible", show: false } }));
    } else if (newPasswordRef.current === value) {
      setShowIcon((e) => ({ ...e, confirm: { type: "visible", show: true } }));
    }
  };

  const onSubmit = async (data) => {
    if (
      data.password === data.confirmPassword &&
      passwordPattern.test(data.password)
    ) {
      try {
        const formdata = {
          email: localStorage.email,
          password: data.password,
        };
        const response = await postDataWithoutAuth({
          data: formdata,
          endpoint: "user_password_create",
        });
        if (response.user_id && response.user_signup_status === "1") {
          await removeStorage("forgetUser");
          setOpen(true);
        } else {
          throw response;
        }
      } catch (error) {
        toast.error(`${error}`);
      }
    } else if (
      data.password === data.confirmPassword &&
      !passwordPattern.test(data.password)
    ) {
      setError("confirmPassword", {
        type: "manual",
        message:
          "Password must be at least 8 characters and contain one number, one alphabet, and one special character.",
      });
    } else if (data.password !== data.confirmPassword) {
      setError("confirmPassword", {
        type: "manual",
        message: "Passwords do not match",
      });
    }
  };

  return (
    <>
      <section className="login-signup-sec">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10 col-md-12 p-lg-5">
              <div className="login-sign-box">
                <div className="login-sign-left otp-verification">
                  <div className="sign-logo">
                    <Image
                      width={153}
                      height={150}
                      src="/images/login-logo.png"
                      alt="images"
                      className="img-fluid"
                    />
                  </div>
                  <h3 className="mt-3">Find Your A-ha!</h3>
                  <p>
                    VOOLAY-VOO Social Marketing™ allows Promoters to actively
                    and timely engage consumers by utilizing their social media
                    influence and presence to curate, create, manage, publish,
                    and share events, promotions, and campaigns and attuning it
                    to the needs of interested consumers exactly when they have
                    a need, interest, or are in the buying mood.
                  </p>
                </div>
                <div className="login-sign-right text-center align-self-center">
                  <div className="formbox">
                    <div className="tab-content" id="pills-tabContent">
                      <div className="same-inner-tab" id="">
                        <h1 className="mb-5">Reset Password</h1>
                        <form
                          onSubmit={handleSubmit(onSubmit)}
                          ref={formElement}
                        >
                          <div className="password-icon">
                            <input
                              {...register("password", {
                                required: {
                                  value: true,
                                  message: "Password is required",
                                },
                              })}
                              onChange={(e) => {
                                validatePassword(e.target.value);
                              }}
                              type={show.new ? "text" : "password"}
                              className="form-control password-in"
                              placeholder="Create Password"
                            />
                            <i
                              onClick={() =>
                                setShow({
                                  ...show,
                                  new: show.new ? false : true,
                                })
                              }
                              className={
                                "fa eye-in " +
                                (show.new ? "fa-eye" : "fa-eye-slash")
                              }
                              aria-hidden="true"
                            ></i>

                            {showIcon.new.type === "visible" && (
                              <>
                                {showIcon.new.show && (
                                  <Image
                                    width={20}
                                    height={20}
                                    src="/images/pass-check.svg"
                                    alt=""
                                  />
                                )}
                                {!showIcon.new.show && (
                                  <Image
                                    width={20}
                                    height={20}
                                    src="/images/pass-wrong.svg"
                                    alt=""
                                  />
                                )}
                              </>
                            )}

                            {errors.password && (
                              <span
                                className="text-danger"
                                style={{
                                  display: "block",
                                  textAlign: "left",
                                  marginLeft: "20px",
                                  fontSize: "14px",
                                }}
                              >
                                {errors.password.message?.toString()}
                              </span>
                            )}
                          </div>
                          <div className="password-icon">
                            <input
                              {...register("confirmPassword", {
                                required: {
                                  value: true,
                                  message: "Confirm Password is required",
                                },
                              })}
                              onChange={(e) => {
                                validateConfirmPassword(e.target.value);
                              }}
                              type={show.confirm ? "text" : "password"}
                              className="form-control password-in"
                              placeholder="Confirm New Password"
                            />
                            <i
                              onClick={() =>
                                setShow({
                                  ...show,
                                  confirm: show.confirm ? false : true,
                                })
                              }
                              className={
                                "fa eye-in " +
                                (show.confirm ? "fa-eye" : "fa-eye-slash")
                              }
                              aria-hidden="true"
                            ></i>

                            {showIcon.confirm.type === "visible" && (
                              <>
                                {showIcon.confirm.show && (
                                  <Image
                                    width={20}
                                    height={20}
                                    src="/images/pass-check.svg"
                                    alt=""
                                  />
                                )}
                                {!showIcon.confirm.show && (
                                  <Image
                                    width={20}
                                    height={20}
                                    src="/images/pass-wrong.svg"
                                    alt=""
                                  />
                                )}
                              </>
                            )}

                            {errors.confirmPassword && (
                              <span
                                className="text-danger"
                                style={{
                                  display: "block",
                                  textAlign: "left",
                                  marginLeft: "20px",
                                  fontSize: "14px",
                                }}
                              >
                                {errors.confirmPassword.message?.toString()}
                              </span>
                            )}
                          </div>

                          <a
                            onClick={() => formElement.current?.requestSubmit()}
                            className="btn btn-learnmore mt-3"
                            role="button"
                          >
                            SUBMIT
                          </a>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Dialog open={open} />
    </>
  );
};

const ResetPasswordPage = () => {
  return (
    <Suspense>
      <ResetPassword />
    </Suspense>
  );
};
export default ResetPasswordPage;
