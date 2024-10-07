"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "../UserProvider";

export default function RootLayout({ children }) {
  const path = usePathname();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [isMounted, setIsMounted] = useState(false);

  console.log(isAuthenticated, "heloo authenticated data h");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isMounted) {
      if (!isAuthenticated) {
        console.log("Redirecting to /");
        router.push("/");
      } else {
        setLoading(false);
      }
    } else {
      setIsMounted(true);
    }
  }, [isMounted, isAuthenticated, router]);

  // useEffect(() => {
  //   setIsMounted(true); // Ensures client-side rendering is handled correctly
  //   if (!isAuthenticated) {
  //     console.log("not runned");
  //     router.push("/voopons");
  //   }
  // }, [isAuthenticated, router]);

  // Early return to prevent hydration issues
  if (!isMounted) {
    return null;
  }

  if (!isAuthenticated) {
    return null;
  } else if (
    isAuthenticated &&
    (path.startsWith("/my/voopons/") || path.startsWith("/my/events/"))
  ) {
    return <>{children}</>;
  } else {
    return (
      <>
        <section className="user-dashboard">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="user-dashboard-inner">
                  <div className="user-dashboard-list">
                    <ul>
                      <li>
                        <Link
                          href={"/my/profile"}
                          className={
                            path === "/my/profile" || path === "/my"
                              ? "active"
                              : ""
                          }
                        >
                          <Image
                            width={22}
                            height={22}
                            src="/images/user-dashboard/icons/1.svg"
                            alt="My Profile"
                          />{" "}
                          My Profile
                        </Link>
                      </li>
                      <li>
                        <Link
                          href={"/my/voopons"}
                          className={path === "/my/voopons" ? "active" : ""}
                        >
                          <Image
                            width={22}
                            height={22}
                            src="/images/user-dashboard/icons/2.svg"
                            alt="My Voopons"
                          />{" "}
                          My Voopons
                        </Link>
                      </li>
                      <li>
                        <Link
                          href={"/my/events"}
                          className={path === "/my/events" ? "active" : ""}
                        >
                          <Image
                            width={22}
                            height={22}
                            src="/images/user-dashboard/icons/3.svg"
                            alt="My Events"
                          />{" "}
                          My Events
                        </Link>
                      </li>
                      <li>
                        <Link
                          href={"/payment-method"}
                          className={path === "/payment-method" ? "active" : ""}
                        >
                          <Image
                            width={22}
                            height={22}
                            src="/images/user-dashboard/icons/4.svg"
                            alt="Payment Method"
                          />{" "}
                          Payment Method
                        </Link>
                      </li>
                      <li>
                        <Link
                          href={"/my/interests"}
                          className={path === "/my/interests" ? "active" : ""}
                        >
                          <Image
                            width={22}
                            height={22}
                            src="/images/user-dashboard/icons/5.svg"
                            alt="My Interests"
                          />{" "}
                          My Interests
                        </Link>
                      </li>
                      <li>
                        <Link
                          href={"/my/favorites"}
                          className={path === "/my/favorites" ? "active" : ""}
                        >
                          <Image
                            width={22}
                            height={22}
                            src="/images/user-dashboard/icons/6.svg"
                            alt="My Favorites"
                          />{" "}
                          My Favorites
                        </Link>
                      </li>
                      <li>
                        <Link
                          href={"/refer-friend"}
                          className={path === "/refer-friend" ? "active" : ""}
                        >
                          <Image
                            width={22}
                            height={22}
                            src="/images/user-dashboard/icons/7.svg"
                            alt="Refer A Friend"
                          />{" "}
                          Refer A Friend
                        </Link>
                      </li>
                    </ul>
                  </div>
                  {children}
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }
}
