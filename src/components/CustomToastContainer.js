import React, { ReactNode } from "react";
import { ToastContainer as OriginalToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// interface CustomToastContainerProps {
//   children: ReactNode;
// }

const CustomToastContainer = () => {
  return (
    <OriginalToastContainer
      position="bottom-left"
      autoClose={5000}
      hideProgressBar
      newestOnTop
      closeOnClick
      rtl
      pauseOnFocusLoss={false}
      draggable
      pauseOnHover
      theme="colored"
      // transition={"Bounce"}
    />
  );
};

export default CustomToastContainer;
