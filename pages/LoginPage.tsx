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
} from "@mantine/core";
import { useForm } from "@mantine/form";
import React from "react";
import { FcGoogle } from "react-icons/fc";

function LoginPage() {
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: (value) =>
        /^[a-zA-Z0-9_.±]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/.test(value)
          ? null
          : "Invalid Email",
      password: (value) =>
        value.length < 4 ? "Password should be more than 4 characters" : null,
    },
  });
  return (
    <>
      <Center>
        <form onSubmit={form.onSubmit(console.log)}>
          <Card
            withBorder
            mt={85}
            w={1300}
            h={700}
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
                <Container mt={85}>
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
                      placeholder="Enter Email Address"
                      key={form.key("email")}
                      {...form.getInputProps("email")}
                    ></TextInput>
                    <PasswordInput
                      w={300}
                      placeholder="Enter Password"
                      key={form.key("password")}
                      {...form.getInputProps("password")}
                    ></PasswordInput>
                    <Center>
                      <Button
                        type="submit"
                        variant="gradient"
                        w={150}
                        radius="lg"
                      >
                        Continue
                      </Button>
                    </Center>
                  </Stack>
                </Container>
                <Space h={15}></Space>
                <Divider label="or" labelPosition="center"></Divider>
                <Space h={15}></Space>

                <ActionIcon size={65} variant="default">
                  <FcGoogle size={45}></FcGoogle>
                </ActionIcon>
                <Space h={50}></Space>
                <UnstyledButton style={{ color: "" }}>
                  Forgot your password?
                </UnstyledButton>
                <Space h={7}></Space>
                <Flex gap="xs" justify="center">
                  <Text c="gray">Don't have an account?</Text>
                  <UnstyledButton c="green">Create Here</UnstyledButton>
                </Flex>
              </div>
              <CardSection>
                <Image h={1000} src="src\assets\shibuya-crossing.png"></Image>
              </CardSection>
            </SimpleGrid>
          </Card>
        </form>
      </Center>
    </>
  );
}

export default LoginPage;
