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
import usePlacesAutocomplete from "use-places-autocomplete";

const dummyTravelId = import.meta.env.VITE_DUMMY_TRAVELID;
const dummyScheduleId = import.meta.env.VITE_DUMMY_SCHEDULEID;

function ReviewsPage() {
  const [searchRefInput, setSearchRefInput] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const [autoComplete, setAutoComplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const navigate = useNavigate();
  const authToken = sessionStorage.getItem(`authToken`);
  const [googleReviews, setGoogleReviews] = useState([]);

  const get_all_reviews = async () => {
    //set parameter to 1000 first
    return await fetch(
      `${
        import.meta.env.VITE_APP_API_URL
      }/travelPlan/${dummyTravelId}/schedule/${dummyScheduleId}/review/public-all?page=0&size=1000`,
      { method: "GET", headers: { Authorization: `Bearer ${authToken}` } }
    ).then((res) => res.json());
  };

  const get_all_reviews_googleId = async (googleId: string) => {
    const res = await fetch(
      `${
        import.meta.env.VITE_APP_API_URL
      }/travelPlan/${dummyTravelId}/schedule/${dummyScheduleId}/review/public-google-maps-id?page=0&size=1000&googleMapsId=${googleId}`,
      { method: "GET", headers: { Authorization: `Bearer ${authToken}` } }
    ).then((res) => res.json());
    setGoogleReviews(res.content);
  };
  const { data: getAllReviews } = useQuery({
    queryKey: ["all-reviews"],
    queryFn: get_all_reviews,
  });
  //use mantine autocomplete

  function chunk(getAllReviews, size: number) {
    if (!getAllReviews.length) {
      return [];
    }
    const head = getAllReviews.slice(0, size);
    const tail = getAllReviews.slice(size);
    return [head, ...chunk(tail, size)];
  }
  // console.log("getall", getAllReviews);
  const [activePage, setPage] = useState(1);

  const allContent = getAllReviews?.content ?? []; //if no content set to [];
  // console.log("allContent", allContent);
  const allReviewsContentChunked = chunk(allContent, 8);
  const allReviewsContentData = allReviewsContentChunked[activePage - 1];
  function cardSection(allReviewsContentData) {
    return (
      <>
        <Container fluid h={900} key={allReviewsContentData.length}>
          <Group mt={50} gap="md" justify="center">
            {allReviewsContentData.map((item) => (
              <Card radius="xl" w={285} h={470} key={item.id}>
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
          </Group>
        </Container>
        <Center mt={80}>
          <Pagination
            total={allReviewsContentChunked.length}
            value={activePage}
            onChange={setPage}
            pb={25}
          ></Pagination>
        </Center>
      </>
    );
  }

  const [googleActivePage, setGooglePage] = useState(1);
  function googleCardSection(googleReviews) {
    const googleReviewsChunked = chunk(googleReviews, 8);
    console.log("google chunk", googleReviewsChunked);
    const googleReviewData = googleReviewsChunked[googleActivePage - 1];
    return googleReviewData ? (
      <>
        <Container fluid h={900}>
          <Group mt={50} gap="md" justify="center">
            {googleReviewData.map((item) => (
              <Card radius="xl" w={285} h={470} key={item.id}>
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
          </Group>
        </Container>
        <Center mt={80}>
          <Pagination
            total={googleReviewsChunked.length}
            value={googleActivePage}
            onChange={setGooglePage}
            pb={25}
          ></Pagination>
        </Center>
      </>
    ) : null;
  }
  //mount
  useEffect(() => {
    const googleAutoComplete = new google.maps.places.Autocomplete( //new instance
      searchRef.current as HTMLInputElement,
      { fields: ["place_id"] } //Edit here to change setSelectedPlace properties
    );
    setAutoComplete(googleAutoComplete);
  }, []);

  const [haveId, setHaveId] = useState(false);

  useEffect(() => {
    if (autoComplete) {
      autoComplete.addListener("place_changed", () => {
        const place = autoComplete.getPlace(); //returns the fields
        const googleId = place?.place_id;
        if (googleId) {
          get_all_reviews_googleId(googleId);
          setHaveId(true);
        }
      });
    }
  });
  // console.log("revs", googleReviews);
  //console.log("searchRef check", searchRef.current.value);
  useEffect(() => {
    if (!searchRefInput) {
      console.log("check if empty", searchRef.current.value);
      setHaveId(false);
      setGooglePage(1);
      setPage(1);
    }
  }, [searchRefInput]);
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
                onChange={(e) => {
                  setSearchRefInput(e.currentTarget.value);
                }}
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
            {allReviewsContentData
              ? haveId
                ? googleCardSection(googleReviews)
                : cardSection(allReviewsContentData)
              : null}
          </Grid.Col>
        </Grid>
      </body>
    </>
  );
}

export default ReviewsPage;
