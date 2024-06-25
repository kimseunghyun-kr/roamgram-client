import { Carousel } from "@mantine/carousel";
import {
  ActionIcon,
  Button,
  Card,
  Center,
  CloseButton,
  Divider,
  Menu,
  Modal,
  Space,
  Stack,
  Tabs,
  Text,
  TextInput,
  Title,
  Tooltip,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import {
  IconCheck,
  IconEdit,
  IconPlus,
  IconSquareRoundedArrowRight,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import moment from "moment";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { v4 as uuid } from "uuid";
import Header from "../Header/Header.tsx";
import "./TravelPlans.css";

//const data = [
//  { name: "First", startDate: "2024-06-18", endDate: "2024-06-18" },
//  { name: "Second", startDate: "2024-06-18", endDate: "2024-06-20" },
//  { name: "Third", startDate: "2024-06-18", endDate: "2024-06-31" },
//];

type DatesRangeValue = [Date | null, Date | null];

interface TravelPlan {
  id: string;
  name: string;
  travelStartDate: string;
  travelEndDate: string;
}

interface EventType {
  id: string;
  name: string;
  public: boolean;
  scheduleList: [];
  travelEndDate: number[];
  travelStartDate: number[];
}

interface ModalItem {
  name: string;
  date: DatesRangeValue;
}

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
      .then((data) => setToken(data.accessToken));
  }, []);

  const [event, setEvent] = useState([]);
  console.log("Event", event);

  //Gets All Travel Plans
  /////////get_all/////////

  //console.log(event);

  const [opened, setOpened] = useState(false); //for modal

  //travelPlan details for CREATION
  const [travelPlanDetails, setTravelPlanDetails] = useState({
    uuid: uuid(),
    startDate: "",
    endDate: "",
    name: "",
  });

  const [dateRanges, setDateRanges] = useState<[Date | null, Date | null]>([
    new Date(),
    null,
  ]);

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

  //this is in the eventFormat(from our og response) rather than the submission format
  const [itemToAdd, setItemToAdd] = useState();

  const submit_travel_plan = () => {
    fetch("http://localhost:8080/travelPlan/create_travel_plan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(travelPlanDetails),
    })
      .then((response) => response.json())
      .then((data) => {
        fetch(`http://localhost:8080/travelPlan/get_by_id?planId=${data}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => response.json())
          .then((_data) => setItemToAdd(_data));
      });

    setTravelPlanDetails({
      uuid: uuid(), // Generate a new UUID for the next entry
      startDate: "",
      endDate: "",
      name: "",
    });

    setDateRanges([new Date(), null]);
    setInitialSlides(event.length);
  };

  useEffect(() => {
    if (itemToAdd) {
      setEvent((p) => [...p, itemToAdd]);
    }
    //console.log("event is after adding", event);
  }, [itemToAdd]);

  function deleteTravelPlan(id: string) {
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
      .then(
        (data) => (
          console.log("successful in deleting travelPlan", data),
          setEvent((p) => p.filter((ev: EventType) => ev.id !== id))
        )
      )
      .catch((error) => console.log("error in deleting traevlPlan", error));

    //EXTRA THINGS --> DELETE ALL SCHEDULES HERE
  }

  const cardTravel = () => {
    return event
      ? event.map((items: TravelPlan) => (
          //console.log("Rendering item", items.id),
          <Carousel.Slide key={items.id}>
            <Center h={550}>
              <Stack align="center">
                <Title>{items.name}</Title>
                <Text style={{ fontSize: "15px" }}>
                  From{" "}
                  {moment(items.travelStartDate, "YYYY-MM-DD").format(
                    "MMM Do YY"
                  )}{" "}
                  to {` `}
                  {moment(items.travelEndDate, "YYYY-MM-DD").format(
                    "MMM Do YY"
                  )}
                </Text>
                <ActionIcon
                  className="edit-button"
                  variant="subtle"
                  color="cyan"
                  onClick={() => (
                    setOpened(true),
                    console.log("item id is", items.id),
                    open_travel_plan(items.id)
                  )}
                >
                  <IconEdit />
                </ActionIcon>
                {localStorage.getItem(`authToken`) ? (
                  <Link to={`/schedulePage/${items.id}`}>
                    <ActionIcon
                      variant="transparent"
                      className="to-schedule-button"
                    >
                      <IconSquareRoundedArrowRight size={28} color="black" />
                    </ActionIcon>
                  </Link>
                ) : (
                  <Tooltip label="Sign In to Create Schedules">
                    <ActionIcon
                      className="to-schedule-button"
                      variant="filled"
                      data-disabled
                    >
                      <IconSquareRoundedArrowRight size={28} />
                    </ActionIcon>
                  </Tooltip>
                )}
                <Menu shadow="md">
                  <Menu.Target>
                    <ActionIcon variant="subtle" c="red">
                      <IconX />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Label>Danger</Menu.Label>
                    <Menu.Divider></Menu.Divider>
                    <Menu.Item
                      c="red"
                      onClick={(e) => (
                        deleteTravelPlan(items.id), e.preventDefault()
                      )}
                      leftSection={<IconTrash size={14} />}
                    >
                      Delete
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </Stack>
            </Center>
          </Carousel.Slide>
        ))
      : null;
  };

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

  useEffect(() => {
    //console.log("Event updated:", event);
    // Optionally force a refresh here if the carousel supports it
  }, [event]);

  const [initialSlides, setInitialSlides] = useState(0);

  const [activeTab, setActiveTab] = useState<string | null>("incomplete");

  //const [modalTravelPlan, setModalTravelPlan] = useState();
  const [editTravelPlan, setEditTravelPlan] = useState({
    uuid: "",
    name: "",
    startDate: "",
    endDate: "",
  });

  const [editTravelPlanModal, setEditTravelPlanModal] = useState<ModalItem>({
    name: "",
    date: [null, null],
  });

  const open_travel_plan = (planID: string) => {
    //find it from our event list
    const tp: EventType = event?.find((ev: EventType) => ev.id === planID);
    console.log("tp is", tp);
    if (!tp) {
      throw new Error("No tp found with the given id");
    }

    const modalItem: ModalItem = {
      name: tp.name,
      date: [
        moment(tp.travelStartDate).subtract(1, "month").toDate(),
        moment(tp.travelEndDate).subtract(1, "month").toDate(),
      ],
    };
    const travelItem = {
      uuid: planID,
      name: tp.name,
      startDate: moment(tp.travelStartDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
      endDate: moment(tp.travelEndDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
    };
    setEditTravelPlanModal(modalItem);
    setEditTravelPlan(travelItem);
  };

  const modify_travel_plan_date = (e) => {
    setEditTravelPlanModal((p) => ({ ...p, date: e }));
    console.log("e is", e[0], e[1]);
    setEditTravelPlan((p) => ({
      ...p,
      startDate: moment(e[0]).format("YYYY-MM-DD"),
      endDate: moment(e[1]).format("YYYY-MM-DD"),
    }));
  };

  const update_travel_plan = () => {
    fetch(`http://localhost:8080/travelPlan/modify_travel_plan`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(editTravelPlan),
    })
      .then((response) => response.json())
      .then(
        (data) => (
          console.log("success in modifying travel plan"),
          setEvent((p) => {
            const index = event.findIndex((item) => item.id === data.id);
            const currentItems = [...p];
            console.log("curr items", currentItems);
            currentItems[index] = data;
            //console.log("index of item is", index);
            return currentItems;
          })
        )
      )
      .catch((error) => console.log("error in modifying travel plan", error));

    setOpened(false);
  };
  return (
    <>
      <Header></Header>
      <Space h={85} />
      <Center>
        <Card shadow="xs" radius="lg" h={600} w={600} withBorder>
          <Tabs
            className="tabs"
            variant="outline"
            radius="md"
            value={activeTab}
            onChange={setActiveTab}
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
              <Carousel
                initialSlide={initialSlides}
                withIndicators
                key={event.length}
                withControls={event.length > 0}
                styles={{
                  indicator: { backgroundColor: "#A9ADB9", marginTop: "px" },
                }}
              >
                {cardTravel()}
              </Carousel>
            </Tabs.Panel>
            <Tabs.Panel value="create_travel">
              <Center h={500}>
                <Stack w={300}>
                  <Title
                    style={{
                      textShadow: "1px 1px 1px rgba(0, 0, 0, 0.5)",
                    }}
                  >
                    Create Plan
                  </Title>
                  <Divider></Divider>
                  <TextInput
                    //right hand side
                    description="Activity Name"
                    rightSectionPointerEvents="all"
                    rightSection={
                      <CloseButton
                        size={23}
                        aria-label="Clear Name"
                        onClick={() =>
                          setTravelPlanDetails((p) => ({
                            ...p,
                            name: "",
                          }))
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
                  ></TextInput>
                  <DatePickerInput
                    description="Date Range"
                    clearable
                    type="range"
                    placeholder="Choose Date"
                    value={dateRanges}
                    onChange={settingTravelPlanDetailsDate}
                  ></DatePickerInput>
                  <Button
                    mt={15}
                    color="red"
                    radius="lg"
                    type="submit"
                    onClick={(e) => {
                      console.log(travelPlanDetails);
                      console.log(e);
                      submit_travel_plan();
                      setActiveTab("incomplete");
                    }}
                  >
                    Create
                  </Button>
                </Stack>
              </Center>
            </Tabs.Panel>
          </Tabs>
        </Card>
      </Center>

      <Modal
        centered
        size="auto"
        opened={opened}
        onClose={() => setOpened(false)}
        overlayProps={{ backgroundOpacity: 0.3 }}
      >
        <Stack>
          <Title style={{ fontFamily: "monospace" }}>Edit Details</Title>
          <Divider></Divider>
          <TextInput
            w={350}
            //right hand side
            value={editTravelPlanModal.name}
            onChange={(e) => {
              console.log("name changed", e.target.value);
              setEditTravelPlanModal((p) => ({ ...p, name: e.target.value }));
              setEditTravelPlan((p) => ({ ...p, name: e.target.value }));
            }}
            description="Name"
            rightSectionPointerEvents="all"
            rightSection={
              <CloseButton
                aria-label="Clear Name"
                size={23}
                onClick={() => (
                  setEditTravelPlanModal((p) => ({ ...p, name: "" })),
                  setEditTravelPlan((p) => ({ ...p, name: "" }))
                )}
              />
            }
            required
            //other Input Properties
            placeholder="Choose Name"
          ></TextInput>
          <DatePickerInput
            description="Date Range"
            clearable
            type="range"
            placeholder="Choose Date"
            value={editTravelPlanModal.date}
            //onChange={settingTravelPlanDetailsDate}
            onChange={
              (e) =>
                //setUpdateTravelPlan((p) => ({ ...p, date: e })),
                modify_travel_plan_date(e)
              //setUpdateTravelPlanModal(e), console.log("e is", e)
              //</Stack>setDateTest(e)
            }
          ></DatePickerInput>
          <Button
            color="green"
            variant="outline"
            type="submit"
            onClick={update_travel_plan}
          >
            Update
          </Button>
        </Stack>
      </Modal>
    </>
  );
}

export default TravelPlans;