import {
  ActionIcon,
  Button,
  Card,
  CloseButton,
  Container,
  Input,
  Menu,
  Modal,
  Select,
  Table,
  TextInput,
} from "@mantine/core";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { Text } from "@mantine/core";
import { IconEdit } from "@tabler/icons-react";
import { v4 as uuid } from "uuid";
import { DatePickerInput } from "@mantine/dates";

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

  const [opened, setOpened] = useState(false); //for modal

  //travelPlan details
  const [travelPlanDetails, setTravelPlanDetails] = useState({
    uuid: uuid(),
    startDate: "",
    endDate: "",
    name: "",
  });

  const [travelName, setTravelName] = useState<string>("");
  const [dateRanges, setDateRanges] = useState<[Date | null, Date | null]>([
    new Date(),
    null,
  ]);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  //function for formatting our start and endDate from mantine into YYYY-MM-DD Format
  function formatDate(_Date: Date) {
    var momentDate = moment(_Date);
    let formattedDate = momentDate.format("Y-MM-DD");
    return formattedDate;
  }

  //function for formatting Start and End Date and Setting
  function settingTravelPlanDetailsDate(_Date: [Date | null, Date | null]) {
    const StartDate = _Date[0];
    const EndDate = _Date[1];
    setDateRanges(_Date);
    if (StartDate) {
      const _startDate = formatDate(StartDate);
      setTravelPlanDetails((p) => ({ ...p, startDate: _startDate }));
    }
    if (EndDate) {
      const _endDate = formatDate(EndDate);
      setTravelPlanDetails((p) => ({ ...p, endDate: _endDate }));
    }
  }

  const submitTravelPlan = () => {
    fetch("http://localhost:8080/travelPlan/create_travel_plan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(travelPlanDetails),
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.log(error));
  };

  const [editModalOpen, setEditModalOpen] = useState(false);

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
              <Menu>
                <Menu.Target>
                  <ActionIcon size="xl">
                    <IconEdit></IconEdit>
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Label>Application</Menu.Label>
                  <Menu.Item>Edit</Menu.Item>
                  <Menu.Divider />
                  <Menu.Label>Danger</Menu.Label>
                </Menu.Dropdown>
              </Menu>
            </Card.Section>
          </Card>
        ))}
      </>
    );
  };

  return (
    <>
      {cardSecs()}
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        overlayProps={{ backgroundOpacity: 0 }}
      >
        <Input
          //right hand side
          rightSectionPointerEvents="all"
          rightSection={
            <CloseButton
              aria-label="Clear Name"
              onClick={() => setTravelPlanDetails((p) => ({ ...p, name: "" }))}
            />
          }
          required
          //other Input Properties
          placeholder="Choose Name"
          value={travelPlanDetails.name}
          onChange={(e) => {
            setTravelPlanDetails((p) => ({
              ...p,
              name: e.target.value,
            }));
          }}
        ></Input>
        <DatePickerInput
          clearable
          type="range"
          placeholder="Choose Date"
          value={dateRanges}
          onChange={settingTravelPlanDetailsDate}
        ></DatePickerInput>
        <Button
          type="submit"
          onClick={(e) => {
            console.log(travelPlanDetails);
            submitTravelPlan();
          }}
        >
          Submit
        </Button>
      </Modal>
      <Button onClick={() => setOpened(true)}>Create New Travel Plan</Button>
    </>
  );
}

export default TravelPlans;
