"use client";
import { useState, useRef, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { postData } from "@/fetchData/fetchApi";
import { emailOrPhonePattern, passwordPattern } from "@/constant/validation";
import { toast } from "react-toastify";
import { useAuth } from "@/app/UserProvider";
const Login = () => {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const formElement = useRef(null);
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const lastPath = searchParams.get("lastPath");

  const onSubmit = async (data) => {
    if (data.emailOrPhone && data.password) {
      try {
        const formdata = {
          email: data.emailOrPhone,
          password: data.password,
        };
        const response = await postData({
          data: formdata,
          endpoint: "login",
        });

        if (
          response.token &&
          response.user_details[0].user_signup_status === "1"
        ) {
          login(response);
          if (lastPath) {
            router.push(`${lastPath}`);
          } else {
            router.push("/");
          }
        } else {
          throw response;
        }
      } catch (error) {
        toast.error(`${error}`);
      }
    }
  };

  return (
    <>
      <section className="login-signup-sec">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10 col-md-12 p-lg-5">
              <div className="login-sign-box">
                <div className="login-sign-left small-sign">
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
                <div className="login-sign-right text-center">
                  <div className="formbox loginflow">
                    <h1 className="mt-3">User Sign In</h1>
                    <p className="mt-4">Sign in to continue</p>
                    <form onSubmit={handleSubmit(onSubmit)} ref={formElement}>
                      <div className="email-icon">
                        <input
                          {...register("emailOrPhone", {
                            required: {
                              value: true,
                              message: "Email/Phone is required",
                            },
                            pattern: {
                              value: emailOrPhonePattern,
                              message: "Invalid email or phone number",
                            },
                          })}
                          className="form-control"
                          placeholder="Registered Email/Phone"
                        />
                        {/* {errors.emailOrPhone && (
                          <span className="text-danger">
                            {errors.emailOrPhone.message?.toString()}
                          </span>
                        )} */}
                        {errors.emailOrPhone && (
                          <span
                            className="text-danger"
                            style={{
                              display: "block",
                              textAlign: "left",
                              marginLeft: "20px",
                              fontSize: "14px",
                            }}
                          >
                            {errors.emailOrPhone.message?.toString()}
                          </span>
                        )}
                      </div>
                      <div className="password-icon">
                        <input
                          {...register("password", {
                            required: {
                              value: true,
                              message: "Password is required",
                            },

                            pattern: {
                              value: passwordPattern,
                              message:
                                "Password must be at least 8 characters long and contain one number, one alphabet, and one special character",
                            },
                          })}
                          type={show ? "text" : "password"}
                          className="form-control password-in"
                          placeholder="Password"
                        />
                        <i
                          onClick={() => setShow(show ? false : true)}
                          className={
                            "fa eye-in " + (show ? "fa-eye" : "fa-eye-slash")
                          }
                          aria-hidden="true"
                        ></i>
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
                      <div className="forgot-pass">
                        <Link
                          href={
                            lastPath
                              ? `/forgot-password?lastPath=${lastPath}`
                              : "/forgot-password"
                          }
                        >
                          Forgot password?
                        </Link>{" "}
                      </div>
                      <a
                        onClick={() => formElement.current?.requestSubmit()}
                        className="btn btn-learnmore mt-3"
                        role="button"
                      >
                        LOGIN
                      </a>
                    </form>
                    <div className="alrady-account">
                      Don’t have an account?{" "}
                      <Link
                        href={
                          lastPath ? `/signup?lastPath=${lastPath}` : "/signup"
                        }
                      >
                        Sign Up
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

const LoginPage = () => {
  return (
    <Suspense>
      <Login />
    </Suspense>
  );
};
export default LoginPage;
