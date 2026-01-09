import React, { ReactNode } from "react";
import { ToastContainer as OriginalToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// interface CustomToastContainerProps {
//   children: ReactNode;
// }

const CustomToastContainer = () => {
  return (
    <OriginalToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar
      newestOnTop
      closeOnClick
      ltr
      pauseOnFocusLoss={false}
      draggable
      pauseOnHover
      theme="colored"
      // transition={"Bounce"}
    />
  );
};

export default CustomToastContainer;
