import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ConfirmEmail() {
  const url = window.location.search; //gerts the current url
  const urlParams = new URLSearchParams(url); //gets confirmation Token
  const confirmationToken = urlParams.get(`confirmationToken`);
  const navigate = useNavigate();
  console.log("cfmtoken", confirmationToken);

  //checking if double slash
  sessionStorage.removeItem(`authToken`);

  const confirm = async () => {
    const res = await fetch(
      `${
        import.meta.env.VITE_APP_API_URL
      }/authentication/confirm?token=${confirmationToken}`,
      { method: "POST" }
    )
      .then((res) => res.json())
      .then((data) => window.close());

    return res;
  };

  useEffect(() => {
    if (confirmationToken) {
      confirm();
      alert("Email confirmation is Succesful!");
      navigate("/login");
    }
  }, []);

  return <></>;
}

export default ConfirmEmail;
