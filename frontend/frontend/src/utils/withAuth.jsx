import { Navigate } from "react-router-dom";

const withAuth = (Component) => {
  return () => {
    const token = localStorage.getItem("token");

    if (!token) {
      return <Navigate to="/auth" />;
    }

    return <Component />;
  };
};

export default withAuth;