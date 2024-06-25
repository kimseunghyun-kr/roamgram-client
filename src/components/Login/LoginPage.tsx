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
  SimpleGrid,
  Center,
  Stack,
  Space,
  Flex,
  ActionIcon,
  Transition,
  Popover,
  PopoverDropdown,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import CreatePage from "./CreatePage.tsx";
import { IconArrowLeft, IconUser } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

function LoginPage() {
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      username: "",
      password: "",
    },
    validate: {
      username: (value) => (value.length > 0 ? null : "Invalid Username"),
      password: (value) =>
        value.length < 4 ? "Password should be more than 4 characters" : null,
    },
  });

  const formCreate = useForm({
    mode: "uncontrolled",
    initialValues: {
      username: "",
      password: "",
      name: "",
      email: "",
    },
    validate: {
      username: (value) => (value.length > 0 ? null : "Invalid Username"),
      password: (value) =>
        value.length < 4 ? "Password should be more than 4 characters" : null,
      name: (value) => (value.length > 0 ? null : "Invalid Name"),
      email: (value) =>
        /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value) ? null : "Invalid Email",
    },
  });

  const [section, setSection] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [success, setSuccess] = useState(false);

  // console.log("email is", form.getInputProps("email").defaultValue);
  //console.log({ ...form.getInputProps("email") });

  //console.log({ ...form.getInputProps("password") });
  const exampleValues = {
    username: "string",
    password: "string",
  };

  function continueLogIn(values: {}) {
    fetch(`http://localhost:8080/authentication/sign-in`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch(
        (error) => (
          console.log("Error getting user authentication"), setLoginError(true)
        )
      );
  }

  function createAccount(values: {}) {
    fetch(`http://localhost:8080/authentication/sign-up`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })
      .then((response) => response.json())
      .then((data) => console.log("Success Registering, data is", data))
      .catch((error) => console.log("Error Signing Up"));
  }

  return (
    <>
      <Center>
        <Card
          withBorder
          mt={85}
          w={1300}
          h={800}
          pt={0}
          shadow="xl"
          radius="md"
        >
          <SimpleGrid cols={2}>
            {section === false ? (
              <form
                onSubmit={form.onSubmit(
                  (values, event) => (
                    console.log(values, event), continueLogIn(values)
                  )
                )}
              >
                <div
                  style={{
                    textAlign: "center",
                  }}
                >
                  <Flex h={30} pt={15}>
                    <Link to="/">
                      <ActionIcon
                        variant="transparent"
                        onClick={() => console.log("Back to Homepage")}
                      >
                        <IconArrowLeft color="gray"></IconArrowLeft>
                      </ActionIcon>
                    </Link>
                  </Flex>
                  <Container mt={55} h={425}>
                    <Center>
                      <Image
                        h={75}
                        w="auto"
                        src="src\assets\roamgram logo only.png"
                      ></Image>
                    </Center>

                    <Center>
                      <Image
                        h={85}
                        w="auto"
                        src="src\assets\roamgram words only.png"
                      ></Image>
                    </Center>
                    <Text style={{ fontFamily: "roboto", fontSize: "25px" }}>
                      Keep your plans in check.
                    </Text>

                    <Stack align="center" mt={40}>
                      <TextInput
                        w={300}
                        leftSection={<IconUser size={15}></IconUser>}
                        placeholder="Enter Username"
                        key={form.key("username")}
                        {...form.getInputProps("username")}
                      ></TextInput>
                      <PasswordInput
                        w={300}
                        placeholder="Enter Password"
                        key={form.key("password")}
                        {...form.getInputProps("password")}
                      ></PasswordInput>
                      <Center>
                        <Popover
                          offset={10}
                          opened={loginError}
                          onChange={setLoginError}
                          withArrow
                          shadow="sm"
                          arrowSize={12}
                        >
                          <Popover.Target>
                            <Button
                              type="submit"
                              variant="gradient"
                              w={150}
                              radius="lg"
                            >
                              Continue
                            </Button>
                          </Popover.Target>
                          <PopoverDropdown>
                            <Text size="xs">Error Logging In</Text>
                          </PopoverDropdown>
                        </Popover>
                      </Center>
                    </Stack>
                  </Container>
                  <Space h={15}></Space>
                  <Divider label="or" labelPosition="center"></Divider>
                  <Space h={15}></Space>
                  <form action="http://localhost:8080/h2-console">
                    <ActionIcon type="submit" size={65} variant="default">
                      <FcGoogle size={45}></FcGoogle>
                    </ActionIcon>
                  </form>
                  <Space h={100}></Space>
                  <UnstyledButton style={{ color: "" }}>
                    Forgot your password?
                  </UnstyledButton>
                  <Space h={8}></Space>
                  <Flex gap="xs" justify="center">
                    <Text c="gray">Don't have an account?</Text>
                    <UnstyledButton c="green" onClick={() => setSection(true)}>
                      Create Here
                    </UnstyledButton>
                  </Flex>
                </div>
              </form>
            ) : (
              <form
                onSubmit={formCreate.onSubmit(
                  (values, event) => (
                    console.log(values, event), createAccount(values)
                  )
                )}
              >
                <div
                  style={{
                    textAlign: "center",
                  }}
                  className="create-account"
                >
                  <Flex h={30} pt={15}>
                    <ActionIcon
                      variant="transparent"
                      onClick={() => setSection(false)}
                    >
                      <IconArrowLeft color="gray"></IconArrowLeft>
                    </ActionIcon>
                  </Flex>
                  <Container mt={55} h={425}>
                    <Center>
                      <Image
                        h={75}
                        w="auto"
                        src="src\assets\roamgram logo only.png"
                      ></Image>
                    </Center>

                    <Center>
                      <Image
                        h={85}
                        w="auto"
                        src="src\assets\roamgram words only.png"
                      ></Image>
                    </Center>
                    <Text style={{ fontFamily: "roboto", fontSize: "25px" }}>
                      Create Your Account Here
                    </Text>
                    <Stack align="center" mt={40}>
                      <TextInput
                        w={300}
                        placeholder="Enter Name"
                        key={formCreate.key("name")}
                        {...formCreate.getInputProps("name")}
                      ></TextInput>
                      <TextInput
                        w={300}
                        placeholder="Enter Email Address"
                        key={formCreate.key("email")}
                        {...formCreate.getInputProps("email")}
                      ></TextInput>
                      <TextInput
                        w={300}
                        placeholder="Enter Username"
                        key={formCreate.key("username")}
                        {...formCreate.getInputProps("username")}
                      ></TextInput>
                      <PasswordInput
                        w={300}
                        placeholder="Enter Password"
                        key={formCreate.key("password")}
                        {...formCreate.getInputProps("password")}
                      ></PasswordInput>
                      <Center>
                        <Button
                          type="submit"
                          variant="gradient"
                          w={150}
                          radius="lg"
                        >
                          Create Account
                        </Button>
                      </Center>
                    </Stack>
                  </Container>
                </div>
              </form>
            )}

            <CardSection>
              <Image h={1000} src="src\assets\shibuya-crossing.png"></Image>
            </CardSection>
          </SimpleGrid>
        </Card>
      </Center>
    </>
  );
}

export default LoginPage;
