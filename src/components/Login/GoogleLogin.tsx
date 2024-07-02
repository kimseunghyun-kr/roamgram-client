import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

function GoogleLogin() {
  const url = window.location.search;
  const urlParams = new URLSearchParams(url);
  const navigate = useNavigate();
  const {
    authToken,
    setAuthToken,
    isLoggedIn,
    setIsLoggedIn,
    refreshToken,
    setRefreshToken,
  } = useAuth();

  console.log(url);
  sessionStorage.setItem(`authToken`, `${urlParams.get("accessToken")}`);
  setIsLoggedIn(true);
  setAuthToken(`${urlParams.get("accessToken")}`);
  //setRefreshToken(`${data.refreshToken}`);

  useEffect(() => {
    if (sessionStorage.getItem(`authToken`)) {
      console.log("success googleLogin");
      navigate("/");
    }
  }, []);

  return (
    <>
      <></>
    </>
  );
}

export default GoogleLogin;
