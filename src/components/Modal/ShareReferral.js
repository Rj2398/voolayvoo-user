import { Modal, Box } from "@mui/material";
import Image from "next/image";
import { useState } from "react";

const ShareReferral = ({ open, setOpen, code }) => {
  const [selectedIcon, setSelectedIcon] = useState(null);
  console.log(selectedIcon, "select icon");

  const handleShare = (e) => {
    e.preventDefault();
    switch (selectedIcon) {
      case "twitter": {
        window.open(
          `https://twitter.com/intent/tweet?text=Check%20out%20this%20referral%20code:%20${code}`,
          "_blank",
          "noreferrer"
        );
        break;
      }
      case "whatsapp": {
        window.open(
          `https://wa.me/?text=Check%20out%20this%20referral%20code:%20${code}`,
          "_blank",
          "noreferrer"
        );
        break;
      }
      case "snapchat": {
        window.open(`https://www.snapchat.com/`, "_blank", "noreferrer");
        break;
      }
      case "instagram": {
        window.open(
          `https://instagram.com/intent/tweet?text=Check%20out%20this%20referral%20code:%20${code}`,
          "_blank",
          "noreferrer"
        );
        break;
      }
      case "indeed": {
        window.open(`https://linkedin.com`, "_blank", "noreferrer");
        break;
      }
      case "facebook": {
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fplugins%2F&amp;src=${code}`,
          "_blank",
          "noreferrer"
        );
        break;
      }
    }
    // setSelectedIcon(null);
  };
  return (
    <>
      <Modal open={open}>
        <Box>
          <div
            className="modal fade show"
            style={{ display: "block", paddingRight: "0px" }}
          >
            <div className="modal-dialog share-width" style={{ top: "20%" }}>
              <div className="modal-content">
                <div className="modal-header">
                  <h5
                    className="modal-title modal-title-center add-card-hd"
                    id=""
                  >
                    Refer Friend
                  </h5>
                  <button
                    onClick={() => setOpen(false)}
                    type="button"
                    className="close collab-btn"
                  >
                    <span aria-hidden="true">
                      <Image
                        width={28}
                        height={28}
                        src="/images/cross.svg"
                        alt=""
                      />
                    </span>
                  </button>
                </div>
                <div className="modal-body" style={{ paddingTop: 0 }}>
                  <div className="share-container">
                    <div
                      className={`share-wrapper ${
                        selectedIcon === "twitter" ? "selected" : ""
                      }`}
                      onClick={() => setSelectedIcon("twitter")}
                    >
                      <Image
                        width={56}
                        height={56}
                        src="/images/social-icon-1.svg"
                        alt="images"
                      />
                    </div>
                    <div
                      className={`share-wrapper ${
                        selectedIcon === "whatsapp" ? "selected" : ""
                      }`}
                      onClick={() => setSelectedIcon("whatsapp")}
                    >
                      <Image
                        width={56}
                        height={56}
                        src="/images/social-icon-2.svg"
                        alt="images"
                      />
                    </div>
                    <div
                      className={`share-wrapper ${
                        selectedIcon === "instagram" ? "selected" : ""
                      }`}
                      onClick={() => setSelectedIcon("instagram")}
                    >
                      <Image
                        width={56}
                        height={56}
                        src="/images/social-icon-3.svg"
                        alt="images"
                      />
                    </div>
                    <div
                      className={`share-wrapper ${
                        selectedIcon === "facebook" ? "selected" : ""
                      }`}
                      onClick={() => setSelectedIcon("facebook")}
                    >
                      <Image
                        width={56}
                        height={56}
                        src="/images/social-icon-4.svg"
                        alt="images"
                      />
                    </div>
                    <div
                      className={`share-wrapper ${
                        selectedIcon === "snapchat" ? "selected" : ""
                      }`}
                      onClick={() => setSelectedIcon("snapchat")}
                    >
                      <Image
                        width={56}
                        height={56}
                        src="/images/social-icon-5.svg"
                        alt="images"
                      />
                    </div>
                    <div
                      className={`share-wrapper ${
                        selectedIcon === "indeed" ? "selected" : ""
                      }`}
                      onClick={() => setSelectedIcon("indeed")}
                    >
                      <Image
                        width={56}
                        height={56}
                        src="/images/social-icon-6.svg"
                        alt="images"
                      />
                    </div>
                  </div>
                  <div className="share-refer-btn">
                    <a href="#" onClick={handleShare}>
                      Share
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default ShareReferral;
