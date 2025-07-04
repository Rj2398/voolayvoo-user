import { Modal, Box } from "@mui/material";
import { BASE_URL, STRIPE_PUB_KEY } from "@/constant/constant";
import { useCallback } from "react";
import { toast } from "react-toastify";

const ShowQrCode = ({ open, setOpen, codeData, label }) => {

  const handleCopy = useCallback(
    (e) => {
      e.preventDefault();
      navigator.clipboard.writeText(`${BASE_URL}/${codeData}`);
      toast.info("QR Code copy");
    },
    [codeData]
  );
  return (
    <Modal open={open} className="password-popup">
      <Box>
        <div
          className="modal fade show"
          style={{ display: "block", paddingRight: "0px", height: "auto" }}
          id="buy-voopon"
          tabIndex={-1}
          // aria-labelledby="buy-voopon"
          // aria-hidden="true"
        >
          <div className="modal-dialog card-width user-event-popup">
            <div className="modal-content">
              <div className="modal-header pb-0">
                <h5
                  className="modal-title modal-title-center add-card-hd"
                  id=""
                >
                  {label}
                </h5>
                <button
                  type="button"
                  className="close collab-btn"
                  onClick={() => setOpen(false)}
                >
                  <span aria-hidden="true">
                    <img src="/images/cross.svg" alt="" />
                  </span>
                </button>
              </div>
              <div className="modal-body pt-0">
                <div className="add-to-card">
                  <form>
                    {codeData && (
                      <div className="code-share">
                        <img src={`${BASE_URL}/${codeData}`} alt="QR Code" />
                      </div>
                    )}
                    {!codeData && (
                      <div className="code-share">
                        <h6>QR Code not generated.</h6>
                      </div>
                    )}
                    <a
                      className="btn submit-add-card mt-3 mb-2"
                      href="#"
                      onClick={handleCopy}
                    >
                      {" "}
                      Share{" "}
                    </a>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default ShowQrCode;
