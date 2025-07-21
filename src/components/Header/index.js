"use client";
import Link from "next/link";
import Image from "next/image";
import ClientComponent from "./ClientComponent";
import { useAuth } from "@/app/UserProvider";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { BASE_URL } from "@/constant/constant";
import axios from "axios";

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
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false); // Initialize loading to false

  const router = useRouter();
  const searchContainerRef = useRef(null);

  const handleEventsClick = (e) => {
    if (!isAuthenticated) {
      e.preventDefault();
      router.push("/auth-users");
    }
  };

  const [data, setData] = useState([]);
  useLayoutEffect(() => {
    const fetchData = async () => {
      if (!userDetails || !userDetails.user_id) {
        setLoading(false);
        return;
      }

      try {
        const result = await getData(userDetails.user_id);
        setData(result);
      } catch (err) {
        console.error(err, "log error");
      }
    };

    fetchData();
  }, [userDetails]);

  // --- Click outside logic ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setLoading(false);
      setError(null);
      setShowSuggestions(false);
      return;
    }

    setLoading(true); // Set loading true immediately when search is triggered
    setError(null); // Clear previous errors

    try {
      const url = "https://voolayvooapp.com/admin/api/auth/global-search";
      const postData = { q: query };

      const response = await axios.post(url, postData, {
        headers: {
          Authorization: `Bearer ${userDetails?.token}`,
        },
      });

      setSearchResults(response.data?.data);
      setShowSuggestions(true); // Always show suggestions if a search was performed
    } catch (err) {
      console.error("Search API Error:", err);
      setError(
        err.response
          ? err.response.data.message || "An error occurred during search."
          : err.message
      );
      setSearchResults([]); // Clear results on error
      setShowSuggestions(true); // Keep the error message visible
    } finally {
      setLoading(false);
    }
  };

  // --- handleSuggestionClick ---
  const handleSuggestionClick = (result) => {
    setSearch(result.title); // Update the input field with the selected suggestion's title
    setSearchResults([]); // Clear search results
    setShowSuggestions(false); // Hide the suggestion box

    // Navigate based on the type
    if (result.type === "business") {
      router.push(`/businesses`); // Consider passing ID if navigating to specific details
    } else if (result.type === "event") {
      router.push(`/events`);
    } else if (result.type === "promoter") {
      router.push(`/promoters`);
    } else if (result.type === "voopon") {
      router.push("/voopons");
    }
  };

  const handleClearSearch = () => {
    setSearch("");
    setSearchResults([]);
    setError(null);
    setShowSuggestions(false);
    setLoading(false);
  };

  return (
    <>
      <div className="top-part">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-md-0"></div>
            <div className="col-lg-6 col-md-6" ref={searchContainerRef}>
              <form
                className="d-flex top-srchbox"
                style={{
                  position: "relative",
                  marginBottom: "20px",
                }}
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSearch(search); // Trigger search directly on form submission
                }}
              >
                <input
                  className="top-srch"
                  type="search"
                  placeholder="Search for Voopons, Events, Promoters , Businesses..."
                  aria-label="Search"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    // Trigger search directly when input changes
                    handleSearch(e.target.value);
                  }}
                  onFocus={() => {
                    // Show suggestions if there's text and results, or if loading/error
                    if (
                      search.length > 0 &&
                      (searchResults.length > 0 || loading || error)
                    ) {
                      setShowSuggestions(true);
                    }
                  }}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ced4da",
                    borderRadius: "5px",
                    fontSize: "16px",
                    paddingRight: search.length > 2 ? "40px" : "10px", // Add padding for the icon
                  }}
                />
                {search.length > 2 && (
                  <button
                    type="button"
                    className="clear-search-btn"
                    onClick={handleClearSearch}
                    style={{
                      position: "absolute",
                      right: "50px", // Adjust position as needed
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "20px",
                      height: "20px",
                      color: "#999",
                      fontSize: "18px",
                    }}
                  >
                    {/* &#x2715;{" "} */}
                    {/* Unicode for multiplication sign (a common cross icon) */}
                  </button>
                )}
                <button className="srch-btn" type="submit">
                  <Image
                    width={15}
                    height={16}
                    src="/images/search.png"
                    alt=""
                  />
                </button>

                {showSuggestions && (
                  <>
                    {loading && (
                      <div
                        className="search-message"
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
                        className="search-message"
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
                          color: "#dc3545",
                          borderRadius: "0 0 5px 5px",
                        }}
                      >
                        Error: {error}
                      </div>
                    )}

                    {!loading && !error && searchResults.length > 0 && (
                      <ul
                        className="search-suggestions"
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
                            key={result.id || index}
                            onClick={() => handleSuggestionClick(result)}
                            style={{
                              padding: "8px 12px",
                              cursor: "pointer",
                              borderBottom:
                                index === searchResults.length - 1
                                  ? "none"
                                  : "1px solid #eee",
                            }}
                          >
                            {result.title} ({result.type})
                          </li>
                        ))}
                      </ul>
                    )}

                    {!loading &&
                      !error &&
                      search.length > 0 &&
                      searchResults.length === 0 && (
                        <div
                          className="search-message"
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
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
