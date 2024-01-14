import dynamic from "next/dynamic";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";

const CrudOperations = dynamic(
  () => import("../../components/crud-operations/CrudOperations"),
  {
    ssr: false,
    loading: () => (
      <Box sx={{ width: "100%" }}>
        <LinearProgress />
      </Box>
    ),
  }
);

const Index = () => {
  return <CrudOperations />;
};

export default Index;
