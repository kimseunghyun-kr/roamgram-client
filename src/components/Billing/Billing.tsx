import React, { useEffect, useRef, useState } from "react";
import Header from "../Header/Header";
import { DonutChart } from "@mantine/charts";
import {
  ActionIcon,
  Button,
  Card,
  Center,
  Divider,
  Group,
  Modal,
  NativeSelect,
  NumberFormatter,
  NumberInput,
  ScrollArea,
  SimpleGrid,
  Space,
  Stack,
  Text,
} from "@mantine/core";
import { IconCurrencyDollar, IconMinus, IconPlus } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import { allMonetaryEvents } from "../hooks/allIMoneteryEvents";
import moment from "moment";
import { allIncome } from "../hooks/allIncome";
import { allExpenditure } from "../hooks/allExpenditure";
import { motion as m, useSpring } from "framer-motion";

function Billing() {
  const url = window.location.search;
  const urlParams = new URLSearchParams(url);
  const travelID = urlParams.get("id");
  const initialData = [
    { name: "Food and Dining", value: 0, color: "indigo.6" },
    { name: "Transportation", value: 0, color: "yellow.6" },
    { name: "Activities and Entertainment", value: 0, color: "teal.6" },
    { name: "Accommodation", value: 0, color: "orange.6" },
    { name: "Travel Insurance", value: 0, color: "blue.6" },
    { name: "Souvenirs", value: 0, color: "green.6" },
    { name: "Miscellaneous", value: 0, color: "red.6" },
    { name: "Income", value: 0, color: "gray.6" },
  ];
  const [data, setData] = useState(initialData);

  // const requestbody = {
  //   id: "26322794-3651-47c4-9b2c-889bd4095d7e",
  //   parentActivityId: "26322794-3651-47c4-9b2c-889bd4095d7e",
  //   amount: {
  //     value: 10,
  //   },
  //   currency: "SGD",
  //   source: "test",
  //   description: "test",
  // };

  // const typeExpense = [
  //   "Food and Dining",
  //   "Activities and Entertainment",
  //   "Transportation",
  //   "Accommodation",
  //   "Travel Insurance",
  //   "Souvenirs",
  //   "Miscellaneous",
  // ];

  // const supportedCurrencies = [
  //   "USD", // US Dollar
  //   "SGD", // Singapore Dollar
  //   "EUR", // Euro
  //   "GBP", // British Pound
  //   "JPY", // Japanese Yen
  //   "AUD", // Australian Dollar
  //   "CAD", // Canadian Dollar
  //   "CHF", // Swiss Franc
  //   "CNY", // Chinese Yuan
  //   "HKD", // Hong Kong Dollar
  // ];

  // console.log("url", travelID);

  const [income, setIncome] = useState(0);
  const [expenditure, setExpenditure] = useState(0);

  const { data: allMonetaryEvent } = useQuery({
    queryKey: ["all-monetary-events"],
    queryFn: async () => await allMonetaryEvents(travelID),
  });
  const amountRef = useRef(null);
  const typeRef = useRef(null);

  const setDonutData = async () => {
    const content = allMonetaryEvent?.content;
    const eventData = data;
    // console.log("varData", eventData);

    if (content) {
      content.map((ev) => {
        const description = ev.description;
        // console.log("val", eventData.find((ev) => ev.name === description).value);
        // console.log("ev", ev);
        // console.log("ev.val", ev.amount);
        console.log("ev", ev);
        console.log("ye11s");
        console.log(
          "eeeeee",
          eventData.find((ev) => ev.name === description)
        );

        eventData.find((ev) => ev.name === description).value += ev.amount;

        // return content.map((ev) => {
        //   const description = ev.description;
        //   return eventData.find((ev) => ev.name === description)
        //     ? eventData.find((ev) => ev.name === description).value + ev.amount
        //     : null;
        // });
      });
      console.log("newData", eventData);
      setData(eventData);
    }
  };

  const setDonutGroups = async () => {
    const content = allMonetaryEvent?.content;
    console.log(content);
    await content.map((ev) =>
      initialData.find((i) => i.name == ev.description)
        ? (initialData.find((i) => i.name == ev.description).value += ev.amount)
        : null
    );
    console.log("newData", initialData);
    return setData([...initialData]);
  };

  console.log("ups,", data);
  const groupByDate = () => {
    const content = allMonetaryEvent?.content.sort((a, b) => {
      return a.timestamp < b.timestamp ? 1 : -1;
    });
    return content.reduce((accumulator, currentValue) => {
      const date = moment.unix(currentValue.timestamp).format("MMMM DD YYYY");
      if (!accumulator[date]) {
        //date does not exist, we will create
        accumulator[date] = [];
      }
      accumulator[date].push(currentValue);
      // console.log("check", accumulator);
      return accumulator;
    }, {});
  };

  const getAllIncome = async () => {
    const allIncomeEvents = await allIncome(travelID);
    const totalIncome = allIncomeEvents.content.reduce(
      (accumulater, currentValue) => {
        return accumulater + currentValue.amount;
      },
      0
    );
    console.log(totalIncome);
    setIncome(totalIncome);
  };

  const getAllExpenditures = async () => {
    const allExpenditureEvents = await allExpenditure(travelID);
    const totalExpenditure = allExpenditureEvents.content.reduce(
      (accumulater, currentValue) => {
        return accumulater + currentValue.amount;
      },
      0
    );
    console.log(totalExpenditure);
    setExpenditure(totalExpenditure);
  };

  useEffect(() => {
    // const fetchDonutData = async () => {
    //   await setDonutGroups();
    // };
    // const fetchAllData = async () => {
    //   await getAllIncome();
    //   await getAllExpenditures();
    //   await fetchDonutData();
    // };
    getAllIncome();
    getAllExpenditures();
    // fetchDonutData();
    // fetchDonutData();
    // console.log("data", data);
    // fetchAllData();
  }, []);

  useEffect(() => {
    setDonutGroups();
    return () => {
      setData([...initialData]);
    };
  }, [allMonetaryEvent]);

  const allMonetaryCard = () => {
    // const allMonetaryEventContent = allMonetaryEvent?.content.sort((a, b) => {
    //   return a.timestamp < b.timestamp ? 1 : -1;
    // });
    const sortedWithKey = groupByDate();

    return Object.keys(sortedWithKey).map((ev, index) => (
      <>
        <m.div
          initial={{ translateY: 50, opacity: 0 }}
          animate={{ translateY: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.09 * index }}
        >
          <Text
            style={{
              fontSize: "18px",
              fontFamily: "Roboto",
              fontStyle: "lighter",
              paddingTop: "7px",
            }}
            mt={5}
          >
            {ev}
          </Text>
          {sortedWithKey[ev].map((schedules) => (
            <Card shadow="xs" withBorder mb={8} key={schedules.timestamp}>
              <Text c="gray" style={{ fontSize: "14px" }}>
                {moment.unix(schedules.timestamp).format("HH:mm")}
              </Text>
              <Text fw="300" style={{ fontSize: "23px" }}>
                {schedules.description}
              </Text>
              {schedules.type === "income" ? (
                <Text fw="bold" style={{ fontSize: "14px" }} c="darkgreen">
                  {`+ ${schedules.amount} ${schedules.currency}`}
                </Text>
              ) : (
                <Text style={{ fontSize: "14px", fontWeight: "bold" }} c="red">
                  {`- ${schedules.amount} ${schedules.currency}`}
                </Text>
              )}
            </Card>
          ))}
        </m.div>
      </>
    ));
  };

  const chartVariants = {
    hidden: { opacity: 0, scale: 0.3 },
    visible: { opacity: 1, scale: 1 },
  };
  return (
    <>
      <header>
        <Header />
      </header>
      <body>
        <SimpleGrid cols={2}>
          <Stack align="center" justify="center" mt={140} ml={150}>
            <Group gap="lg">
              <m.div
                initial="hidden"
                animate="visible"
                variants={chartVariants}
                transition={{ duration: 1 }}
              >
                <DonutChart
                  data={data}
                  tooltipDataSource="segment"
                  size={350}
                  thickness={35}
                  chartLabel={`$ ${income - expenditure}`}
                  styles={{
                    label: { fontSize: "35px", overflow: "hidden" },
                  }}
                />
              </m.div>
            </Group>
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <Stack mt={15}>
                <Text
                  pr={60}
                  c="blue"
                  size="md"
                  fw="bold"
                  style={{ borderBottom: "1px solid gray" }}
                >
                  Total Income
                </Text>
                <Text size="md" c="darkgreen">
                  {`$ ${income}`}
                </Text>
                <Text
                  size="md"
                  c="blue"
                  fw="bold"
                  style={{ borderBottom: "1px solid gray" }}
                >
                  Total Expenditure
                </Text>
                <Text size="md" c="red">
                  {`-$ ${expenditure}`}
                </Text>
              </Stack>
              {/* <Divider w={300} /> */}
              <Space h={10} />
            </m.div>
          </Stack>
          <Stack w={600} mt={20}>
            <m.div
              initial={{ translateY: 50, opacity: 0 }}
              animate={{ translateY: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.06 }}
            >
              <Text
                style={{
                  borderBottom: "solid 2px gray",
                  fontSize: "30px",
                  fontFamily: "Monsteratt",
                }}
              >
                History
              </Text>
            </m.div>
            <ScrollArea h="70vh">
              {allMonetaryEvent ? allMonetaryCard() : null}
            </ScrollArea>
            {/* <Card shadow="xs" withBorder>
              <Text fw="300" style={{ fontSize: "23px" }}>
                Activity
              </Text>
              <NumberFormatter
                prefix="$ "
                value={1000.231231}
                thousandSeparator
              ></NumberFormatter>
              <Text c="gray" size="xs" mt={10}>
                JPY
              </Text>
            </Card> */}
          </Stack>
        </SimpleGrid>
      </body>
    </>
  );
}

export default Billing;
