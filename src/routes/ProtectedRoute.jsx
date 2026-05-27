import {
  Navigate,
  Outlet,
} from "react-router-dom";

function ProtectedRoute() {

  const isLoggedIn =
    localStorage.getItem(
      "isLoggedIn"
    );

  return isLoggedIn ? (
    <Outlet />
  ) : (
    <Navigate to="/" />
  );
}

export default ProtectedRoute;