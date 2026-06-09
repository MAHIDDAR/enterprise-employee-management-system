import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

function ProtectedRoute() {

  const location =
    useLocation();

  const isLoggedIn =
    localStorage.getItem(
      "isLoggedIn"
    );

  const accountStatus =
    localStorage.getItem(
      "accountStatus"
    );

  if (!isLoggedIn) {

    return <Navigate to="/" />;

  }

  if (
    accountStatus === "Deactivated"
    &&
    location.pathname !==
    "/account-deactivated"
  ) {

    return (
      <Navigate
        to="/account-deactivated"
      />
    );

  }

  return <Outlet />;
}

export default ProtectedRoute;