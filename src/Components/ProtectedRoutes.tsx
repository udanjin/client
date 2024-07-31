import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

const ProtectedRoutes = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  useEffect(() => {
    const checkLoggedIn = async () => {
      const getToken = localStorage.getItem("token");
      if (getToken && !checkTokenExpired(getToken)) {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
        localStorage.removeItem("token");
        window.location.href = "/admin/login/";
      }
    };
    setLoading(false); 
    checkLoggedIn();
  }, []);
  const checkTokenExpired = (token: string): boolean => {
    const tokenData = JSON.parse(atob(token.split(".")[1]));
    const expirationTime = tokenData.exp * 1000;
    const currentTime = Date.now();

    return expirationTime < currentTime;
  };
  if (loading) {
    return <div> Loading...</div>;
  }

  return loggedIn && !loading ? <Outlet /> : <></>;
};

export default ProtectedRoutes;
