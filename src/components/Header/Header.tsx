import {
  Button,
  Container,
  Divider,
  Group,
  Image,
  Space,
  UnstyledButton,
  Text,
} from "@mantine/core";
import "./Header.css";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../Login/AuthContext";

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const authToken = sessionStorage.getItem(`authToken`);
    if (authToken) {
      setIsLoggedIn(true);
    }
    //console.log("logged in?", isLoggedIn);
  });

  //this is for debugging purposes//

  const nav = useNavigate();

  const relogin = () => {
    fetch(`https://localhost/authentication/sign-in`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "string",
        password: "string",
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        sessionStorage.setItem(`authToken`, data.accessToken);
        const token = data.accessToken;
        const decoded = jwtDecode(token as string);
        console.log(decoded);

        //console.log(data.accessToken);
      });
  };

  const checkToken = () => {
    const decoded = jwtDecode(sessionStorage.getItem(`authToken`));
    console.log(decoded);
  };

  const { setRefreshToken } = useAuth();

  return (
    <header>
      {/* debugging purposes

      <Button onClick={checkToken}>Test</Button>
      <Button onClick={relogin}>Relogin refresh</Button>
*/}
      <Container w={1700} size="1900" style={{ display: "flex" }}>
        <Link to="/">
          <a href="#">
            <Image ml={120} w={220} src="/assets/RoamGram Logo.png"></Image>
          </a>
        </Link>
        <Space w={400}></Space>
        <Group gap="xl" ml={500} className="header-group">
          <UnstyledButton className="header-button">Guide </UnstyledButton>
          <Link to="/planner">
            <UnstyledButton className="header-button">Routes</UnstyledButton>
          </Link>
          <Link to="/travelPage">
            <UnstyledButton className="header-button">Planner</UnstyledButton>
          </Link>
          {!isLoggedIn ? (
            <Link to="/login">
              <Button
                className="header-login"
                h={30}
                w={140}
                radius="xl"
                color={"cyan"}
                style={{ fontSize: "13px" }}
              >
                Login / Sign Up
              </Button>
            </Link>
          ) : (
            <>
              <Button
                className="header-logout"
                h={30}
                w={140}
                radius="xl"
                color={"cyan"}
                style={{ fontSize: "13px" }}
                onClick={() => {
                  sessionStorage.removeItem(`authToken`);
                  sessionStorage.removeItem(`refreshToken`);
                  nav(0);
                }}
              >
                Log Out
              </Button>
            </>
          )}
        </Group>
      </Container>
      <Divider></Divider>
    </header>
  );
}

export default Header;
