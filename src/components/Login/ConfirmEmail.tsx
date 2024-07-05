import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ConfirmEmail() {
  const url = window.location.search; //gerts the current url
  const urlParams = new URLSearchParams(url); //gets confirmation Token
  const navigate = useNavigate();

  //checking if double slash

  const confirm = (urlParams) =>
    fetch(
      `${
        import.meta.env.VITE_APP_API_URL
      }/authentication/confirm?token=${urlParams}`,
      { method: "POST" }
    )
      .then((res) => res.json())
      .then((data) => console.log("Successful confirmation"))
      .catch((error) => console.log("error confirming token", error));

  console.log("We are at Confirm Email");
  useEffect(() => {
    confirm(urlParams);
    navigate("/");
  }, []);
  return <></>;
}

export default ConfirmEmail;
