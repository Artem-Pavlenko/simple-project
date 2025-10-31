import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Toast Container component with custom styling
export const ToastProvider = () => (
  <ToastContainer
    position="top-right"
    autoClose={3000}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    theme="light"
    style={{
      fontSize: "14px",
      fontFamily: "inherit",
    }}
  />
);
