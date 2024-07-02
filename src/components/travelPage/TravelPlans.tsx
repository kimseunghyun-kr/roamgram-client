import { Carousel } from "@mantine/carousel";
import {
  ActionIcon,
  Button,
  Card,
  Center,
  CloseButton,
  Divider,
  Loader,
  Menu,
  Modal,
  Popover,
  Space,
  Stack,
  Tabs,
  Text,
  TextInput,
  Title,
  Tooltip,
  UnstyledButton,
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../Login/AuthContext.tsx";

//const data = [
//  { name: "First", startDate: "2024-06-18", endDate: "2024-06-18" },
//  { name: "Second", startDate: "2024-06-18", endDate: "2024-06-20" },
//  { name: "Third", startDate: "2024-06-18", endDate: "2024-06-31" },
//];

type DatesRangeValue = [Date | null, Date | null];

interface TravelPlan {
  uuid: string;
  name: string;
  startDate: string;
  endDate: string;
}

interface TravelPlanDate {
  uuid: string;
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
  const [event, setEvent] = useState([]);
  //console.log("Event", event);

  //Gets All Travel Plans
  /////////get_all/////////

  //console.log(event);
  const authToken = sessionStorage.getItem(`authToken`);

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

  const queryClient = useQueryClient();
  //initial fetching of our eventList
  const { data: eventData, error: eventError } = useQuery({
    queryKey: ["queryEvent"],
    queryFn: async () => {
      console.log("authb  bearer", authToken);
      if (authToken) {
        const res = await fetch(
          `${import.meta.env.VITE_APP_API_URL}/travelPlan/get_all`,
          {
            credentials: "include",
            method: "GET",
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        console.log("fetching", res);
        return res.json();
      } else {
        throw new Error("No token");
      }
    },
  });

  console.log("queryData is", eventData);

  //mutations this works but now we need to edit the cache
  const { mutateAsync: eventMutate, isPending: createPending } = useMutation({
    mutationFn: async (travelPlan_content) => {
      await fetch(
        `${import.meta.env.VITE_APP_API_URL}/travelPlan/create_travel_plan`,
        {
          credentials: "include",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(travelPlan_content),
        }
      );
    },
    onSuccess: (travelPlan_content) => {
      console.log("travel-content", travelPlan_content);
      queryClient.invalidateQueries({ queryKey: ["queryEvent"] });
      setDateRanges([new Date(), null]);
      setInitialSlides(eventData.length);
      console.log("ssuccess");
    },
    onError: () => {
      console.log("Error in adding TP");
    },
    // onSettled: () => {
    //  queryClient.invalidateQueries({ queryKey: ["queryEvent"] });
    //},
  });

  useEffect(() => {
    if (itemToAdd) {
      setEvent((p) => [...p, itemToAdd]);
    }
    //console.log("event is after adding", event);
  }, [itemToAdd]);

  //this works
  const { mutateAsync: deleteMutate } = useMutation({
    mutationFn: async (id: string) => {
      console.log("authb  bearer", authToken);
      return await fetch(
        `${import.meta.env.VITE_APP_API_URL}/travelPlan/delete_travel_plan`,
        {
          credentials: "include",
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify([id]),
        }
      ).then((res) => res.json());
    },
    //optimistic mutate for immediate render
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["queryEvent"] });
      const previousTodos = queryClient.getQueryData(["queryEvent"]);
      queryClient.setQueryData(["queryEvent"], (oldEvents) => {
        const filtered = oldEvents.filter((ev) => ev.id !== id);
        return filtered;
      });
      return previousTodos;
    },
    onSuccess: () => console.log("success delete bro"),
    onError: () => console.log("Error Deleting TP"),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["queryEvent"] });
    },
  });

  const homePageItem = JSON.parse(sessionStorage.getItem("HomePageTravel"));
  //console.log(
  //  "homepageItem",
  //  JSON.parse(sessionStorage.getItem("HomePageTravel"))

  //console.log("homepageitem", homePageItem);
  const UnauthCardTravel = () => {
    return (
      <Center h={550}>
        <Stack align="center">
          {homePageItem ? (
            <>
              <Title>{homePageItem?.name ?? null}</Title>

              <Text style={{ fontSize: "15px" }}>
                From{" "}
                {moment(homePageItem.dateRange[0], "YYYY-MM-DD").format(
                  "MMM Do YY"
                )}{" "}
                to {` `}
                {moment(homePageItem.dateRange[1], "YYYY-MM-DD").format(
                  "MMM Do YY"
                )}
              </Text>

              <Link to="/login">
                <UnstyledButton c="red">
                  Sign In to access more options
                </UnstyledButton>
              </Link>
            </>
          ) : null}
        </Stack>
      </Center>
    );
  };

  const cardTravel = () => {
    if (!eventData) {
      return null;
    }
    return eventData
      ? eventData.map((items) => (
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
                    //console.log("item id is", items.id),
                    open_travel_plan(items.id)
                  )}
                >
                  <IconEdit />
                </ActionIcon>
                {authToken ? (
                  <Link to={`/schedulePage/travelID?id=${items.id}`}>
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
                        deleteMutate(items.id), e.preventDefault()
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

  const [initialSlides, setInitialSlides] = useState(0);

  const [activeTab, setActiveTab] = useState<string | null>("incomplete");

  const [homePageItems, setHomePageItems] = useState(null);

  const [homeItem, sethomeItem] = useState({
    uuid: uuid(),
    name: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    //const token = sessionStorage.getItem(`authToken`);
    //console.log(tokens);
    //console.log("itemshometravel", sessionStorage.getItem(`HomePageTravel`));
    if (sessionStorage.getItem(`HomePageTravel`)) {
      const items = JSON.parse(sessionStorage.getItem(`HomePageTravel`));
      sethomeItem((p) => ({
        ...p,
        name: items.name,
        startDate: moment(items.dateRange[0]).format("YYYY-MM-DD"),
        endDate: moment(items.dateRange[1]).format("YYYY-MM-DD"),
      }));
    }
  }, [authToken]);

  useEffect(() => {
    if (homeItem?.name && authToken) {
      eventMutate(homeItem);
      sessionStorage.removeItem(`HomePageTravel`);
      sethomeItem(null);
    }
  }, [authToken]);

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
    const tp: EventType = eventData?.find((ev: EventType) => ev.id === planID);
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

  const { mutateAsync: updateMutate } = useMutation({
    mutationFn: async (updated_plan) => {
      const res = await fetch(
        `${import.meta.env.VITE_APP_API_URL}/travelPlan/modify_travel_plan`,
        {
          credentials: "include",
          method: "PATCH",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(updated_plan),
        }
      );
      return res.json();
    },
    onSuccess: (data) => {
      console.log("data is", data);
      const dataID = data.id;
      const previousTodos = queryClient.getQueryData(["queryEvent"]);
      const index = previousTodos.findIndex((item) => item.id === dataID);
      previousTodos[index] = data;
      queryClient.setQueryData(["queryEvent"], (old) => previousTodos);
      setOpened(false);
    },
  });

  const [createUnauth, setCreateUnauth] = useState(false);

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
              {authToken && eventData ? (
                <Carousel
                  initialSlide={initialSlides}
                  withIndicators
                  key={eventData.length}
                  withControls={eventData.length > 0}
                  styles={{
                    indicator: { backgroundColor: "#A9ADB9", marginTop: "px" },
                  }}
                >
                  {cardTravel()}
                </Carousel>
              ) : (
                UnauthCardTravel()
              )}
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
                  <Popover opened={createUnauth} onChange={setCreateUnauth}>
                    <Popover.Target>
                      {!createPending ? (
                        <Button
                          mt={15}
                          color="red"
                          radius="lg"
                          type="submit"
                          onClick={(e) => {
                            if (authToken) {
                              eventMutate(travelPlanDetails);
                              setActiveTab("incomplete");
                            } else {
                              setCreateUnauth(true);
                            }
                          }}
                        >
                          Create
                        </Button>
                      ) : (
                        <Loader size={30}></Loader>
                      )}
                    </Popover.Target>
                    <Popover.Dropdown>
                      <Text c="red" size="17px">
                        Please sign in to create extra plans
                      </Text>
                    </Popover.Dropdown>
                  </Popover>
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
            onClick={() => updateMutate(editTravelPlan)}
          >
            Update
          </Button>
        </Stack>
      </Modal>
    </>
  );
}

export default TravelPlans;
