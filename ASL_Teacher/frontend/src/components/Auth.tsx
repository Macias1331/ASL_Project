import { Navigate, Outlet } from "react-router-dom";
import { isLoggedIn } from "../api";

function Auth() {
  if (!isLoggedIn()) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default Auth;
