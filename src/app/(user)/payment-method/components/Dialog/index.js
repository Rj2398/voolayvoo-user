import Image from "next/image";
import { Modal, Box } from "@mui/material";

const Dialog = ({ open, setOpen }) => {
  return (
    <>
      <Modal open={open}>
        <Box>
          <div
            className="modal fade show"
            aria-hidden="true"
            style={{ display: "block", paddingRight: "0px" }}
          >
            <div className="modal-dialog card-width user-event-popup">
              <div className="modal-content">
                <div className="modal-header">
                  <h5
                    className="modal-title modal-title-center add-card-hd"
                    id=""
                  >
                    Add Card
                  </h5>
                  <button
                    onClick={() => setOpen(false)}
                    type="button"
                    className="close collab-btn"
                    aria-label="Close"
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
                <div className="modal-body">
                  <div className="add-to-card">
                    <form>
                      <div className="form-group">
                        <label>Card Holder Name</label>
                        <input
                          type="email"
                          className="form-control"
                          placeholder="Card Holder Name"
                        />
                      </div>
                      <div className="form-group">
                        <label>Card Number</label>
                        <input
                          type="email"
                          className="form-control card-img"
                          placeholder="****    ****    ****    ****"
                        />
                      </div>
                      <div className="grid-add-card">
                        <div className="exp-date">
                          <label>Expiry Date</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Month / Year"
                          />
                        </div>
                        <div className="exp-pass">
                          <label>CVV</label>
                          <input
                            type="password"
                            className="form-control"
                            placeholder="***"
                          />
                        </div>
                      </div>

                      <a className="btn submit-add-card mt-3 mb-2" href="#">
                        {" "}
                        Submit{" "}
                      </a>
                    </form>
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

export default Dialog;
