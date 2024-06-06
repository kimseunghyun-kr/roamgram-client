// src/App.tsx
import React, { Suspense } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import {
  MantineProvider,
  Center,
  Loader,
  Flex,
  Container,
  Group,
  Button,
  Image,
  Switch,
  NativeSelect,
} from "@mantine/core";
import HomePage from "./pages/Homepage";
import TravelDiaryPage from "./pages/TravelDiaryPage";
import SchedulePage from "./pages/SchedulePage";
import CreateTravelPlanPage from "./pages/CreateTravelPlanPage";
import NewSchedulePage from "./pages/CreateSchedulePage";
import SelectPlacePage from "./pages/SelectPlacePage";
import ScheduleListPage from "./pages/ScheduleListPage";
import MapPage from "./pages/MapPage";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <MantineProvider>
      <Router>
        <Flex justify="space-between" align="center" p="md">
          <Image src="src/assets/RoamGram Logo.png" h={45} w="auto" />
          <Container>
            <Group gap="xs">
              <Button variant="link" component={Link} to="/travelPlans">
                Home
              </Button>
              <Button variant="link" component={Link} to="/create-travel-plan">
                Create Plan
              </Button>
              <Button variant="link" component={Link} to="/places-map">
                Select Place
              </Button>
              <Button variant="link" component={Link} to="/map">
                Map
              </Button>
            </Group>
          </Container>
          <Group gap="xs">
            <Button>Login</Button>
            <Button>Register</Button>
            <Switch>Mode</Switch>
            <NativeSelect
              radius={1}
              data={["ENG", "CHI", "JPN", "KR"]}
              styles={{
                input: { color: "gray", border: "none", textAlign: "left" },
              }}
            />
          </Group>
        </Flex>
        <Suspense
          fallback={
            <Center>
              <Loader />
            </Center>
          }
        >
          <Routes>
            <Route path="/travelPlans" element={<HomePage />} />
            <Route path="/travelPlans/:id" element={<TravelDiaryPage />} />
            <Route
              path="/create-travel-plan"
              element={<CreateTravelPlanPage />}
            />
            <Route
              path="/travel-diary/:id/new-schedule"
              element={<NewSchedulePage />}
            />
            <Route
              path="/travel-diary/schedules/:id"
              element={<SchedulePage />}
            />
            <Route
              path="/travel-diary/schedules"
              element={<ScheduleListPage />}
            />
            <Route path="/places-map" element={<SelectPlacePage />} />
            <Route path="/map" element={<MapPage />} />
          </Routes>
        </Suspense>
      </Router>
    </MantineProvider>
  );
}

export default App;
