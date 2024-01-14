import "@/styles/globals.css";

// ** Redux Import
import { Provider } from "react-redux";
import { store } from "@/redux/store";

// ** Third Party Import
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "@/components/sidebar/Sidebar";

import dynamic from "next/dynamic";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";

const Header = dynamic(() => import("../components/header/Header"), {
  ssr: false,
  loading: () => (
    <Box sx={{ width: "100%" }}>
      <LinearProgress />
    </Box>
  ),
});

export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <div>
        <Header />
      </div>
      <div style={{ display: "flex" }}>
        <div>
          <Sidebar />
        </div>
        <div style={{ width: "100%" }}>
          <Component {...pageProps} />
        </div>
      </div>
      <ToastContainer />
    </Provider>
  );
}
