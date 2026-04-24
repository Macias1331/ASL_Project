import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "./authContext";

function Auth() {
  const { token } = useAuth();
  if (!token) return <Navigate to="/" />;
  return <Outlet />;
}

export default Auth;