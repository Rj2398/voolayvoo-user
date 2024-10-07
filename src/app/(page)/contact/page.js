"use client";
import { postData } from "@/fetchData/fetchApi";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import {
  validateCaptcha,
  loadCaptchaEnginge,
  LoadCanvasTemplateNoReload,
} from "react-simple-captcha";
import { toast } from "react-toastify";

const Contact = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
  } = useForm();
  const formElement = useRef(null);
  useEffect(() => {
    loadCaptchaEnginge(6);
  }, []);

  const onSubmit = async (data) => {
    try {
      if (validateCaptcha(data.captcha, false) == true) {
        const formdata = {
          name: data.name,
          email: data.email,
          phone: data.phone,
          subject: data.subject,
          message: data.message,
        };
        const response = await postData({
          data: formdata,
          endpoint: "user_contact_us_form",
        });

        if (response.hasOwnProperty("date")) {
          reset({
            name: "",
            email: "",
            message: "",
            phone: "",
            subject: "",
            captcha: "",
          });
          loadCaptchaEnginge(6);
          toast.success(`Contact form submitted`);
        } else {
          throw response;
        }
      } else {
        setError("captcha", {
          type: "manual",
          message: "Please enter correct captcha.",
        });
      }
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  return (
    <>
      <div
        className="inner-banner"
        style={{
          backgroundImage: "url(/images/contact-bg.jpg)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <h1> Contact </h1>
      </div>
      <section className="contact-wrap">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="contact-top">
                <h2>
                  We’d Love to <span>Hear From You!</span>
                </h2>
                <p>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum is simply dummy text of the
                  printing and typesetting industry. Lorem Ipsum is simply dummy
                  text of the printing and typesetting industry.
                </p>
                <div className="contact-detail">
                  <div className="contact-detail-in">
                    <div className="contact-detail-image">
                      <Image
                        width={35}
                        height={35}
                        src="/images/contact-icon.svg"
                        alt=""
                      />
                    </div>
                    <div className="contact-detail-tex">
                      <h3>Phone</h3>
                      <span>+1 (336) 462-9189</span>
                    </div>
                  </div>
                  <div className="contact-detail-in">
                    <div className="contact-detail-image">
                      <Image
                        width={35}
                        height={35}
                        src="/images/mail.svg"
                        alt=""
                      />
                    </div>
                    <div className="contact-detail-tex">
                      <h3>Email</h3>
                      <span>support@VoolayVooApp.com</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-12">
              <div className="contact-bottom">
                <div className="contact-left">
                  <h1>Get in touch</h1>
                  <form onSubmit={handleSubmit(onSubmit)} ref={formElement}>
                    <input
                      {...register("name", {
                        required: {
                          value: true,
                          message: "Name is required",
                        },
                      })}
                      type="text"
                      placeholder="Name"
                    />
                    {errors.name && (
                      <span>{errors.name.message?.toString()}</span>
                    )}

                    <input
                      {...register("email", {
                        required: {
                          value: true,
                          message: "Email is required",
                        },
                      })}
                      type="text"
                      placeholder="Email"
                    />
                    {errors.email && (
                      <span>{errors.email.message?.toString()}</span>
                    )}

                    <input
                      {...register("phone", {
                        pattern: {
                          value: /^[0-9]{9,10}$/,
                          message: "Phone number must be 10 digits",
                        },
                      })}
                      type="number"
                      placeholder="Phone"
                    />
                    {errors.phone && (
                      <span>{errors.phone.message?.toString()}</span>
                    )}

                    <select
                      {...register("subject", {
                        required: {
                          value: true,
                          message: "Subject is required",
                        },
                      })}
                    >
                      <option value="">Subject</option>
                      <option value="Feedback">Feedback</option>
                      <option value="Complaints">Complaints</option>
                      <option value="Report">Report</option>
                      <option value="Others">Others</option>
                    </select>
                    {errors.subject && (
                      <span>{errors.subject.message?.toString()}</span>
                    )}

                    <textarea
                      {...register("message", {
                        required: {
                          value: true,
                          message: "Message is required",
                        },
                      })}
                      placeholder="Message"
                    ></textarea>
                    {errors.message && (
                      <span>{errors.message.message?.toString()}</span>
                    )}

                    <label>
                      <input
                        {...register("captcha", {
                          required: {
                            value: true,
                            message: "Captcha is required",
                          },
                        })}
                        type="text"
                        placeholder="Enter captcha code"
                      />

                      <div className="contact-left-img">
                        <LoadCanvasTemplateNoReload />
                      </div>
                      <button type="button">
                        <Image
                          onClick={() => loadCaptchaEnginge(6)}
                          width={27}
                          height={27}
                          src="/images/reload.svg"
                          alt=""
                        />
                      </button>
                    </label>
                    {errors.captcha && (
                      <span>{errors.captcha.message?.toString()}</span>
                    )}

                    <input type="submit" value="submit" />
                  </form>
                </div>
                <div className="contact-right">
                  <Image
                    width={430}
                    height={450}
                    src="/images/contact-img.jpg"
                    alt=""
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
