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
  ActionIcon,
  Flex,
  Spoiler,
} from "@mantine/core";
import { IconPencil, IconSearch } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import "./ReviewsPage.css";

function ReviewsPage() {
  const searchRef = useRef(null);
  const navigate = useNavigate();

  //use mantine autocomplete
  return (
    <>
      <header>
        <Header />
      </header>
      <body>
        <Image src="/assets/Reviews.png" w="auto" ml={395} mt={40}></Image>
        <Grid mt={50} w={1800}>
          <Grid.Col span={2.5}></Grid.Col>
          <Grid.Col span={9.5}>
            <Container display="flex" fluid>
              <TextInput
                ref={searchRef}
                placeholder="Search Location"
                size="md"
                rightSection={<IconSearch />}
                radius="lg"
                w={350}
                mr={60}
              ></TextInput>
              <Space w={520}></Space>
              <Link to="/your-reviews">
                <Button
                  style={{ backgroundColor: "#D6530C" }}
                  className="submit-review-page"
                >
                  Your Reviews
                </Button>
              </Link>
              <Space w={7} />
              <Button
                color="blue"
                className="submit-review-page"
                leftSection={<IconPencil />}
                onClick={() => {
                  sessionStorage.getItem(`authToken`)
                    ? (alert(
                        "Please choose travel plan and respective schedule"
                      ),
                      navigate("/travelPage"))
                    : alert("Not Signed In");
                  navigate("/login");
                }}
              >
                Write a Review
              </Button>
            </Container>
            <Container>
              <ActionIcon>
                <IconPencil></IconPencil>
              </ActionIcon>
            </Container>
            <Group mt={50} gap="md">
              <Card
                withBorder
                radius="xl"
                w={285}
                style={{ backgroundColor: "white" }}
              >
                <Divider mt={10} />
                <Space h={10} />
                <h2> Review Title</h2>
                <Rating readOnly />
                <p>Date</p>
                <p>By: Reviewer Name</p>
                <p>Review Body</p>

                <Flex justify="flex-end">
                  <UnstyledButton c="steelblue">Read More..</UnstyledButton>
                </Flex>
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
