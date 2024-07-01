import React from "react";
import Header from "../Header/Header.tsx";
import {
  Card,
  Container,
  Grid,
  Group,
  Paper,
  Space,
  TextInput,
  UnstyledButton,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";

function ReviewsPage() {
  return (
    <>
      <header>
        <Header />
      </header>
      <body>
        <Grid mt={50}>
          <Grid.Col span={2.5}>
            <Paper
              withBorder
              h={600}
              p="xl"
              radius="xl"
              ml={50}
              mr={50}
            ></Paper>
          </Grid.Col>
          <Grid.Col span={9}>
            <Container display="flex" fluid>
              <TextInput
                size="lg"
                rightSection={<IconSearch />}
                radius="xl"
                w={450}
              ></TextInput>
              <Space w={700}></Space>
              <Group gap="xl">
                <UnstyledButton>Filter1</UnstyledButton>
                <UnstyledButton>Filter2</UnstyledButton>
                <UnstyledButton>Filter3</UnstyledButton>
              </Group>
            </Container>
            <Group>
              <h1>pic1</h1>
              <h1>pic2</h1>
              <h1>pic3</h1>
              <h1>pic4</h1>
            </Group>
          </Grid.Col>
        </Grid>
      </body>
    </>
  );
}

export default ReviewsPage;
