import { useEffect } from "react";
import Modal from "react-modal";

const AuthModal = ({ isOpen, onClose }) => {
  console.log(isOpen, "is open");

  // Custom styles for the modal, including transition for the animation
  const customStyles = {
    content: {
      top: "0%", // Start from the top (animation will handle transition)
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, 0%)", // Adjust the centering during animation
      borderRadius: "15px", // Rounded corners
      transition: "transform 0.5s ease-out", // Smooth animation
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background, not blurred
    },
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={customStyles}
      contentLabel="Logout Modal"
      onAfterOpen={() => {
        document.querySelector(".ReactModal__Content").style.transform =
          "translate(-50%, 20%)";
      }}
    >
      <div className="modal-dialog modal-dialog-edit" role="document">
        <div className="modal-content">
          <div className="modal-heading">
            <button
              type="button"
              className="btn-close"
              onClick={() => onClose(false)}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <form>
              <div className="profileverify-popup-wrap">
                <h1>Logout</h1>
                <p>Are you sure you want to logout?</p>
                <div className="delete-account-btns">
                  <button
                    type="button"
                    onClick={() => console.log("Logging out")}
                  >
                    Yes
                  </button>
                  <button type="button" onClick={() => onClose(false)}>
                    No
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AuthModal;
