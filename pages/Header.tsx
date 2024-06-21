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

function Header() {
  const links = [
    { link: "", label: "Home" },
    { link: "", label: "Routes" },
    { link: "", label: "Planner" },
  ];

  return (
    <header>
      <Container w={1300} size="xl" style={{ display: "flex" }}>
        <a href="#">
          <Image w={200} src="src\assets\RoamGram Logo.png"></Image>
        </a>
        <Space w={75}></Space>
        <Group gap="xl" ml={500} className="header-group">
          <UnstyledButton className="header-button">Guide </UnstyledButton>
          <UnstyledButton className="header-button">Routes</UnstyledButton>
          <UnstyledButton className="header-button">Planner</UnstyledButton>
          <UnstyledButton style={{ fontWeight: 600 }} className="header-button">
            Sign Up
          </UnstyledButton>
          <Button
            className="header-login"
            h={30}
            w={75}
            radius="xl"
            color={"cyan"}
            style={{ fontSize: "13px" }}
          >
            Login
          </Button>
        </Group>
      </Container>
      <Divider></Divider>
    </header>
  );
}

export default Header;
