import {
  ActionIcon,
  Burger,
  Button,
  Card,
  Center,
  Container,
  Divider,
  GridCol,
  Group,
  HoverCard,
  Menu,
  ScrollArea,
  SimpleGrid,
  Space,
  Stack,
  Text,
  Title,
  UnstyledButton,
} from "@mantine/core";
import Header from "../Header/Header";
import {
  IconArrowDown,
  IconArrowRight,
  IconEdit,
  IconSettings,
  IconSortAscendingLetters,
  IconSquareRoundedArrowRight,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import { v4 as uuid } from "uuid";

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
  const [burgerOpen, setBurgerOpen] = useState(false);

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
  console.log(
    "homepageItem",
    JSON.parse(sessionStorage.getItem("HomePageTravel"))
  );

  const eventCards = () => {
    if (!eventData) {
      return null;
    }
    return eventData;
  };

  return (
    <>
      <header>
        <Header />
      </header>
      <body>
        <Space h={65} />

        <Container>
          <ScrollArea h={650}>
            <Group justify="space-between">
              <Group className="travel-details">
                <Button
                  rightSection={<IconSortAscendingLetters color="gray" />}
                  variant="transparent"
                >
                  Name
                </Button>
                <Button
                  rightSection={<IconArrowDown color="gray" />}
                  variant="transparent"
                >
                  Date
                </Button>
              </Group>
            </Group>
            <Divider />
            <Space h={15}></Space>
            <Card withBorder shadow="xs" radius="md" h={150}>
              <Group justify="space-between">
                <Stack ml={40} mt={23}>
                  <Title>Name</Title>

                  <Text c="gray" style={{ fontSize: "15px" }}>
                    From to {` `}
                  </Text>
                </Stack>
                <Group>
                  <HoverCard>
                    <HoverCard.Target>
                      <ActionIcon
                        variant="transparent"
                        className="to-schedule-button"
                      >
                        <IconArrowRight size={28} color="black" />
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
                      <Menu.Item>Edit</Menu.Item>
                      <Menu.Divider />
                      <Menu.Label>Danger Zone</Menu.Label>
                      <Menu.Item c="red">Delete</Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Group>
              </Group>
            </Card>
            <Stack justify="center" align="center"></Stack>
          </ScrollArea>
        </Container>
      </body>
    </>
  );
}

export default TravelPlansNewUI;
function setInitialSlides(length: any) {
  throw new Error("Function not implemented.");
}
