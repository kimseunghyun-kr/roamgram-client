import React, { useCallback, useEffect, useState } from "react";
import Header from "../Header/Header";
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  Card,
  UnstyledButton,
  Text,
  Divider,
  Space,
  Rating,
  Flex,
  Group,
  ActionIcon,
  Menu,
  Pagination,
  Center,
  SimpleGrid,
  Container,
  Spoiler,
  ScrollArea,
  Title,
  TextInput,
} from "@mantine/core";
import { IconSearch, IconTrash, IconX } from "@tabler/icons-react";
import "./YourReviews.css";
import { stripHtml } from "string-strip-html";

function YourReviews() {
  const authToken = sessionStorage.getItem(`authToken`);
  const allReviews = []; //objects with travelPlanId
  const { data: getTravelPlans, isSuccess: successTp } = useQuery({
    queryKey: ["all-travel-plans"],
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_APP_API_URL}/travelPlan/get_all`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      ).then((res) => res.json());
      return res;
    },
    enabled: true,
  });

  const fetchReviews = (travelPlanId, scheduleId, size) => {
    // const tpWithReviews = {};
    return fetch(
      `${
        import.meta.env.VITE_APP_API_URL
      }/travelPlan/${travelPlanId}/schedule/${scheduleId}/review/schedule-all?page=0&size=${size}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    ).then((res) => res.json());

    // tpWithReviews[travelPlanId] = res.content;
    // // console.log("allRev", allReviews);
    // return res;
    // allReviews.push(tpWithReviews);
  };
  // enabled: tr,

  //store dictionary: travelPlanId:scheduleId
  const fetchSchedules = (travelPlan, travelPlanDict) => {
    travelPlanDict[travelPlan.id] = [
      travelPlan.scheduleList.map((schedules) => {
        return schedules.id;
      }),
    ];
    // console.log("tp dict is", travelPlanDict);
  };

  const allTravelPlanWithScheduleId = () => {
    const travelPlanDict = {};
    const allRevs = [];
    getTravelPlans.map((items) => fetchSchedules(items, travelPlanDict));
    // console.log("tpdict", travelPlanDict);
    for (const item in travelPlanDict) {
      const schedules = travelPlanDict[item][0];
      schedules.map((i) => allRevs.push({ travelId: item, scheduleId: i }));
      console.log(schedules);
    }
    // console.log("function allREvs", allRevs);
    return allRevs;

    //return travelPlanDict;
  };

  const allReviewsWithProperties = async (allRevs) => {
    const promise = allRevs.map(async (item) => {
      // console.log("item", item);
      const data = await fetchReviews(item.travelId, item.scheduleId, 20);
      const dataWithTp = data.content.map((i) => ({
        ...i,
        travelId: item.travelId,
      }));
      // allReviews.push({ ...data.content, travelId: item.travelId });
      return Object.values(dataWithTp);
    });

    const returnVal = await Promise.all(promise);
    // console.log("returnVal", returnVal);
    return returnVal;
  };

  const [allRevs, setAllRevs] = useState([]);

  useEffect(() => {
    const allRevs = async () => {
      if (successTp) {
        const allRevs = allTravelPlanWithScheduleId();
        const allReviews = (await allReviewsWithProperties(allRevs)).flat(); //flattens our list
        setAllRevs(allReviews);
      }
    };
    allRevs();
  }, [successTp, getTravelPlans]);

  const deleteReview = async (item) => {
    const travelId = item.travelId;
    const scheduleId = item.scheduleId;
    const reviewId = item.id;
    await fetch(
      `${
        import.meta.env.VITE_APP_API_URL
      }/travelPlan/${travelId}/schedule/${scheduleId}/review/delete?reviewID=${reviewId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => console.log("successful delete"))
      .catch((error) => console.log("error deleting review"));

    //const filtered = allRevs.filter((item) => item.id != reviewId);
    setAllRevs((p) => p.filter((item) => item.id != reviewId));
    console.log(allRevs);
  };
  //chunks data into equally sized arrays(if possible) of list
  function chunk(allRevs, size: number) {
    if (!allRevs.length) {
      return [];
    }
    const head = allRevs.slice(0, size);
    const tail = allRevs.slice(size);
    return [head, ...chunk(tail, size)];
  }

  const [activePage, setPage] = useState(1);
  const [expanded, setExpanded] = useState(false);

  const allRevChunk = chunk(allRevs, 8);
  const allRevData = allRevChunk[activePage - 1];
  console.log("allRevData", allRevData);

  function card(allRevData) {
    return (
      <>
        <Container size="xl" w={1500} h={800} mt="xl">
          <SimpleGrid cols={4} spacing="xs" verticalSpacing="md">
            {allRevData.map((items) => (
              <Card
                withBorder
                radius="xl"
                w={285}
                h={325}
                style={{ backgroundColor: "white" }}
                id="test"
              >
                <Space h={10} />
                <Group justify="flex-end">
                  <Menu>
                    <Menu.Target>
                      <ActionIcon variant="transparent">
                        <IconTrash size={23} color="red" />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Label>Danger Zone</Menu.Label>
                      <Menu.Divider />
                      <Menu.Item
                        c="red"
                        onClick={() => {
                          deleteReview(items);
                        }}
                      >
                        Delete
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Group>
                <Rating value={items.rating} readOnly />
                <Spoiler maxHeight={110} showLabel="Show more" hideLabel="Hide">
                  <ScrollArea h={155}>
                    <Text
                      h={145}
                      className="textInnerHtml"
                      dangerouslySetInnerHTML={{
                        __html: items.userDescription,
                      }}
                    />
                  </ScrollArea>
                </Spoiler>
              </Card>
            ))}
          </SimpleGrid>
        </Container>
      </>
    );
  }

  return (
    <>
      <header>
        <Header />
      </header>
      <body>
        <div
          style={{
            textAlign: "center",
            paddingTop: "30px",
          }}
        >
          <Title>Your Reviews</Title>
        </div>
        <Space h={30} />
        <Container fluid></Container>
        {allRevData ? card(allRevData) : null}
        <Space h={35} />
        <Center>
          <Pagination
            total={allRevChunk.length}
            value={activePage}
            onChange={setPage}
            mt="sm"
          ></Pagination>
        </Center>
      </body>
    </>
  );
}

export default YourReviews;
