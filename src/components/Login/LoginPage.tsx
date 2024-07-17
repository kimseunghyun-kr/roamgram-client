import {
  ActionIcon,
  Alert,
  Button,
  Card,
  CardSection,
  Center,
  Container,
  Divider,
  Flex,
  Image,
  Loader,
  NavLink,
  PasswordInput,
  Popover,
  PopoverDropdown,
  SimpleGrid,
  Space,
  Stack,
  Text,
  TextInput,
  UnstyledButton,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconArrowLeft, IconUser } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./AuthContext";
import { AuthProvider } from "./AuthContext";
import { useInterval } from "@mantine/hooks";
import Header from "../Header/Header";
import { motion as m } from "framer-motion";

function LoginPage() {
  const history = useNavigate();

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

  // console.log("email is", form.getInputProps("email").defaultValue);
  //console.log({ ...form.getInputProps("email") });

  //console.log({ ...form.getInputProps("password") });

  const { mutate: loginMutate, isPending: loginLoading } = useMutation({
    mutationKey: ["login"],
    mutationFn: async (values: {}) => {
      const response = await fetch(
        `${import.meta.env.VITE_APP_API_URL}/authentication/sign-in`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );
      return response.json();
    },

    onSuccess: (data) => {
      sessionStorage.setItem("authToken", `${data.accessToken}`);
      sessionStorage.setItem("refreshToken", `${data.refreshToken}`);
      history(-1);
      console.log("data", data);
    },
    onError: () => {
      setLoginError(true);
    },
  });

  const [createError, setCreateError] = useState(false);

  const { mutate: createMutate, isPending: createLoading } = useMutation({
    mutationKey: ["create"],
    mutationFn: async (values: {}) => {
      await fetch(
        `${import.meta.env.VITE_APP_API_URL}/authentication/sign-up`,
        {
          credentials: "include",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );
    },
    onSuccess: (data) => {
      console.log("Success Registering, data is", data);
      setSection(false);
      alert("Please confirm email before logging in");
    },
    onError: (error) => {
      console.log("Error creating an account");
      setCreateError(true);
    },
  });

  function googleSignIn() {
    fetch(`${import.meta.env.VITE_APP_GOOGLE_LOGIN_URL}`, { method: "GET" })
      .then((response) => response.json())
      .then((data) => console.log("data", data))
      .catch((error) => console.log("error", error));
  }

  const { isLoggedIn } = useAuth();

  return (
    <>
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.75, ease: "easeOut" }}
      >
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
              <div
                style={{
                  textAlign: "center",
                }}
              >
                <form
                  onSubmit={form.onSubmit(
                    (values, event) => (
                      console.log(values, event), loginMutate(values)
                      //continueLogIn(values)
                    )
                  )}
                >
                  <Flex h={30} pt={15}>
                    <Link to="/">
                      <ActionIcon
                        aria-label="actionIcon-back"
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
                        src="assets/roamgram logo only.png"
                      ></Image>
                    </Center>

                    <Center>
                      <Image
                        h={85}
                        w="auto"
                        src="assets/roamgram words only.png"
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
                          arrowSize={12}
                          opened={loginError}
                          onChange={setLoginError}
                          withArrow
                        >
                          <Popover.Target>
                            {!loginLoading ? (
                              <Button
                                type="submit"
                                variant="gradient"
                                w={150}
                                radius="lg"
                              >
                                Continue
                              </Button>
                            ) : (
                              <Loader size={30}></Loader>
                            )}
                          </Popover.Target>
                          <Popover.Dropdown>
                            <Text size={"13px"} c="red">
                              Error. Please check username and password
                            </Text>
                          </Popover.Dropdown>
                        </Popover>
                      </Center>
                    </Stack>
                  </Container>
                  <Space h={15}></Space>
                  <Divider label="or" labelPosition="center"></Divider>
                  <Space h={15}></Space>
                </form>

                <ActionIcon
                  component="a"
                  id="myLink"
                  href={import.meta.env.VITE_APP_GOOGLE_LOGIN_URL}
                  onClick={googleSignIn}
                  size={65}
                  variant="default"
                >
                  <FcGoogle size={45}></FcGoogle>
                </ActionIcon>

                <Space h={120}></Space>
                <Space h={8}></Space>
                <Flex gap="xs" justify="center">
                  <Text c="gray">Don't have an account?</Text>
                  <Link to="/signup">
                    <UnstyledButton
                      aria-label="create-button"
                      c="green"
                      type="button"
                    >
                      Create Here
                    </UnstyledButton>
                  </Link>
                </Flex>
              </div>

              <CardSection>
                <Image h={1000} src="assets/shibuya-crossing.png"></Image>
              </CardSection>
            </SimpleGrid>
          </Card>
        </Center>
      </m.div>
    </>
  );
}

export default LoginPage;
