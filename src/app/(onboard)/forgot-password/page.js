"use client";
import { Suspense, useRef } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { postDataWithoutAuth } from "@/fetchData/fetchApi";
import { emailOrPhonePattern } from "@/constant/validation";
import useLocalStorage from "@/constant/useLocalStorage";

const ForgetComponent = () => {
  const router = useRouter();
  const [localStorage, setLocalStorage] = useLocalStorage("forgetUser", null);
  const formElement = useRef(null);
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
        email: data.emailOrPhone,
      };
      const response = await postDataWithoutAuth({
        data: formdata,
        endpoint: "user_forget_password",
      });

      if (response !== undefined && response?.user_signup_status === "1") {
        setLocalStorage(response);
        if (lastPath) {
          router.push(`/verificaton-code?lastPath=${lastPath}`);
        } else {
          router.push("/verificaton-code");
        }
      } else if (response === null || response === undefined) {
        throw "Please singUp first.";
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
                        <h1 className="mb-5">Forgot Password? </h1>
                        <p>
                          Enter the email/phone number associated with your
                          account.
                        </p>
                        <form
                          onSubmit={handleSubmit(onSubmit)}
                          ref={formElement}
                        >
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
                          <a
                            onClick={() => formElement.current?.requestSubmit()}
                            className="btn btn-learnmore mt-3"
                            role="button"
                          >
                            NEXT
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
    </>
  );
};

const ForgotPassword = () => {
  return (
    <Suspense>
      <ForgetComponent />
    </Suspense>
  );
};

export default ForgotPassword;
