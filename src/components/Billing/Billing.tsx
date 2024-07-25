import React, { useRef, useState } from "react";
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
  Space,
  Stack,
  Text,
} from "@mantine/core";
import { IconCurrencyDollar, IconMinus, IconPlus } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";

function Billing() {
  const url = window.location.search;
  const urlParams = new URLSearchParams(url);
  const travelID = urlParams.get("id");

  const [data, setData] = useState([
    { name: "Food and Dining", value: 400, color: "indigo.6" },
    { name: "Transportation", value: 300, color: "yellow.6" },
    { name: "Japan", value: 100, color: "teal.6" },
    { name: "Other", value: 200, color: "gray.6" },
  ]);

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

  const amountRef = useRef(null);
  const typeRef = useRef(null);

  return (
    <>
      <header>
        <Header />
      </header>
      <body>
        <SimpleGrid cols={2} mt={40}>
          <Stack align="center">
            <Group gap="lg">
              <DonutChart
                data={data}
                tooltipDataSource="segment"
                size={350}
                thickness={55}
                chartLabel="Income Left Here"
              />
            </Group>
            {/* <Divider w={300} /> */}
            <Stack mt={15}>
              <Text
                pr={60}
                c="blue"
                size="sm"
                fw="bold"
                style={{ borderBottom: "1px solid gray" }}
              >
                Total Income
              </Text>
              <Text size="sm" c="gray">
                $$
              </Text>
              <Text
                size="sm"
                c="blue"
                fw="bold"
                style={{ borderBottom: "1px solid gray" }}
              >
                Total Expenditure
              </Text>
              <Text size="sm" c="gray">
                $$
              </Text>
            </Stack>
            {/* <Divider w={300} /> */}
            <Space h={10} />
          </Stack>
          <Stack w={600}>
            <Text
              style={{
                borderBottom: "solid 2px gray",
                fontSize: "30px",
                fontFamily: "Monsteratt",
              }}
            >
              History
            </Text>
            <Card shadow="xs" withBorder>
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
