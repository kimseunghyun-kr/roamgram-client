import React, { useEffect, useRef, useState } from "react";
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
  ScrollArea,
} from "@mantine/core";
import { IconPencil, IconSearch } from "@tabler/icons-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import "./ReviewsPage.css";

const dummyTravelId = import.meta.env.VITE_DUMMY_TRAVELID;
const dummyScheduleId = import.meta.env.VITE_DUMMY_SCHEDULEID;

function ReviewsPage() {
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const authToken = sessionStorage.getItem(`authToken`);

  const get_all_reviews = async () => {
    //set parameter to 1000 first
    return await fetch(
      `${
        import.meta.env.VITE_APP_API_URL
      }/travelPlan/${dummyTravelId}/schedule/${dummyScheduleId}/review/public-all?page=0&size=1000`,
      { method: "GET", headers: { Authorization: `Bearer ${authToken}` } }
    ).then((res) => res.json());
  };
  const { data: getAllReviews } = useQuery({
    queryKey: ["all-reviews"],
    queryFn: get_all_reviews,
  });

  //use mantine autocomplete

  function chunk(allRevs, size: number) {
    if (!allRevs.length) {
      return [];
    }
    const head = allRevs.slice(0, size);
    const tail = allRevs.slice(size);
    return [head, ...chunk(tail, size)];
  }

  console.log("get all", getAllReviews.content);
  const [activePage, setPage] = useState(1);
  const allReviewsContentChunked = chunk(getAllReviews.content, 8);
  const allReviewsContentData = allReviewsContentChunked[activePage - 1];
  function cardSection(allReviewsContentData) {
    return (
      <>
        {allReviewsContentData.map((item) => (
          <Card radius="xl" w={285} h={470}>
            <Image
              h={200}
              src="https://placehold.co/600x400?text=Placeholder"
            />
            <Divider mt={10} />
            <Space h={10} />
            <Rating value={item.rating} readOnly />
            <UnstyledButton>
              <h2>Review Title</h2>
            </UnstyledButton>
            <Spoiler maxHeight={90} showLabel="Show more" hideLabel="Hide">
              <ScrollArea h={130}>
                <Text
                  dangerouslySetInnerHTML={{
                    __html: item.userDescription,
                  }}
                />
              </ScrollArea>
            </Spoiler>
          </Card>
        ))}
      </>
    );
  }
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

              <Button
                style={{ backgroundColor: "#D6530C" }}
                className="submit-review-page"
                onClick={() => {
                  {
                    authToken
                      ? navigate("/your-reviews")
                      : alert("Sign in to acesss");
                  }
                }}
              >
                Your Reviews
              </Button>

              <Space w={7} />
              <Button
                color="blue"
                className="submit-review-page"
                leftSection={<IconPencil />}
                onClick={() => {
                  authToken
                    ? (alert(
                        "Please choose travel plan and respective schedule"
                      ),
                      navigate("/travelPage"))
                    : (alert("Not Signed In"), navigate("/login"));
                }}
              >
                Write a Review
              </Button>
            </Container>
            <Container fluid h={900}>
              <Group mt={50} gap="md" justify="center">
                {cardSection(allReviewsContentData)}
              </Group>
            </Container>
          </Grid.Col>
        </Grid>
        <Center mt={80}>
          <Pagination
            total={allReviewsContentChunked.length}
            value={activePage}
            onChange={setPage}
            pb={25}
          ></Pagination>
        </Center>
      </body>
    </>
  );
}

export default ReviewsPage;
