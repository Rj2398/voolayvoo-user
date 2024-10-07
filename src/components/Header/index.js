"use client";
import Link from "next/link";
import Image from "next/image";
import ClientComponent from "./ClientComponent";
import { useAuth } from "@/app/UserProvider";

import { useEffect, useLayoutEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { BASE_URL } from "@/constant/constant";
// import AuthModal from "../../components/custom/AuthModal";

async function getData(id) {
  const formData = new FormData();
  formData.append("user_id", id);

  const resPromoter = await fetch(`${BASE_URL}/api/user_notification_get`, {
    method: "POST",
    body: formData,
  });

  const resData = await resPromoter.json();

  if (resData.code != 200) {
    throw new Error("Failed to fetch data");
  }

  return {
    responseNotification: resData?.data,
  };
}

const Header = () => {
  const { isAuthenticated, userDetails } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(true);
  const router = useRouter();
  // const searchParams = useSearchParams();
  // const pathName = usePathname();
  // console.log(pathName, "hello pathe namememeememeemem");

  // const lastPath = searchParams.get("lastPath");
  const handleEventsClick = (e) => {
    if (!isAuthenticated) {
      e.preventDefault();
      // router.push(`/login?lastPath=${pathName}`);
      // router.push("/login");

      router.push("/auth-users");
    }
  };

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  console.log(data, "response of log");
  useLayoutEffect(() => {
    const fetchData = async () => {
      if (!userDetails || !userDetails.user_id) {
        setLoading(false);
        return;
      }

      try {
        // Call getData with user_id
        const result = await getData(userDetails.user_id); // Use user_id from userDetails
        setData(result);
      } catch (err) {
        console.log(err, "log error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userDetails]);
  //
  return (
    <>
      <div className="top-part">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-md-0"></div>
            <div className="col-lg-6 col-md-6">
              <form className="d-flex top-srchbox">
                <input
                  className="top-srch"
                  type="search"
                  placeholder="Search for Voopons, Events, Promoters , Businesses..."
                  aria-label="Search"
                />
                <button className="srch-btn" type="submit">
                  <Image
                    width={15}
                    height={16}
                    src="/images/search.png"
                    alt=""
                  />
                </button>
              </form>
            </div>

            <ClientComponent notificationData={data} />
          </div>
        </div>
      </div>

      <nav className="navbar navbar-expand-lg bg-body-tertiary top-nav">
        <div className="container navbar-gap">
          <Link className="navbar-brand" href={"/"}>
            <Image width={274} height={60} src="/images/logo.png" alt="" />
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="collapse navbar-collapse right-menu"
            id="navbarSupportedContent"
          >
            <ul className="navbar-nav  mb-2 mb-lg-0 align-items-center">
              <li className="nav-item">
                <Link className="nav-link" href={"/about"}>
                  {" "}
                  About{" "}
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" href={"/voopons"}>
                  {" "}
                  Voopons{" "}
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  href={"/events"}
                  onClick={(e) => handleEventsClick(e)}
                >
                  {" "}
                  Events{" "}
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  href={"/businesses"}
                  onClick={(e) => handleEventsClick(e)}
                >
                  {" "}
                  Businesses{" "}
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  href={"/promoters"}
                  onClick={(e) => handleEventsClick(e)}
                >
                  {" "}
                  Promoters{" "}
                </Link>
              </li>

              <li className="nav-item joinbox">
                <a
                  className="nav-link joinbtn-inner"
                  href="https://vooleyvoo.tgastaging.com/signin-promoter"
                >
                  Join as Business/Promoter
                </a>
              </li>

              {/* <li className="nav-item joinbox">
                <Link
                  className="nav-link joinbtn-inner"
                  href={"/business-promoter"}
                >
                  {" "}
                  Join as Business/Promoter{" "}
                </Link>
              </li> */}

              {/* <li className="nav-item joinbox">
                <Link
                  href="https://vooleyvoo.tgastaging.com/signin-promoter"
                  passHref
                >
                  <a className="nav-link joinbtn-inner">
                    Join as Business/Promoter
                  </a>
                </Link>
              </li> */}
            </ul>
          </div>
        </div>
      </nav>
      {/* <AuthModal isOpen={isModalOpen} onClose={(txt) => setIsModalOpen(txt)} /> */}
    </>
  );
};

export default Header;
