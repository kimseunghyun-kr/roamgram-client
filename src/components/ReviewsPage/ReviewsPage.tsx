import React, { useEffect, useRef } from "react";
import Header from "../Header/Header.tsx";
import {
  Card,
  CardSection,
  Container,
  Grid,
  Group,
  Paper,
  SegmentedControl,
  Space,
  TextInput,
  UnstyledButton,
  Image,
  Divider,
  Text,
  Rating,
  Title,
  Button,
  Pagination,
} from "@mantine/core";
import { IconPencil, IconSearch } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";

function ReviewsPage() {
  const searchRef = useRef(null);
  return (
    <>
      <header>
        <Header />
      </header>
      <body>
        <Button onClick={() => console.log(searchRef.current.value)}>
          Test
        </Button>
        <Grid mt={50} w={1800}>
          <Grid.Col span={2.5}>
            <Paper withBorder h={600} p="xl" radius="xl" ml={50} mr={50}>
              <Text>Filter Area</Text>
            </Paper>
          </Grid.Col>
          <Grid.Col span={9.5}>
            <Container display="flex" fluid>
              <TextInput
                ref={searchRef}
                size="lg"
                rightSection={<IconSearch />}
                radius="xl"
                w={350}
              ></TextInput>
              <Space w={700}></Space>
              <Button color="red" leftSection={<IconPencil />}>
                Write a Review
              </Button>
            </Container>
            <Group mt={50} gap="md">
              <Card withBorder>
                <Image
                  h={200}
                  src="https://placehold.co/600x400?text=Placeholder"
                />
                <Divider />
                <Rating readOnly />
                <Title> Review Title</Title>
                <p>Review Body</p>
                <p>Reviewer Name</p>
                <p>Date</p>
              </Card>
              <Card withBorder>
                <Image
                  h={200}
                  src="https://placehold.co/600x400?text=Placeholder"
                />
                <Divider />
                <Rating readOnly />
                <Title> Review Title</Title>
                <p>Review Body</p>
                <p>Reviewer Name</p>
                <p>Date</p>
              </Card>
              <Card withBorder>
                <Image
                  h={200}
                  src="https://placehold.co/600x400?text=Placeholder"
                />
                <Divider />
                <Rating readOnly />
                <Title> Review Title</Title>
                <p>Review Body</p>
                <p>Reviewer Name</p>
                <p>Date</p>
              </Card>
              <Card withBorder>
                <Image
                  h={200}
                  src="https://placehold.co/600x400?text=Placeholder"
                />
                <Divider />
                <Rating readOnly />
                <Title> Review Title</Title>
                <p>Review Body</p>
                <p>Reviewer Name</p>
                <p>Date</p>
              </Card>
            </Group>
            <Pagination total={10}></Pagination>
          </Grid.Col>
        </Grid>
      </body>
    </>
  );
}

export default ReviewsPage;
