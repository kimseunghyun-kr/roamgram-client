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
  TypographyStylesProvider,
  Box,
} from "@mantine/core";
import {
  IconArrowDown,
  IconArrowUp,
  IconPencil,
  IconSearch,
} from "@tabler/icons-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import "./ReviewsPage.css";
import usePlacesAutocomplete from "use-places-autocomplete";
import { motion as m } from "framer-motion";

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
  const [allContentState, setAllContent] = useState(
    getAllReviews?.content ?? []
  );
  const [allGoogleContentState, setAllGoogleContent] = useState([]);
  useEffect(() => {
    const setter = async (allContent) => {
      await setAllContent(allContent);
    };
    const allContent = getAllReviews?.content; //if no content set to [];
    if (allContent) {
      setter(allContent);
    }
    // console.log("allContent", allContent);
    // const allReviewsContentChunked = chunk(allContent, 8);
    // const allReviewsContentData = allReviewsContentChunked[activePage - 1];
  }, [getAllReviews]);
  // const allContent = getAllReviews?.content ?? []; //if no content set to [];
  // console.log("allContent", allContent);
  const allReviewsContentChunked = chunk(allContentState, 8);
  const allReviewsContentData = allReviewsContentChunked[activePage - 1];

  const [expanded, setExpanded] = useState(false);
  const spoilerControlRef = useRef<HTMLButtonElement>(null);

  console.log("allReviews", allReviewsContentData);

  const sortByRatingDescending = async (allContentState) => {
    const copy = [...allContentState].sort((a, b) =>
      a.rating < b.rating ? 1 : -1
    );
    console.log(copy);

    return (await haveId) ? setGoogleReviews(copy) : setAllContent(copy);
  };
  const sortByRatingAscending = async (allContentState) => {
    const copy = [...allContentState].sort((a, b) =>
      a.rating < b.rating ? -1 : 1
    );
    return (await haveId) ? setGoogleReviews(copy) : setAllContent(copy);
  };

  const [sortRating, setSortRating] = useState(0);

  function cardSection(allReviewsContentData) {
    return (
      <>
        <m.div
          initial={{ translateY: 50, opacity: 0 }}
          animate={{ translateY: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Center>
            <Group
              mt={50}
              gap="lg"
              key={allReviewsContentData.length}
              w={1400}
              justify="center"
            >
              {allReviewsContentData.map((item, index) => (
                <m.div
                  key={item.id}
                  initial={{ translateY: 50, opacity: 0 }}
                  animate={{ translateY: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                >
                  <Card w={285} h={280} withBorder>
                    <Divider mt={5} />
                    <Space h={10} />
                    <Rating value={item.rating} fractions={2} readOnly />

                    <Spoiler
                      controlRef={spoilerControlRef}
                      maxHeight={160}
                      showLabel="Read More"
                      hideLabel="Hide"
                      expanded={expanded}
                      onExpandedChange={(expanded) => {
                        navigate(`/reviews/reviewID?id=${item.id}`, {
                          state: { pageHTML: item.userDescription },
                        });
                      }}
                    >
                      {/* <ScrollArea h={130}> */}
                      <div className="review-box">
                        <Text
                          lineClamp={6}
                          dangerouslySetInnerHTML={{
                            __html: item.userDescription,
                          }}
                        />
                      </div>
                    </Spoiler>
                  </Card>
                </m.div>
              ))}
            </Group>
          </Center>
        </m.div>

        <Center mt={20} mb={10}>
          <Pagination
            total={allReviewsContentChunked.length}
            value={activePage}
            onChange={setPage}
          ></Pagination>
        </Center>
      </>
    );
  }

  const [googleActivePage, setGooglePage] = useState(0);

  function googleCardSection(googleReviews) {
    const googleReviewsChunked = chunk(googleReviews, 8);
    console.log("google chunk", googleReviewsChunked);
    const googleReviewData = googleReviewsChunked[googleActivePage - 1];
    return googleReviewData ? (
      <>
        <Center>
          <m.div
            initial={{ translateY: 50, opacity: 0 }}
            animate={{ translateY: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Group
              mt={50}
              gap="lg"
              key={googleReviewData.length}
              w={1400}
              justify="center"
            >
              {googleReviewData.map((item, index) => (
                <m.div
                  key={item.id}
                  initial={{ translateY: 50, opacity: 0 }}
                  animate={{ translateY: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                >
                  <Card w={285} h={280} withBorder>
                    <Divider mt={5} />
                    <Space h={10} />
                    <Rating value={item.rating} fractions={2} readOnly />

                    <Spoiler
                      controlRef={spoilerControlRef}
                      maxHeight={160}
                      showLabel="Read More"
                      hideLabel="Hide"
                      expanded={expanded}
                      onExpandedChange={(expanded) => {
                        navigate(`/reviews/reviewID?id=${item.id}`, {
                          state: { pageHTML: item.userDescription },
                        });
                      }}
                    >
                      <div className="review-box">
                        <Text
                          lineClamp={6}
                          dangerouslySetInnerHTML={{
                            __html: item.userDescription,
                          }}
                        />
                      </div>
                    </Spoiler>
                  </Card>
                </m.div>
              ))}
            </Group>
          </m.div>
        </Center>

        <Center mt={20} mb={10}>
          <Pagination
            total={googleReviewsChunked.length}
            value={googleActivePage}
            onChange={setGooglePage}
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

  console.log("setSort", sortRating);
  return (
    <>
      <header>
        <Header />
      </header>
      <body>
        <m.div
          initial={{ translateY: 50, opacity: 0 }}
          animate={{ translateY: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Center mt={45} w={1300} ml={300}>
            <Group justify="space-between" align="center" w={1200}>
              <Image src="/assets/Reviews.png" w="auto" pb={40}></Image>

              <Group gap="11px">
                <TextInput
                  ref={searchRef}
                  placeholder="Search Reviews By Location"
                  size="md"
                  rightSection={<IconSearch />}
                  radius="xl"
                  w={350}
                  onChange={(e) => {
                    setSearchRefInput(e.currentTarget.value);
                  }}
                ></TextInput>
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
              </Group>
            </Group>
          </Center>
          <Flex ml={360} justify="flex-start" align="center">
            <Title mr={10} size="md" fw={900} c="#575757">
              SORT BY:{" "}
            </Title>
            {/* {allReviewsContentData? haveId? () : null} */}
            <Button
              radius="xl"
              color="black"
              variant="outline"
              size="md"
              rightSection={
                sortRating == 0 ? null : sortRating == 1 ? (
                  <IconArrowDown color="gray" />
                ) : (
                  <IconArrowUp color="gray" />
                )
              }
              onClick={() => {
                haveId
                  ? sortRating == 0
                    ? (sortByRatingDescending(googleReviews), setSortRating(1))
                    : sortRating == 1
                    ? (sortByRatingAscending(googleReviews), setSortRating(2))
                    : (setAllContent(googleReviews), setSortRating(0))
                  : sortRating == 0
                  ? (sortByRatingDescending(allContentState), setSortRating(1))
                  : sortRating == 1
                  ? (sortByRatingAscending(allContentState), setSortRating(2))
                  : (setAllContent(getAllReviews?.content), setSortRating(0));
              }}
            >
              Rating
            </Button>
          </Flex>
          {allReviewsContentData
            ? haveId
              ? googleCardSection(googleReviews)
              : cardSection(allReviewsContentData)
            : null}
        </m.div>
      </body>
    </>
  );
}

export default ReviewsPage;
