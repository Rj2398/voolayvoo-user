"use client";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Modal, Box } from "@mui/material";

const Dialog = ({ open }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lastPath = searchParams.get("lastPath");

  const handleCloseClick = () => {
    if (lastPath) {
      router.push(`${lastPath}`);
    } else {
      router.push("/your-interests");
    }
  };
  return (
    <>
      <Modal open={open}>
        <Box>
          <div
            className="modal fade show"
            aria-hidden="true"
            style={{ display: "block", paddingRight: "0px" }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header border-0">
                  <h5 className="modal-title" id="exampleModalLabel"></h5>
                  <button
                    onClick={handleCloseClick}
                    type="button"
                    className="close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <div className="modal-box">
                    <div className="modal-hd mb-3">Congratulations!</div>
                    <div className="cong-img mb-4">
                      <Image
                        width={145}
                        height={147}
                        src="/images/Congratulations-icon.png"
                        alt="images"
                        className="img-fluid"
                      />
                    </div>
                    <div className="cong-text">
                      <p>Welcome to Voolay Voo.</p>
                      <p>
                        Your account is created successfully on our platform.
                      </p>
                    </div>
                    <Link
                      className="btn btn-learnmore mb-5"
                      style={{ width: "75%" }}
                      href={lastPath ? `${lastPath}` : "/your-interests"}
                      // href={
                      //   "/login"
                      //   // "/your-interests"
                      // }
                    >
                      {" "}
                      OK{" "}
                    </Link>
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
