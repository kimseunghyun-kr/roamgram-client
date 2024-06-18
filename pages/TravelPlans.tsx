import {
  ActionIcon,
  Button,
  Card,
  Container,
  Select,
  Table,
} from "@mantine/core";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { Text } from "@mantine/core";
import { IconEdit } from "@tabler/icons-react";

const data = [
  { name: "First", startDate: "2024-06-18", endDate: "2024-06-18" },
  { name: "Second", startDate: "2024-06-18", endDate: "2024-06-20" },
  { name: "Third", startDate: "2024-06-18", endDate: "2024-06-31" },
];
function TravelPlans() {
  const [token, setToken] = useState();

  useEffect(() => {
    fetch(`http://localhost:8080/authentication/sign-in`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: "string", password: "string" }),
    })
      .then((response) => response.json())
      .then((data) => setToken(data.accessToken))
      .catch((error) => console.log("login error"));
  }, []);

  const [event, setEvent] = useState();
  const travelPlanId = "86b63927-848c-46ed-afac-0233ebb3938d";
  useEffect(() => {
    if (token) {
      fetch(
        `http://localhost:8080/travelPlan/${travelPlanId}/schedule/search_all`,
        {
          method: "GET",
          headers: {
            //Accept: "application/json", // Optional: Explicitly requests JSON responses
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((response) => response.json())
        .then(
          (data) => (
            //console.log(data),
            data.forEach((items) => {
              items.travelStartTimeEstimate[1] =
                items.travelStartTimeEstimate[1] - 1;
              items.travelStartTimeEstimate = moment(
                items.travelStartTimeEstimate.slice(0, 5)
              ).toDate();
              items.travelDepartTimeEstimate[1] =
                items.travelDepartTimeEstimate[1] - 1;
              items.travelDepartTimeEstimate = moment(
                items.travelDepartTimeEstimate.slice(0, 5)
              ).toDate();
            }),
            setEvent(data)
            //console.log("events taken from api are", data)
            //console.log(moment(data[0].travelDepartTimeEstimate.slice(0, 5)))
          )
        )
        .catch((error) => console.log(error));
    }
  }, [token]);

  //console.log("rows");

  const cardSecs = () => {
    return (
      <>
        {data.map((item) => (
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Card.Section>
              <Text>{item.name}</Text>
              <Text>
                From {item.startDate} to {item.endDate}
              </Text>
              <ActionIcon size="xl">
                <IconEdit></IconEdit>
              </ActionIcon>
            </Card.Section>
          </Card>
        ))}
      </>
    );
  };

  return (
    <>
      <Button
        onClick={() => {
          console.log(event);
          setEvent(event);
        }}
      >
        Create New TravelPlan Here
      </Button>
      {cardSecs()}
    </>
  );
}

export default TravelPlans;
