import {
  ActionIcon,
  Button,
  Card,
  CardSection,
  Center,
  Container,
  Flex,
  Image,
  PasswordInput,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconArrowLeft } from "@tabler/icons-react";

function CreatePage(props) {
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

  console.log({ ...form.getInputProps("email") });
  console.log({ ...form.getInputProps("password") });
  return (
    <>
      <Center>
        <form onSubmit={form.onSubmit(console.log)}>
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
                <Flex h={30} pt={15}>
                  <ActionIcon
                    variant="transparent"
                    onClick={() => props.setSection(false)}
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
                        Create Account
                      </Button>
                    </Center>
                  </Stack>
                </Container>
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

export default CreatePage;
