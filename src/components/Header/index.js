"use client";
import Link from "next/link";
import Image from "next/image";
import ClientComponent from "./ClientComponent";
import { useAuth } from "@/app/UserProvider";

import { useEffect, useLayoutEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { BASE_URL } from "@/constant/constant";
import axios from "axios";
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
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();
  // const searchParams = useSearchParams();
  // const pathName = usePathname();

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
        console.error(err, "log error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userDetails]);
  //

  //

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search.length > 0) {
        handleSearch(search);
        setShowSuggestions(true);
      } else {
        setSearchResults([]);
        setShowSuggestions(false);
        setError(null);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  //
  const handleSearch = async (query) => {
    setLoading(true);
    setError(null);
    try {
      const url = "https://voolayvooapp.com/admin/api/auth/global-search";

      const postData = {
        q: query,
      };

      // --- CRITICAL CHANGE HERE: Pass the headers in the third argument of axios.post ---
      const response = await axios.post(url, postData, {
        headers: {
          // "Content-Type": "application/json", // Axios defaults to application/json for plain JS objects
          Authorization: `Bearer ${userDetails?.token}`, // Use optional chaining in case userDetails is null/undefined
        },
      });
      // --- END CRITICAL CHANGE ---

      setSearchResults(response.data?.data);
      console.log(response.data?.data, "sajkashdahskdhfsd");
    } catch (err) {
      console.error("Search API Error:", err);
      // Access error.response.data for server-sent error messages
      setError(
        err.response
          ? err.response.data.message || "An error occurred during search."
          : err.message
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (result) => {
    console.log(result, "fasjdfkshdfks");
    setSearch(result.title);
    setSearchResults([]);
    // setShowSuggestions(false);
    console.log("Selected:", result);

    if (result.type === "business") {
      // Only navigate if the type is 'business'
      router.push(`/businesses`);
    } else if (result.type === "events") {
      router.push(`/events`);
    } else if (result.type === "promoters") {
      router.push(`/promoters`);
    }
  };
  const handleInputBlur = () => {
    setTimeout(() => {
      if (
        !suggestionBoxRef.current ||
        !suggestionBoxRef.current.contains(document.activeElement)
      ) {
        setShowSuggestions(false);
      }
    }, 150);
  };

  const handleInputFocus = () => {
    if (search.length > 0 && searchResults.length > 0) {
      setShowSuggestions(true);
    }
  };
  return (
    <>
      <div className="top-part">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-md-0"></div>
            {/* <div className="col-lg-6 col-md-6">
              <form className="d-flex top-srchbox">
                <input
                  className="top-srch"
                  type="search"
                  placeholder="Search for Voopons, Events, Promoters , Businesses..."
                  aria-label="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {loading && <p>Loading search results...</p>}
                {searchResults.length > 0 && (
                  <ul>
                    {searchResults.map((result, index) => (
                      <li key={index}>
                        {result.name || result.title || JSON.stringify(result)}
                      </li>
                    ))}
                  </ul>
                )}
                {search.length > 0 &&
                  !loading &&
                  !error &&
                  searchResults.length === 0 && (
                    <p>No results found for "{search}"</p>
                  )}
                <button className="srch-btn" type="submit">
                  <Image
                    width={15}
                    height={16}
                    src="/images/search.png"
                    alt=""
                  />
                </button>
              </form>
            </div> */}

            <div className="col-lg-6 col-md-6">
              <form
                className="d-flex top-srchbox" // You might remove these classes if all styling is inline
                style={{
                  position: "relative",
                  marginBottom: "20px", // Example: added some space below
                }}
              >
                <input
                  className="top-srch" // You might remove this class if all styling is inline
                  type="search"
                  placeholder="Search for Voopons, Events, Promoters , Businesses..."
                  aria-label="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onBlur={() =>
                    setTimeout(() => setShowSuggestions(false), 100)
                  }
                  onFocus={() => {
                    if (search.length > 0 && searchResults.length > 0)
                      setShowSuggestions(true);
                  }}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ced4da",
                    borderRadius: "5px",
                    fontSize: "16px",
                  }}
                />

                {showSuggestions && (
                  <>
                    {loading && (
                      <div
                        className="search-message" // You might remove this class
                        style={{
                          position: "absolute",
                          top: "100%",
                          left: "0",
                          width: "100%",
                          backgroundColor: "white",
                          border: "1px solid #ddd",
                          borderTop: "none",
                          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                          zIndex: "999",
                          padding: "8px 12px",
                          color: "#555",
                          borderRadius: "0 0 5px 5px",
                        }}
                      >
                        Loading search results...
                      </div>
                    )}

                    {error && (
                      <div
                        className="search-message" // You might remove this class
                        style={{
                          position: "absolute",
                          top: "100%",
                          left: "0",
                          width: "100%",
                          backgroundColor: "white",
                          border: "1px solid #ddd",
                          borderTop: "none",
                          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                          zIndex: "999",
                          padding: "8px 12px",
                          color: "#dc3545", // Error color
                          borderRadius: "0 0 5px 5px",
                        }}
                      >
                        Error: {error}
                      </div>
                    )}

                    {!loading && !error && searchResults.length > 0 && (
                      <ul
                        className="search-suggestions" // You might remove this class
                        style={{
                          position: "absolute",
                          top: "100%",
                          left: "0",
                          width: "100%",
                          backgroundColor: "white",
                          border: "1px solid #ddd",
                          borderTop: "none",
                          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                          zIndex: "1000",
                          maxHeight: "200px",
                          overflowY: "auto",
                          listStyle: "none",
                          padding: "0",
                          margin: "0",
                          borderRadius: "0 0 5px 5px",
                        }}
                      >
                        {searchResults.map((result, index) => (
                          <li
                            key={index}
                            onClick={() => handleSuggestionClick(result)}
                            style={{
                              padding: "8px 12px",
                              cursor: "pointer",
                              borderBottom:
                                index === searchResults.length - 1
                                  ? "none"
                                  : "1px solid #eee",
                            }}
                            // Note: :hover styles cannot be done inline easily without JavaScript
                            // You'd typically need onMouseEnter/onMouseLeave for hover effects with inline styles.
                          >
                            {result.title}({result.type})
                          </li>
                        ))}
                      </ul>
                    )}

                    {!loading &&
                      !error &&
                      search.length > 0 &&
                      searchResults.length === 0 && (
                        <div
                          className="search-message" // You might remove this class
                          style={{
                            position: "absolute",
                            top: "100%",
                            left: "0",
                            width: "100%",
                            backgroundColor: "white",
                            border: "1px solid #ddd",
                            borderTop: "none",
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                            zIndex: "999",
                            padding: "8px 12px",
                            color: "#555",
                            borderRadius: "0 0 5px 5px",
                          }}
                        >
                          No results found for "{search}"
                        </div>
                      )}
                  </>
                )}
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
                {isAuthenticated ? (
                  <a
                    className="nav-link joinbtn-inner"
                    href="https://voolayvooapp.com/admin/signin-promoter"
                  >
                    Join as Business/Promoter
                  </a>
                ) : (
                  <a className="nav-link joinbtn-inner" href="/login">
                    Join
                  </a>
                )}
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

// "use client";
// import Link from "next/link";
// import Image from "next/image";
// import ClientComponent from "./ClientComponent";
// import { useAuth } from "@/app/UserProvider";

// import { useEffect, useLayoutEffect, useState } from "react";
// import { usePathname, useRouter } from "next/navigation";
// import { BASE_URL } from "@/constant/constant";
// // import AuthModal from "../../components/custom/AuthModal";

// async function getData(id) {
//   const formData = new FormData();
//   formData.append("user_id", id);

//   const resPromoter = await fetch(`${BASE_URL}/api/user_notification_get`, {
//     method: "POST",
//     body: formData,
//   });

//   const resData = await resPromoter.json();

//   if (resData.code != 200) {
//     throw new Error("Failed to fetch data");
//   }

//   return {
//     responseNotification: resData?.data,
//   };
// }

// const Header = () => {
//   const { isAuthenticated, userDetails } = useAuth();
//   const [isModalOpen, setIsModalOpen] = useState(true);
//   const router = useRouter();
//   // const searchParams = useSearchParams();
//   // const pathName = usePathname();

//   // const lastPath = searchParams.get("lastPath");
//   const handleEventsClick = (e) => {
//     if (!isAuthenticated) {
//       e.preventDefault();
//       // router.push(`/login?lastPath=${pathName}`);
//       // router.push("/login");

//       router.push("/auth-users");
//     }
//   };

//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   useLayoutEffect(() => {
//     const fetchData = async () => {
//       if (!userDetails || !userDetails.user_id) {
//         setLoading(false);
//         return;
//       }

//       try {
//         // Call getData with user_id
//         const result = await getData(userDetails.user_id); // Use user_id from userDetails
//         setData(result);
//       } catch (err) {
//         console.error(err, "log error");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [userDetails]);
//   //
//   return (
//     <>
//       <div className="top-part">
//         <div className="container">
//           <div className="row">
//             <div className="col-lg-3 col-md-0"></div>
//             <div className="col-lg-6 col-md-6">
//               <form className="d-flex top-srchbox">
//                 <input
//                   className="top-srch"
//                   type="search"
//                   placeholder="Search for Voopons, Events, Promoters , Businesses..."
//                   aria-label="Search"
//                 />
//                 <button className="srch-btn" type="submit">
//                   <Image
//                     width={15}
//                     height={16}
//                     src="/images/search.png"
//                     alt=""
//                   />
//                 </button>
//               </form>
//             </div>

//             <ClientComponent notificationData={data} />
//           </div>
//         </div>
//       </div>

//       <nav className="navbar navbar-expand-lg bg-body-tertiary top-nav">
//         <div className="container navbar-gap">
//           <Link className="navbar-brand" href={"/"}>
//             <Image width={274} height={60} src="/images/logo.png" alt="" />
//           </Link>
//           <button
//             className="navbar-toggler"
//             type="button"
//             data-bs-toggle="collapse"
//             data-bs-target="#navbarSupportedContent"
//             aria-controls="navbarSupportedContent"
//             aria-expanded="false"
//             aria-label="Toggle navigation"
//           >
//             <span className="navbar-toggler-icon"></span>
//           </button>
//           <div
//             className="collapse navbar-collapse right-menu"
//             id="navbarSupportedContent"
//           >
//             <ul className="navbar-nav  mb-2 mb-lg-0 align-items-center">
//               <li className="nav-item">
//                 <Link className="nav-link" href={"/about"}>
//                   {" "}
//                   About{" "}
//                 </Link>
//               </li>
//               <li className="nav-item">
//                 <Link className="nav-link" href={"/voopons"}>
//                   {" "}
//                   Voopons{" "}
//                 </Link>
//               </li>
//               <li className="nav-item">
//                 <Link
//                   className="nav-link"
//                   href={"/events"}
//                   onClick={(e) => handleEventsClick(e)}
//                 >
//                   {" "}
//                   Events{" "}
//                 </Link>
//               </li>
//               <li className="nav-item">
//                 <Link
//                   className="nav-link"
//                   href={"/businesses"}
//                   onClick={(e) => handleEventsClick(e)}
//                 >
//                   {" "}
//                   Businesses{" "}
//                 </Link>
//               </li>
//               <li className="nav-item">
//                 <Link
//                   className="nav-link"
//                   href={"/promoters"}
//                   onClick={(e) => handleEventsClick(e)}
//                 >
//                   {" "}
//                   Promoters{" "}
//                 </Link>
//               </li>

//               <li className="nav-item joinbox">
//                 <a
//                   className="nav-link joinbtn-inner"
//                   href="https://voolayvooapp.com/admin/signin-promoter"
//                 >
//                   Join as Business/Promoter
//                 </a>
//               </li>

//               {/* <li className="nav-item joinbox">
//                 <Link
//                   className="nav-link joinbtn-inner"
//                   href={"/business-promoter"}
//                 >
//                   {" "}
//                   Join as Business/Promoter{" "}
//                 </Link>
//               </li> */}

//               {/* <li className="nav-item joinbox">
//                 <Link
//                   href="https://vooleyvoo.tgastaging.com/signin-promoter"
//                   passHref
//                 >
//                   <a className="nav-link joinbtn-inner">
//                     Join as Business/Promoter
//                   </a>
//                 </Link>
//               </li> */}
//             </ul>
//           </div>
//         </div>
//       </nav>
//       {/* <AuthModal isOpen={isModalOpen} onClose={(txt) => setIsModalOpen(txt)} /> */}
//     </>
//   );
// };

// export default Header;
