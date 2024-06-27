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
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const authToken = sessionStorage.getItem(`authToken`);
    if (authToken) {
      setIsLoggedIn(true);
    }
    //console.log("logged in?", isLoggedIn);
  });
  return (
    <header>
      <Link to="/schedulePage/travelID?id=4fe8f11a-f159-4625-8c8e-e6bcfdf860c2">
        <Button>Test Schedules</Button>
      </Link>
      <Container w={1700} size="1900" style={{ display: "flex" }}>
        <Link to="/">
          <a href="#">
            <Image ml={120} w={220} src="assets/RoamGram Logo.png"></Image>
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
            <Text
              style={{
                fontSize: "15zpx",
                fontFamily: "Arial",
                color: "#4A5167",
              }}
            >
              Welcome
            </Text>
          )}
        </Group>
      </Container>
      <Divider></Divider>
    </header>
  );
}

export default Header;
