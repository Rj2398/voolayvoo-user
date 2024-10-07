"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Authusers = () => {
  const [show, setShow] = useState(false);
  const router = useRouter(); // Using the useRouter hook

  const handleLoginClick = () => {
    router.push("/login");
  };

  const handleSignupClick = () => {
    router.push("/signup");
  };

  return (
    <>
      <section className="login-signup-sec">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10 col-md-12 p-lg-5">
              <div className="login-sign-box">
                <div className="login-sign-left small-sign">
                  {/* <div className="sign-logo">
                    <Image
                      width={153}
                      height={150}
                      src="/images/login-logo.png"
                      alt="images"
                      className="img-fluid"
                    />
                  </div> */}
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
                    <Image
                      width={153}
                      height={150}
                      src="/images/login-logo.png"
                      alt="images"
                      className="img-fluid"
                    />
                    <h1 className="mt-3">Login or signup first</h1>
                    <p className="mt-4">
                      Already have an account?{" "}
                      <button
                        onClick={handleLoginClick}
                        className="btn-link"
                        style={{
                          background: "none",
                          border: "none",
                          padding: 0,
                          textDecoration: "underline",
                          color: "#0070f3",
                          cursor: "pointer",
                        }}
                      >
                        Login first
                      </button>
                    </p>
                    <p className="mt-4">
                      Don’t have an account?{" "}
                      <button
                        onClick={handleSignupClick}
                        className="btn-link"
                        style={{
                          background: "none",
                          border: "none",
                          padding: 0,
                          textDecoration: "underline",
                          color: "#0070f3",
                          cursor: "pointer",
                        }}
                      >
                        Create one
                      </button>
                    </p>
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

export default Authusers;
