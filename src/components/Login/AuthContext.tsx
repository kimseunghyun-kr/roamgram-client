import { useInterval } from "@mantine/hooks";
import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider(props) {
  const [refreshToken, setRefreshToken] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const value = {
    isLoggedIn,
    setIsLoggedIn,
    refreshToken,
    setRefreshToken,
  };

  const interval = useInterval(async () => {
    const token = sessionStorage.getItem(`authToken`);
    if (!token) return null;
    const isExpired = isTokenExpired(token);
    if (!isExpired) return null;
    else {
      alert("Please Sign Back for Access");
      sessionStorage.removeItem(`authToken`);
      sessionStorage.removeItem(`refreshToken`);
      navigate("/login");
      {
        /*
    
    
      const rt = sessionStorage.getItem(`authToken`);
      const response = await fetch(
        `${import.meta.env.VITE_APP_API_URL}/authentication/refresh`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(rt),
        }
      );
      if (!response.ok) {
        throw new Error("Unable to refresh Token");
      }

      const data = await response;
      console.log(data, "this is the new token");
    }
    */
      }
    }
  }, 10000);

  useEffect(() => {
    interval.start();
  }, []);

  return (
    <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
  );
}

export function isTokenExpired(token) {
  if (!token) return true;
  const decode = jwtDecode(token);
  const currentTime = Date.now() / 1000;
  return currentTime > decode.exp; //checks whether token is expired or not
}
