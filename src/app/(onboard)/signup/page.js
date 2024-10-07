"use client";
import { useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { postData } from "../../../fetchData/fetchApi";
import useLocalStorage from "../../../constant/useLocalStorage";
import { passwordPattern, emailOrPhonePattern } from "@/constant/validation";
import { toast } from "react-toastify";
const SignUp = () => {
  const router = useRouter();

  const [show, setShow] = useState(false);
  const formElement = useRef(null);
  const [localStorage, setLocalStorage] = useLocalStorage("loginUser", null);
  const searchParams = useSearchParams();
  const lastPath = searchParams.get("lastPath");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const formdata = {
        name: data.name,
        email: data.emailOrPhone,
        password: data.password,
        referralcode: data.referralcode,
      };
      const response = await postData({
        data: formdata,
        endpoint: "user_signup",
      });

      console.log(response, "signup apiii");

      if (response?.token && response?.email) {
        setLocalStorage({
          ...response,
          password: data.password,
          name: data.name,
        });

        if (lastPath) {
          router.push(`/account-verificaton?lastPath=${lastPath}`);
        } else {
          router.push("/account-verificaton");
        }
      } else {
        throw response;
      }
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  return (
    <>
      <section className="login-signup-sec">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10 col-md-12 p-lg-5">
              <div className="login-sign-box">
                <div className="login-sign-left">
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
                    VOOLAY-VOO informs you of new products, services, and
                    offerings from your most favored and trusted retailers,
                    restaurants, food trucks, entertainment, sports, and
                    recreation venues, etc., when you want or need them.
                  </p>
                </div>
                <div className="login-sign-right text-center">
                  <div className="formbox loginflow">
                    <h1>User Sign Up</h1>
                    <p>Please fill the details and create account.</p>
                    <form onSubmit={handleSubmit(onSubmit)} ref={formElement}>
                      <div className="name-icon">
                        <input
                          {...register("name", {
                            required: {
                              value: true,
                              message: "Name is required",
                            },
                          })}
                          type="text"
                          className="form-control"
                          placeholder="Full Name"
                        />
                        {errors.name && (
                          <span
                            className="text-danger"
                            style={{
                              display: "block",
                              textAlign: "left",
                              marginLeft: "20px",
                              fontSize: "14px",
                            }}
                          >
                            {errors.name.message?.toString()}
                          </span>
                        )}
                      </div>
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
                          placeholder="Email/Phone"
                        />
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
                      <div className="referal-icon">
                        <input
                          {...register("referralcode", {})}
                          type="text"
                          className="form-control"
                          placeholder="Referral code (optional)"
                        />
                        {errors.referralcode && (
                          <span
                            className="text-danger"
                            style={{
                              display: "block",
                              textAlign: "left",
                              marginLeft: "20px",
                              fontSize: "14px",
                            }}
                          >
                            {errors.referralcode.message?.toString()}
                          </span>
                        )}
                      </div>
                      <a
                        onClick={() => formElement.current?.requestSubmit()}
                        className="btn btn-learnmore"
                        role="button"
                      >
                        SIGN UP
                      </a>
                    </form>

                    <div className="term-condition">
                      By signing up, you agree to our{" "}
                      <Link href={"/terms-and-conditions"}>
                        Terms & Conditions
                      </Link>{" "}
                      and <Link href={"/privacy-policy"}>Privacy Policy.</Link>
                    </div>
                    <div className="alrady-account">
                      Already have an account?{" "}
                      <Link
                        href={
                          lastPath ? `/login?lastPath=${lastPath}` : "/login"
                        }
                      >
                        Sign In
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
const SignUpPage = () => {
  return (
    <Suspense>
      <SignUp />
    </Suspense>
  );
};
export default SignUpPage;
