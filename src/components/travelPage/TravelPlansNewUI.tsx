import {
  ActionIcon,
  Burger,
  Button,
  Card,
  Center,
  CloseButton,
  Container,
  Divider,
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
} from "@mantine/core";
import Header from "../Header/Header";
import {
  IconArrowDown,
  IconArrowRight,
  IconEdit,
  IconPhoto,
  IconPlus,
  IconSettings,
  IconSortAscendingLetters,
  IconSquareRoundedArrowRight,
  IconTrash,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import { v4 as uuid } from "uuid";
import { DatePickerInput } from "@mantine/dates";
import { Link } from "react-router-dom";
import { motion as m } from "framer-motion";

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

function TravelPlansNewUI() {
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
          `${import.meta.env.VITE_APP_API_URL}/travelPlan/get_all`,
          {
            credentials: "include",
            method: "GET",
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        return res.json();
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
    if (!eventData) {
      return null;
    }
    return eventData.map((items, index) => (
      <>
        <Space h={15} />
        <m.div
          initial={{ translateY: 50, opacity: 0 }}
          animate={{ translateY: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: index * 0.05 }}
        >
          <Card withBorder shadow="xs" radius="md" h={150} key={items.id}>
            <Group justify="space-between">
              <Stack ml={40} mt={23}>
                <Title>{items.name}</Title>

                <Text c="gray" style={{ fontSize: "15px" }}>
                  From{" "}
                  {moment(items.travelStartDate, "YYYY-MM-DD").format(
                    "MMM Do YY"
                  )}{" "}
                  to {` `}
                  {moment(items.travelEndDate, "YYYY-MM-DD").format(
                    "MMM Do YY"
                  )}
                </Text>
              </Stack>
              <Group>
                <HoverCard>
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
                <Menu>
                  <Menu.Target>
                    <ActionIcon variant="transparent" c="black">
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
        <Card withBorder shadow="xs" radius="md" h={150}>
          <Group justify="space-between">
            <Stack ml={40} mt={23}>
              <Title>{homePageItem?.name ?? null}</Title>
              <Text c="gray" style={{ fontSize: "15px" }}>
                From{" "}
                {moment(homePageItem?.dateRange[0], "YYYY-MM-DD").format(
                  "MMM Do YY"
                )}{" "}
                to{" "}
                {moment(homePageItem?.dateRange[1], "YYYY-MM-DD").format(
                  "MMM Do YY"
                )}
              </Text>
            </Stack>
            <Link to="/login">
              <UnstyledButton c="red">Sign In to Access</UnstyledButton>
            </Link>
          </Group>
        </Card>
      </>
    ) : null;
  };

  return (
    <>
      <header>
        <Header />
      </header>
      <body>
        <Space h={65} />

        <Container>
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
              >
                Create
              </Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="travel-plans">
              {authToken && eventData ? (
                <>
                  <div key={eventData.length}>
                    <ScrollArea h={650}>
                      <m.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ staggerChildren: 0.3 }}
                      >
                        <Space h={25}></Space>

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
                      required
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
                                setActiveTab("travel-plans");
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
      </body>
    </>
  );
}

export default TravelPlansNewUI;
