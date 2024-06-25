import {
  Button,
  Container,
  Divider,
  Group,
  Image,
  Space,
  Tabs,
  UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import "./Header.css";
import { Link } from "react-router-dom";

function Header() {
  const links = [
    { link: "", label: "Home" },
    { link: "", label: "Routes" },
    { link: "", label: "Planner" },
  ];

  return (
    <header>
      <Container w={1700} size="1900" style={{ display: "flex" }}>
        <Link to="/">
          <a href="#">
            <Image ml={120} w={220} src="\src\assets\RoamGram Logo.png"></Image>
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
        </Group>
      </Container>
      <Divider></Divider>
    </header>
  );
}

export default Header;
