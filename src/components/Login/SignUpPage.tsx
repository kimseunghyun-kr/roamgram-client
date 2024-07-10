import {
  ActionIcon,
  Card,
  Center,
  Container,
  Flex,
  SimpleGrid,
  Image,
  Stack,
  TextInput,
  Popover,
  Loader,
  Button,
  CardSection,
  Text,
  PasswordInput,
  Alert,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconArrowLeft } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { motion as m } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Notifications } from "@mantine/notifications";

function SignUpPage() {
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

  const [createError, setCreateError] = useState(false);

  const {
    mutate: createMutate,
    isPending: createLoading,
    isSuccess: createSuccess,
  } = useMutation({
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
      alert("Please confirm email before logging in");
      navigate("/login");
      createSuccess;
    },
    onError: (error) => {
      console.log("Error creating an account");
      setCreateError(true);
    },
  });

  const navigate = useNavigate();

  return (
    <>
      <m.div
        initial={{ x: "100%" }}
        animate={{ x: "0%" }}
        transition={{ duration: 0.65, bounce: 0.15, type: "spring" }}
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
              <form
                onSubmit={formCreate.onSubmit(
                  (values, event) => (
                    console.log(values, event), createMutate(values)
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
                      onClick={() => {
                        navigate(-1);
                      }}
                    >
                      <IconArrowLeft color="gray"></IconArrowLeft>
                    </ActionIcon>
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
                        <Popover opened={createError} onChange={setCreateError}>
                          <Popover.Target>
                            {!createLoading ? (
                              <Button
                                type="submit"
                                variant="gradient"
                                w={150}
                                radius="lg"
                              >
                                Create Account
                              </Button>
                            ) : (
                              <Loader size={30}></Loader>
                            )}
                          </Popover.Target>
                          <Popover.Dropdown c="red">
                            Error creating an account
                          </Popover.Dropdown>
                        </Popover>
                      </Center>
                    </Stack>
                  </Container>
                </div>
              </form>

              <CardSection>
                <Image h={1000} src="assets/japan-digital.jpg"></Image>
              </CardSection>
            </SimpleGrid>
          </Card>
        </Center>
      </m.div>
    </>
  );
}

export default SignUpPage;
