import React, { useRef } from "react";
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
  SimpleGrid,
  Stack,
  Text,
} from "@mantine/core";
import { IconCurrencyDollar, IconMinus, IconPlus } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";

function Billing() {
  const url = window.location.search;
  const urlParams = new URLSearchParams(url);
  const travelID = urlParams.get("id");

  const data = [
    { name: "Food and Dining", value: 400, color: "indigo.6" },
    { name: "Transportation", value: 300, color: "yellow.6" },
    { name: "Japan", value: 100, color: "teal.6" },
    { name: "Other", value: 200, color: "gray.6" },
  ];

  const requestbody = {
    id: "26322794-3651-47c4-9b2c-889bd4095d7e",
    parentActivityId: "26322794-3651-47c4-9b2c-889bd4095d7e",
    amount: {
      value: 10,
    },
    currency: "SGD",
    source: "test",
    description: "test",
  };

  const typeExpense = [
    "Food and Dining",
    "Activities and Entertainment",
    "Transportation",
    "Accommodation",
    "Travel Insurance",
    "Souvenirs",
    "Miscellaneous",
  ];

  const supportedCurrencies = [
    "USD", // US Dollar
    "SGD", // Singapore Dollar
    "EUR", // Euro
    "GBP", // British Pound
    "JPY", // Japanese Yen
    "AUD", // Australian Dollar
    "CAD", // Canadian Dollar
    "CHF", // Swiss Franc
    "CNY", // Chinese Yuan
    "HKD", // Hong Kong Dollar
  ];

  // console.log("url", travelID);

  const [opened, { open, close }] = useDisclosure(false);

  //if numberformatter is positive
  const addIncome = async (requestBody) => {
    return await fetch(
      `${import.meta.env.VITE_APP_API_URL}/api/monetary/new-income`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(requestBody),
      }
    ).then((res) => res.json());
  };

  //if numberformatter is negative
  const addExpenditure = async (requestBody) => {
    return await fetch(
      `${import.meta.env.VITE_APP_API_URL}/api/monetary/new-expenditure`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(requestBody),
      }
    ).then((res) => res.json());
  };

  const getAllExpense = async () => {
    return await fetch(
      `${
        import.meta.env.VITE_APP_API_URL
      }/api/monetary/allIncome?travelPlanId=${travelID}&pageNumber=1&pageSize=1000'`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    ).then((res) => res.json());
  };

  const amountRef = useRef(null);
  const typeRef = useRef(null);
  const addTransaction = () => {
    console.log(amountRef.current.value);
    console.log(typeRef.current.value);
    const filtered = data.filter((ev) => ev.name !== typeRef.current.value);
    var current = data.filter((ev) => ev.name === typeRef.current.value);
    current["value"] = current["value"] + amountRef.current.value;
    console.log("filtered", current);
  };

  return (
    <>
      <header>
        <Header />
      </header>
      <body>
        <SimpleGrid cols={2} mt={40}>
          <Stack align="center">
            <DonutChart
              data={data}
              tooltipDataSource="segment"
              size={350}
              thickness={25}
              chartLabel="Income Here"
            />

            <NativeSelect data={supportedCurrencies} />
            <NativeSelect data={typeExpense} ref={typeRef} />
            <NumberInput
              ref={amountRef}
              decimalScale={2}
              placeholder="Add Amount"
              leftSection={<IconCurrencyDollar size={17} />}
            />
            <Button
              leftSection={<IconPlus />}
              className="add-transaction"
              onClick={addTransaction}
            >
              Add Transaction
            </Button>
          </Stack>
          <Stack w={600}>
            <Text style={{ borderBottom: "solid 2px gray" }}>History</Text>
            <Card shadow="xs" withBorder>
              <Text>Activity</Text>
              <NumberFormatter
                prefix="$ "
                value={1000.231231}
                thousandSeparator
              ></NumberFormatter>
              <Text>Currency</Text>
            </Card>
          </Stack>
        </SimpleGrid>
      </body>
      <Modal
        opened={opened}
        onClose={close}
        title="Expenditure"
        centered
      ></Modal>
    </>
  );
}

export default Billing;
