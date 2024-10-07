"use client";
import Link from "next/link";
import Image from "next/image";
import SubscribeHome from "@/components/SubscribeHome";
import axios from "axios";
import { BASE_URL } from "@/constant/constant";
import { useEffect, useLayoutEffect, useState } from "react";
import CarouselHeader from "@/components/custom/Carousel";
import { useAuth } from "./UserProvider";
import NewlyVoopons from "@/components/custom/NewlyVoopons";
import BrandToExplore from "@/components/custom/BrandToExplore";
import EventsNearYou from "@/components/custom/EventsNearYou";
import VooponYouLove from "@/components/custom/VooponYouLove";
import VooponYouLoveTwo from "@/components/custom/VooponYouLoveTwo";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
//

//
export default function Home() {
  //

  const { isAuthenticated, userDetails } = useAuth();

  console.log(isAuthenticated, userDetails?.user_id, "hello is authenticated");

  const storeState = useSelector((state) => state.user.userState);
  console.log(storeState, "data comes in to store4677");

  const [categories, setCategories] = useState([]);
  const [isMounted, setIsMounted] = useState(false);

  const [guestData, setGuestData] = useState({
    brands_to_explore: [],
    newly_added_voopons: [],
  });
  const [testimonialData, setTestimonialData] = useState([]);

  const [loginUserData, setLoginUserData] = useState([]);

  console.log(storeState, "****************");

  //

  // for category api user singin or logout both case run

  const fetchUserCategoryList = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/api/user_category_list`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      //
      console.log(response.data, "hello user data");

      setCategories(response.data.data);
    } catch (error) {
      console.error(error); // For debugging
    }
  };
  useLayoutEffect(() => {
    setIsMounted(true);

    if (isMounted) {
      fetchUserCategoryList();

      if (isAuthenticated === false) {
        guestUserData();
        testimonialsData();
      } else {
        authenticatedUserData(userDetails?.user_id);
        testimonialsData();
      }
    }

    return () => setIsMounted(false); // Cleanup to set isMounted to false on unmount
  }, [isMounted, storeState]);

  const guestUserData = async () => {
    //
    try {
      //
      const response = await axios.post(
        `${BASE_URL}/api/user_home_api_guest_user`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data.data, "guest Data");

      setGuestData(response.data.data);
    } catch (error) {
      console.error(error); // For debugging
    }
  };

  const testimonialsData = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/user_testimonial_all_get`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response.data.data, "testimonial Data");
      //
      setTestimonialData(response.data.data);
    } catch (error) {
      console.error(error); // For debugging
    }
  };
  const authenticatedUserData = async (user_id) => {
    try {
      //
      const formData = new FormData();
      formData.append("user_id", user_id);

      const response = await axios.post(
        `${BASE_URL}/api/user_home_api`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Set the content type to multipart/form-data
          },
        }
      );
      //
      console.log(response.data.data, "authenticated userData Data");
      //
      setLoginUserData(response.data.data);
    } catch (error) {
      console.error(error); // For debugging
    }
  };
  // handle refer

  const handleRefer = async (data) => {
    navigator.clipboard.writeText(data);
    toast.info("Refer Code copy");
  };

  return (
    <>
      <div className="banner">
        <div className="container">
          <div className="row d-flex align-items-center">
            <div className="col-lg-5">
              <div className="bnr-txt">
                <h1>VoolayVoo</h1>
                <h6>
                  VoolayVoo informs you of new products, services, and offerings
                  from your most favored and trusted retailers, restaurants,
                  food trucks, entertainment, sports, and recreation venues,
                  etc., when you want or need them.
                </h6>
                <button type="button" className="btn btn-bnr home-ban-btn">
                  <Link href={"/voopons"}>Explore more</Link>
                </button>
                <button type="button" className="btn btn-bnr home-ban-btn">
                  <Link href={"/map"}>
                    Show Map{" "}
                    <Image
                      width={25}
                      height={25}
                      src="/images/map-point.svg"
                      alt=""
                    />
                  </Link>
                </button>
              </div>
            </div>
            <div className="col-lg-7">
              <div className="banner-img">
                <Image
                  width={699}
                  height={453}
                  src="/images/banner-img.png"
                  alt="banner images"
                  className="img-fluid"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/*  this is for carousel */}
      {/* this code written by rajan */}
      <section className="clientbox">
        <div className="container">
          <div className="row justify-content-md-center">
            <div className="col-lg-12">
              <CarouselHeader categories={categories} />
            </div>
          </div>
        </div>
      </section>

      <div>
        <NewlyVoopons
          staticItems={
            isAuthenticated == false
              ? guestData?.newly_added_voopons
              : loginUserData.newly_added_voopons
          }
          title="Newly"
          title1="Added Voopons"
          brand={true}
        />
      </div>
      {/* newly added voopons */}

      {/* code */}
      <section className="about-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="about-img">
                <Image
                  width={546}
                  height={491}
                  src="/images/about.png"
                  alt="images"
                  className="img-fluid"
                />
              </div>
            </div>
            <div className="col-lg-6">
              <div className="about-txt">
                <h5 style={{ color: "#E60023" }}>About</h5>
                <div className="heading mb-3">
                  {" "}
                  What is <span> VoolayVoo? </span>{" "}
                </div>
                <p>
                  For Consumers: VoolayVoo informs you of new products,
                  services, and offerings from your most favored and trusted
                  retailers, restaurants, food trucks, entertainment, sports,
                  and recreation venues, etc., when you want or need them. For
                  Businesses: VoolayVoo Social Marketing™ allows Businesses to
                  conduct active, directed, and timely marketing campaigns for
                  just-in-time promotions, events, and offerings and attuning it
                  to the needs of interested consumers exactly when they have a
                  need,
                </p>
                <p>
                  interest, or are in the buying mood. For Promoters: VoolayVoo
                  Social Marketing™ allows Promoters to actively and timely
                  engage consumers by utilizing their social media influence and
                  presence to curate, create, manage, publish, and share events,
                  promotions, and campaigns and attuning it to the needs of
                  interested consumers exactly when they have a need, interest,
                  or are in the buying mood.
                </p>
                <Link
                  className="btn btn-learnmore"
                  href={"/about"}
                  role="button"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* {isMounted == true && isAuthenticated == true && (
        <VooponYouLove staticItems={loginUserData.voopon_you_will_love} />
      )} */}

      {isMounted == true && isAuthenticated == true && (
        <VooponYouLoveTwo staticItems={loginUserData.voopon_you_will_love} />
      )}
      <section className="how-it-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 mb-5 pb-4">
              <div className="heading text-white text-center">How it Works</div>
              <p className="text-center text-white">
                VOOLAY-VOO “(what) do you want (to do)?” A Collaborative,
                Social, Marketplace in the palm of your hand that creates an
                interdependent and connected community of individuals who
                actively engage local businesses and promoters of events and
                services. VOOLAY-VOO provides users notifications of events,
                activities, and collaborative efforts of businesses and
                promoters whom they follow.{" "}
              </p>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="howbox">
                <div className="how-icon">
                  <Image
                    width={133}
                    height={133}
                    src="/images/how-icon-1.png"
                    alt=""
                  />
                </div>
                <div className="howhd">
                  Choose your <br /> interest
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="howbox">
                <div className="how-icon">
                  <Image
                    width={133}
                    height={133}
                    src="/images/how-icon-2.png"
                    alt=""
                  />
                </div>
                <div className="howhd">
                  Turn on your location and notification{" "}
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="howbox">
                <div className="how-icon">
                  <Image
                    width={133}
                    height={133}
                    src="/images/how-icon-3.png"
                    alt=""
                  />
                </div>
                <div className="howhd">
                  Receive Notifications of Events, and activities from your
                  favorite Business &Promotors
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="howbox">
                <div className="how-icon">
                  <Image
                    width={133}
                    height={133}
                    src="/images/how-icon-4.png"
                    alt=""
                  />
                </div>
                <div className="howhd">
                  Share with Friends and on social media.
                </div>
              </div>
            </div>
            <div className="col-lg-12 text-center mt-4">
              <Link
                className="btn btn-learnmore"
                href={"/how-it-works"}
                role="button"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>
      <BrandToExplore
        staticItems={
          isAuthenticated == false
            ? guestData.brands_to_explore
            : loginUserData?.brands_to_explore
        }
        title="Brands"
        title1="To Explore"
        brand={false}
      />

      {isAuthenticated == true && (
        <EventsNearYou
          staticItems={loginUserData?.events_near_you}
          title="Events"
          title1="Near You"
          brand={false}
        />
      )}

      <section className="subscribe-sec">
        <SubscribeHome />
      </section>
      <section className="testimonials-sec">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 text-center heading mb-5">
              <span>Testimonials</span>
            </div>
            {testimonialData.length > 0 &&
              testimonialData?.map((item, index) => {
                return (
                  <div
                    className="col-lg-4 col-md-6"
                    key={`${item.id}-${item.description}-${index}`}
                  >
                    <div className="testi-box">
                      <div className="testi-img">
                        <Image
                          width={38}
                          height={38}
                          // src="/images/profile.png"
                          src={`${BASE_URL}/testimonial/${item.profile}`}
                          alt=""
                        />
                      </div>
                      <div className="testi-text">
                        <div className="testi-name-date">
                          <span>{item?.name}</span>
                          <span>{item?.time}</span>
                        </div>
                        <div className="testi-text-box">
                          <h5>{item?.name}</h5>
                          <p>{item.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </section>

      {isAuthenticated == true && (
        <section className="refer-sec">
          <div className="container">
            <div className="row g-0 refer-bg">
              <div className="col-lg-2 col-md-2 img-right">
                <Image
                  width={159}
                  height={331}
                  src="/images/refer-img.png"
                  alt=""
                />
              </div>
              <div className="col-lg-6 col-md-7">
                <div className="referbox-text">
                  <h1 style={{ fontFamily: "Montserrat; font-weight: 700" }}>
                    Refer & Earn Rewards
                  </h1>
                  <h2>Invite friends & business</h2>
                  <p>Refer a Friend and earn exciting rewards!</p>
                  <a
                    className="btn btn-viewmore"
                    href="#"
                    role="button"
                    onClick={() =>
                      handleRefer(
                        `Your referral code is: ${loginUserData.user_referral_code.referral_code}`
                      )
                    }
                  >
                    Refer Friend
                  </a>
                </div>
              </div>
              <div className="col-lg-4 col-md-3">
                <Image
                  width={356}
                  height={328}
                  src="/images/refer-img2.png"
                  className="img-fluid"
                  alt=""
                />
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
