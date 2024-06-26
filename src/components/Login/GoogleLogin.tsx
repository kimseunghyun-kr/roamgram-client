import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function GoogleLogin() {
  const url = window.location.search;
  const urlParams = new URLSearchParams(url);
  const navigate = useNavigate();

  console.log(url);
  localStorage.setItem(`authToken`, `Bearer ${urlParams.get("accessToken")}`);

  useEffect(() => {
    if (localStorage.getItem(`authToken`)) {
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
