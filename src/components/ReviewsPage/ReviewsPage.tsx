import React from "react";
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
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";

function ReviewsPage() {
  return (
    <>
      <header>
        <Header />
      </header>
      <body>
        <Grid mt={50} w={1800}>
          <Grid.Col span={2.5}>
            <Paper withBorder h={600} p="xl" radius="xl" ml={50} mr={50}>
              <Text>Filter Area</Text>
            </Paper>
          </Grid.Col>
          <Grid.Col span={9.5}>
            <Container display="flex" fluid>
              <TextInput
                size="lg"
                rightSection={<IconSearch />}
                radius="xl"
                w={350}
              ></TextInput>
              <Space w={700}></Space>
              <Group gap="xl">
                <SegmentedControl
                  radius="xl"
                  size="md"
                  data={["Latest", "Ascending", "Descending"]}
                  color="black"
                />
              </Group>
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
          </Grid.Col>
        </Grid>
      </body>
    </>
  );
}

export default ReviewsPage;
