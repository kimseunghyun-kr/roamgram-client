import {
  Card,
  CardSection,
  Container,
  Text,
  Image,
  TextInput,
  PasswordInput,
  Button,
  Divider,
  UnstyledButton,
} from "@mantine/core";
import React from "react";
import { FcGoogle } from "react-icons/fc";

function LoginPage() {
  return (
    <>
      <Container>
        <h1>Login Page</h1>
        <Card shadow="xl">
          <CardSection>
            <Image h={75} w="auto" src="src\assets\RoamGram Logo.png"></Image>
          </CardSection>
          <TextInput placeholder="Enter Email Address"></TextInput>
          <PasswordInput></PasswordInput>
          <Button>Continue</Button>
          <br></br>
          <Divider label="or" labelPosition="center"></Divider>
          <Button variant="light" leftSection={<FcGoogle size={20} />}>
            Continue with Google
          </Button>
          <Text>Don't have an account?</Text>
          <UnstyledButton>Create an account</UnstyledButton>
        </Card>
      </Container>
    </>
  );
}

export default LoginPage;
