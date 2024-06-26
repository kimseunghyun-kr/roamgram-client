import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function GoogleLogin() {
  const url = window.location.search;
  const urlParams = new URLSearchParams(url);
  const navigate = useNavigate();

  console.log(url);
  sessionStorage.setItem(`authToken`, `${urlParams.get("accessToken")}`);

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
