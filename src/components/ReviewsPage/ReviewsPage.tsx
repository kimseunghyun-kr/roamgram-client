import React, { useEffect, useRef } from "react";
import Header from "../Header/Header.tsx";
import {
  Card,
  CardSection,
  Container,
  Grid,
  Group,
  Paper,
  SegmentedControl,
  Space,
  TextInput,
  UnstyledButton,
  Image,
  Divider,
  Text,
  Rating,
  Title,
  Button,
  Pagination,
  Center,
} from "@mantine/core";
import { IconPencil, IconSearch } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

function ReviewsPage() {
  const searchRef = useRef(null);
  const navigate = useNavigate();
  return (
    <>
      <header>
        <Header />
      </header>
      <body>
        <Button onClick={() => console.log(searchRef.current.value)}>
          Test
        </Button>
        <Grid mt={50} w={1800}>
          <Grid.Col span={2.5}>
            <Paper withBorder h={600} p="xl" radius="xl" ml={50} mr={50}>
              <Text>Filter Area</Text>
            </Paper>
          </Grid.Col>
          <Grid.Col span={9.5}>
            <Container display="flex" fluid>
              <TextInput
                ref={searchRef}
                size="lg"
                rightSection={<IconSearch />}
                radius="xl"
                w={350}
              ></TextInput>
              <Space w={700}></Space>
              <Button
                color="red"
                leftSection={<IconPencil />}
                onClick={() => {
                  sessionStorage.getItem(`authToken`)
                    ? navigate("/reviews/detailed_review")
                    : alert("Not Signed In");
                }}
              >
                Write a Review
              </Button>
            </Container>
            <Group mt={50} gap="md">
              <Card
                withBorder
                radius="xl"
                w={285}
                style={{ backgroundColor: "gray" }}
              >
                <Divider mt={10} />
                <Space h={10} />
                <Rating readOnly />
                <h2> Review Title</h2>
                <p>Review Body</p>
                <p>Reviewer Name</p>
                <p>Date</p>
              </Card>
              <Card withBorder radius="xl" w={285}>
                <Image
                  h={200}
                  src="https://placehold.co/600x400?text=Placeholder"
                />
                <Divider mt={10} />
                <Space h={10} />
                <Rating readOnly />
                <h2> Review Title</h2>
                <p>Review Body</p>
                <p>Reviewer Name</p>
                <p>Date</p>
              </Card>
              <Card withBorder radius="xl" w={285}>
                <Image
                  h={200}
                  src="https://placehold.co/600x400?text=Placeholder"
                />
                <Divider mt={10} />
                <Space h={10} />
                <Rating readOnly />
                <h2> Review Title</h2>
                <p>Review Body</p>
                <p>Reviewer Name</p>
                <p>Date</p>
              </Card>
              <Card withBorder radius="xl" w={285}>
                <Image
                  h={200}
                  src="https://placehold.co/600x400?text=Placeholder"
                />
                <Divider mt={10} />
                <Space h={10} />
                <Rating readOnly />
                <h2> Review Title</h2>
                <p>Review Body</p>
                <p>Reviewer Name</p>
                <p>Date</p>
              </Card>
            </Group>
          </Grid.Col>
        </Grid>
        <Center mt={80}>
          <Pagination total={10}></Pagination>
        </Center>
      </body>
    </>
  );
}

export default ReviewsPage;
