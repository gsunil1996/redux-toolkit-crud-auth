import "@/styles/globals.css";

// ** Redux Import
import { Provider } from "react-redux";
import { store } from "@/redux/store";

// ** Third Party Import
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
      <ToastContainer />
    </Provider>
  );
}
