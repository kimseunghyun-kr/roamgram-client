import {
  ActionIcon,
  Burger,
  Button,
  Card,
  Center,
  CloseButton,
  Container,
  Flex,
  Input,
  Menu,
  Modal,
  Select,
  Space,
  Stack,
  Table,
  Tabs,
  TextInput,
  Title,
  UnstyledButton,
} from "@mantine/core";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { Text } from "@mantine/core";
import {
  IconCheck,
  IconEdit,
  IconPlus,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import { v4 as uuid } from "uuid";
import { DatePickerInput } from "@mantine/dates";
import "./TravelPlans.css";

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

  const [event, setEvent] = useState([]);

  useEffect(() => {
    if (token) {
      fetch(`http://localhost:8080/travelPlan/get_all`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => setEvent(data))
        .catch((error) => console.log(error));
    }
  }, [token]);

  console.log(event);

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
      .then((data) => console.log("data is", data))
      .catch((error) => console.log(error));
  };

  const [editModalOpen, setEditModalOpen] = useState(false);

  function deleteTravelPlan(id) {
    console.log(id);
    fetch(`http://localhost:8080/travelPlan/delete_travel_plan`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify([id]),
    })
      .then((response) => response.json())
      .then((data) => console.log("successful in deleting travelPlan"))
      .catch((error) => console.log("error in deleting traevlPlan"));

    //EXTRA THINGS --> DELETE ALL SCHEDULES HERE
  }

  const cardSecs = () => {
    return event ? (
      <>
        {event.map((item) => (
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Card.Section>
              <Text>{item.name}</Text>
              <Text>
                From {moment(item.travelStartDate).format("YYYY-MM-DD")} to{" "}
                {` `}
                {moment(item.travelEndDate).format("YYYY-MM-DD")}
              </Text>
              <Menu>
                <Menu.Target>
                  <ActionIcon
                    size="xl"
                    style={{ backgroundColor: "transparent" }}
                  >
                    <IconEdit color="gray"></IconEdit>
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Label>Application</Menu.Label>
                  <Menu.Item
                    onClick={() => (
                      setEditModalOpen(true), console.log(editModalOpen)
                    )}
                  >
                    Edit
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Label>Danger</Menu.Label>
                  <Menu.Item>
                    <Text style={{ color: "red" }}>Delete</Text>
                  </Menu.Item>
                </Menu.Dropdown>
                <Modal
                  overlayProps={{
                    backgroundOpacity: 0,
                    blur: 1,
                  }}
                  opened={editModalOpen}
                  onClose={() => (
                    setEditModalOpen(false), console.log("close", editModalOpen)
                  )}
                >
                  <Input
                    //right hand side
                    rightSectionPointerEvents="all"
                    rightSection={
                      <CloseButton
                        aria-label="Clear Name"
                        onClick={() =>
                          setTravelPlanDetails((p) => ({ ...p, name: "" }))
                        }
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
                    }}
                  >
                    Update Plan
                  </Button>
                </Modal>
              </Menu>
            </Card.Section>
          </Card>
        ))}
      </>
    ) : (
      <h1>Error Loading</h1>
    );
  };

  return (
    <>
      <Button
        onClick={() => {
          deleteTravelPlan(`3ec21ce9-b695-4311-bcc6-141d6f376ee0`);
        }}
      >
        Test Delete
      </Button>
      <Button>Update Edit</Button>
      <Space h={85} />
      <Center>
        <Card radius="lg" h={600} w={600} withBorder>
          <Tabs
            className="tabs"
            variant="outline"
            radius="md"
            defaultValue="incomplete"
          >
            <Tabs.List>
              <Tabs.Tab value="incomplete">Incomplete</Tabs.Tab>
              <Tabs.Tab
                value="complete"
                leftSection={<IconCheck size={15} color="green" />}
              >
                Complete
              </Tabs.Tab>
              <Tabs.Tab
                ml={225}
                value="create_travel"
                leftSection={<IconPlus size={15} color="gray" />}
              >
                Create
              </Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="incomplete">
              <Center h={500}>
                <Stack align="center">
                  <Title>Travel Plan Name</Title>
                  <Text style={{ fontSize: "20px" }}>From 23132 to 23132</Text>
                  <ActionIcon variant="subtle" color="cyan">
                    <IconEdit />
                  </ActionIcon>
                </Stack>
              </Center>
              <Center>
                <Menu shadow="md">
                  <Menu.Target>
                    <ActionIcon variant="subtle" c="red">
                      <IconX />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Label>Danger</Menu.Label>
                    <Menu.Divider></Menu.Divider>
                    <Menu.Item c="red" leftSection={<IconTrash size={14} />}>
                      Delete
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </Center>
            </Tabs.Panel>
            <Tabs.Panel value="create_travel">
              <Input
                //right hand side
                rightSectionPointerEvents="all"
                rightSection={
                  <CloseButton
                    aria-label="Clear Name"
                    onClick={() =>
                      setTravelPlanDetails((p) => ({ ...p, name: "" }))
                    }
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
            </Tabs.Panel>
          </Tabs>
        </Card>
      </Center>

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
