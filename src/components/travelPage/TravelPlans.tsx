import {
  ActionIcon,
  Blockquote,
  Burger,
  Button,
  Card,
  Center,
  CloseButton,
  Container,
  Divider,
  Flex,
  GridCol,
  Group,
  HoverCard,
  Loader,
  Menu,
  Modal,
  Popover,
  ScrollArea,
  SimpleGrid,
  Space,
  Stack,
  Tabs,
  Text,
  TextInput,
  Title,
  UnstyledButton,
  Notification,
  Alert,
  Avatar,
} from "@mantine/core";
import Header from "../Header/Header";
import {
  IconArrowDown,
  IconArrowRight,
  IconCheck,
  IconCircleCheckFilled,
  IconCoin,
  IconEdit,
  IconMinus,
  IconPhoto,
  IconPlus,
  IconSettings,
  IconShare3,
  IconSortAscendingLetters,
  IconSquareRoundedArrowRight,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import { v4 as uuid } from "uuid";
import { DatePickerInput } from "@mantine/dates";
import { Link } from "react-router-dom";
import { AnimatePresence, motion as m } from "framer-motion";
import "./TravelPlans.css";
import { findUser } from "../hooks/findUser";
import { addUserHook } from "../hooks/addUserHook";

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
const pastelColors = [
  "#FFB3BA", // Pastel Red
  "#FFDFBA", // Pastel Orange
  "#FFFFBA", // Pastel Yellow
  "#BAFFC9", // Pastel Green
  "#BAE1FF", // Pastel Blue
];

function TravelPlans() {
  const [event, setEvent] = useState([]);

  //Gets All Travel Plans
  /////////get_all/////////

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
      if (authToken) {
        const res = await fetch(
          `${
            import.meta.env.VITE_APP_API_URL
          }/travelPlan/get_all?pageNo=0&pageSize=100`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        ).then((res) => res.json());
        return res.content;
      } else {
        throw new Error("No token");
      }
    },
  });

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
      queryClient.invalidateQueries({ queryKey: ["queryEvent"] });
      setDateRanges([new Date(), null]);
      setInitialSlides(eventData.length);
    },
    onError: () => {},
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

  const [initialSlides, setInitialSlides] = useState(0);

  const [activeTab, setActiveTab] = useState<string | null>("travel-plans");

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
    if (sessionStorage.getItem(`HomePageTravel`) && authToken) {
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
    console.log("useItem", homeItem);
    console.log("sueItem", authToken);
    if (homeItem?.name && authToken) {
      eventMutate(homeItem);
      sessionStorage.removeItem(`HomePageTravel`);
      sethomeItem(null);
    }
  }, [homeItem]);

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

  const cardSection = () => {
    console.log("eventData", eventData);
    if (!eventData) {
      return null;
    }
    return eventData.map((items, index) => (
      <>
        <Space h={15} />
        <m.div
          initial={{ translateY: 50, opacity: 0 }}
          animate={{ translateY: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: index * 0.06 }}
        >
          <Card
            w={900}
            withBorder
            shadow="md"
            radius="lg"
            h={160}
            key={items.id}
            className="travel-card"
            style={{
              borderLeft: "1rem solid",
              borderLeftColor: pastelColors[index % 5],
            }}
          >
            <Group justify="space-between">
              <Stack
                // ml={40}
                justify="center"
                mt={20}
                // mr={300}
                pl={20}
                w={480}
              >
                <Group>
                  <Title style={{ fontFamily: "georgia" }}>{items.name}</Title>
                </Group>

                <Text
                  c="#4A5167"
                  pt={7}
                  style={{
                    fontSize: "17px",
                    fontFamily: "tahoma",
                    borderTop: "1px solid gray",
                  }}
                >
                  {moment(items.travelStartDate, "YYYY-MM-DD").format("MMM Do")}{" "}
                  to{" "}
                  {moment(items.travelEndDate, "YYYY-MM-DD").format("MMM Do")}
                </Text>
              </Stack>
              <Group gap="sm" ml={110}>
                <Stack>
                  <Link to={`/schedulePage/travelID?id=${items.id}`}>
                    <Button
                      className="to-schedule-button"
                      variant="outline"
                      color="grape"
                      radius="xl"
                    >
                      Move to Calender
                    </Button>
                  </Link>
                  <Link to={`/billing/travelID?id=${items.id}`}>
                    <Button variant="outline" color="indigo" radius="xl">
                      Track Expenditure
                    </Button>
                  </Link>
                </Stack>
                <Menu>
                  <Menu.Target>
                    <ActionIcon
                      size="lg"
                      radius="xl"
                      variant="gradient"
                      gradient={{ from: "cyan", to: "teal", deg: 262 }}
                      color="gray "
                    >
                      <IconSettings />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Label>Application</Menu.Label>
                    <Menu.Item
                      onClick={() => (
                        setOpened(true),
                        //console.log("item id is", items.id),
                        open_travel_plan(items.id)
                      )}
                    >
                      Edit
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Label>Danger Zone</Menu.Label>
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
                <ActionIcon
                  aria-label="share-button"
                  size="md"
                  c="rgba(128, 128, 128, 0.5)"
                  variant="transparent"
                  onClick={async () => (
                    setShareOpen(true), await setShareTravelId(items.id)
                  )}
                >
                  <IconShare3 />
                </ActionIcon>
              </Group>
              <Group>
                {/* <HoverCard>
                  <HoverCard.Target>
                    <ActionIcon
                      variant="transparent"
                      className="to-schedule-button"
                    >
                      <Link to={`/schedulePage/travelID?id=${items.id}`}>
                        <IconArrowRight size={28} color="black" />
                      </Link>
                    </ActionIcon>
                  </HoverCard.Target>
                  <HoverCard.Dropdown>
                    <Text size="xs">Click here to check your schedules</Text>
                  </HoverCard.Dropdown>
                </HoverCard>
                <HoverCard>
                  <HoverCard.Target>
                    <ActionIcon variant="transparent">
                      <Link to={`/billing/travelID?id=${items.id}`}>
                        <IconCoin size={26} color="black" />
                      </Link>
                    </ActionIcon>
                  </HoverCard.Target>
                  <HoverCard.Dropdown>
                    <Text size="xs">Click here to track expenditure</Text>
                  </HoverCard.Dropdown>
                </HoverCard> */}
              </Group>
            </Group>
          </Card>
        </m.div>
      </>
    ));
  };
  const unauthCardSection = () => {
    return homePageItem && !authToken ? (
      <>
        <Space h={15} />
        <m.div
          initial={{ translateY: 50, opacity: 0 }}
          animate={{ translateY: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.06 }}
        >
          <Card
            withBorder
            shadow="md"
            radius="lg"
            h={160}
            aria-label="unauth-card"
            style={{
              borderLeft: "1rem solid",
              borderLeftColor:
                pastelColors[Math.floor(Math.random() * pastelColors.length)],
            }}
          >
            <Group justify="space-between">
              <Stack justify="center" mt={20} mr={300} pl={20}>
                <Title style={{ fontFamily: "georgia" }}>
                  {homePageItem?.name ?? null}
                </Title>
                <Text
                  c="#4A5167"
                  pt={7}
                  style={{
                    fontSize: "17px",
                    fontFamily: "tahoma",
                    borderTop: "1px solid",
                  }}
                >
                  {moment(homePageItem?.dateRange[0], "YYYY-MM-DD").format(
                    "MMM Do"
                  )}{" "}
                  to{" "}
                  {moment(homePageItem?.dateRange[1], "YYYY-MM-DD").format(
                    "MMM Do"
                  )}
                </Text>
              </Stack>
              <Link to="/login">
                <UnstyledButton
                  c="red"
                  ff="monsteratt"
                  style={{ fontSize: "19px" }}
                >
                  Sign In to Access
                </UnstyledButton>
              </Link>
            </Group>
          </Card>
        </m.div>
      </>
    ) : null;
  };

  const [shareOpen, setShareOpen] = useState(false);
  const addRef = useRef(null);
  const [addUser, setAddUser] = useState(null);
  const [shareTravelId, setShareTravelId] = useState(null);
  const [alertState, setAlertState] = useState(false);
  // console.log("addUSer", addUser);
  // console.log("adduser lenght", addUser?.length ?? null);
  console.log("addUser", addUser);
  console.log("share travel id", shareTravelId);
  return (
    <>
      <header>
        <Header />
      </header>
      <body>
        <Space h={65} />

        <Container className="c">
          <Tabs
            radius="md"
            variant="outline"
            value={activeTab}
            onChange={setActiveTab}
            defaultValue="travel-plans"
          >
            <Tabs.List>
              <Tabs.Tab
                leftSection={<IconPhoto color="green" />}
                value="travel-plans"
              >
                Travel Plans
              </Tabs.Tab>
              <Tabs.Tab
                ml={650}
                leftSection={<IconPlus color="gray" />}
                value="create-travel-plan"
                aria-label="create-reviews-tab-btn"
              >
                Create
              </Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="travel-plans">
              {authToken && eventData ? (
                <>
                  <div key={eventData.length}>
                    <ScrollArea h={690}>
                      <m.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ staggerChildren: 0.3 }}
                      >
                        <Space h={20}></Space>

                        {cardSection()}
                      </m.div>

                      <Stack justify="center" align="center"></Stack>
                    </ScrollArea>
                  </div>
                </>
              ) : (
                unauthCardSection()
              )}
            </Tabs.Panel>
            <Tabs.Panel value="create-travel-plan">
              <Center>
                <Center h={500}>
                  <Stack w={400}>
                    <Title
                      size={50}
                      style={{
                        textShadow: "1px 1px 1px rgba(0, 0, 0, 0.5)",
                      }}
                    >
                      Create Plan
                    </Title>
                    <Text
                      c="gray"
                      style={{ fontSize: "20px", fontFamily: "monsteratt" }}
                    >
                      Plan your next adventure with RoamGram
                    </Text>
                    <Divider></Divider>
                    <TextInput
                      //right hand side
                      size="md"
                      radius="lg"
                      description="Travel Plan Name"
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
                      radius="lg"
                      size="md"
                      description="Date Range"
                      clearable
                      required
                      type="range"
                      placeholder="Choose Date"
                      aria-label="create-plan-date-input"
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
                            className="create-plan-btn"
                            onClick={(e) => {
                              if (authToken) {
                                eventMutate(travelPlanDetails);
                                setActiveTab("travel-plans");
                                setTravelPlanDetails((p) => ({
                                  uuid: uuid(),
                                  startDate: "",
                                  endDate: "",
                                  name: "",
                                }));
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
              </Center>
            </Tabs.Panel>
          </Tabs>
        </Container>
        <Modal
          radius="xl"
          centered
          size="auto"
          opened={opened}
          onClose={() => setOpened(false)}
          overlayProps={{ backgroundOpacity: 0.3 }}
        >
          <Stack>
            <Title style={{ fontFamily: "Roboto" }}>Edit Details</Title>

            <Divider></Divider>
            <TextInput
              w={350}
              //right hand side

              radius="lg"
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
              placeholder="Type new name"
            ></TextInput>
            <DatePickerInput
              radius="lg"
              description="Date Range"
              clearable
              type="range"
              placeholder="Choose new date"
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
              radius="xl"
              type="submit"
              onClick={() => updateMutate(editTravelPlan)}
            >
              Update
            </Button>
          </Stack>
        </Modal>
        <Modal
          radius="md"
          centered
          opened={shareOpen}
          onClose={() => (setShareOpen(false), setAddUser(null))}
        >
          <Title order={2} fw="900">
            Share Plan with
          </Title>
          <Divider mt={10} />
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <TextInput
              mt={10}
              placeholder="Add People's Username Here"
              size="md"
              ref={addRef}
              required
            />
            <Flex justify="flex-end">
              <Button
                c="blue"
                mt={15}
                mr={5}
                type="submit"
                variant="outline"
                className="search-user"
                radius="xl"
                onClick={async (e) => {
                  console.log(addRef.current.value);

                  const user = await findUser(addRef.current.value);
                  setAddUser(user.content);
                }}
              >
                Search User
              </Button>
            </Flex>
          </form>
          {!addUser ? null : addUser?.length > 0 && addUser ? (
            <>
              <m.div
                initial={{ translateX: -50, opacity: 0 }}
                animate={{ translateX: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                exit={{ opacity: 0 }}
              >
                <Notification
                  icon={<IconCheck />}
                  color="teal"
                  title="Success"
                  withCloseButton={false}
                  w={150}
                  mt={-40}
                  h={50}
                  withBorder
                >
                  User Found
                </Notification>
              </m.div>
            </>
          ) : (
            <m.div
              initial={{ translateX: -50, opacity: 0 }}
              animate={{ translateX: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              exit={{ opacity: 0 }}
            >
              <Notification
                icon={<IconX />}
                color="red"
                title="Error"
                withCloseButton={false}
                w={190}
                mt={-40}
                h={60}
                withBorder
              >
                User Not Found
              </Notification>
            </m.div>
          )}

          <Space h={20} />
          {/* <Text>People with access</Text> */}
          <Divider />
          {/* Add Cards here on people who have access*/}
          <Space h={10} />
          <Flex justify="flex-end">
            <Popover
              position="left"
              opened={alertState}
              onChange={setAlertState}
              radius="xl"
              w={100}
            >
              <Popover.Target>
                <Button
                  w={100}
                  radius="lg"
                  variant="outline"
                  className="add-user"
                  onClick={async () => {
                    try {
                      await addUserHook(shareTravelId, addUser[0].id, "OWNER");
                      setShareOpen(false);
                      setAddUser(null);
                    } catch (e) {
                      console.log("skibidi");
                      await setAlertState(true);
                    }
                  }}
                >
                  Add User
                </Button>
              </Popover.Target>
              <Popover.Dropdown>
                <Group>
                  <Avatar radius="xl" color="red" size="sm">
                    <IconX />
                  </Avatar>
                  <Text c="red" w={100} style={{ fontSize: "13px" }}>
                    Error adding user
                  </Text>
                </Group>
              </Popover.Dropdown>
            </Popover>
          </Flex>
          {/* {alertState ? (
            <m.div
              initial={{ translateX: 90, opacity: 0 }}
              animate={{ translateX: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              exit={{ opacity: 0 }}
            >
              <Popover
                mt={10}
                icon={<IconX />}
                radius="xl"
                withBorder
                color="red"
                withCloseButton
                onClose={() => setAlertState(false)}
              >
                Error Adding User
              </Popover>
            </m.div>
          ) : null} */}
        </Modal>
      </body>
    </>
  );
}

export default TravelPlans;
