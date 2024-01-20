export const baseUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : "https://redux-toolkit-crud-auth-backend.vercel.app";
