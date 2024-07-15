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
} from "@mantine/core";
import { IconX } from "@tabler/icons-react";
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
      if (getTravelPlans && successTp) {
        const allRevs = allTravelPlanWithScheduleId();
        const allReviews = (await allReviewsWithProperties(allRevs)).flat(); //flattens our list
        setAllRevs(allReviews);
      }
    };
    allRevs();
  }, []);

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

  function card(allRevs) {
    return (
      <>
        <div key={allRevs.length}>
          {allRevs.map((items) => (
            <Card
              withBorder
              radius="xl"
              w={285}
              style={{ backgroundColor: "white" }}
              id="test"
            >
              <Divider mt={10} />
              <Space h={10} />
              <Group justify="space-between">
                <h2> Review Title</h2>
                <Menu>
                  <Menu.Target>
                    <ActionIcon variant="transparent">
                      <IconX color="red" />
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

              <p dangerouslySetInnerHTML={{ __html: items.userDescription }} />

              <Flex justify="flex-end">
                <UnstyledButton c="steelblue">Read More..</UnstyledButton>
              </Flex>
            </Card>
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      <header>
        <Header />
      </header>
      <body>
        {card(allRevs)}
        <Card
          withBorder
          radius="xl"
          w={285}
          style={{ backgroundColor: "white" }}
          id="test"
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
      </body>
    </>
  );
}

export default YourReviews;
