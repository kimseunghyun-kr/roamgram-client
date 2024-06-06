import { useJsApiLoader } from "@react-google-maps/api";
import "./App.css";
<<<<<<< HEAD
import GoogleMaps from "./components/GoogleMaps/GoogleMaps.tsx";
import { Loader } from "@googlemaps/js-api-loader";
import {
  MantineProvider,
  AppShell,
  Container,
  Image,
  Group,
  Button,
  Flex,
  Switch,
  NativeSelect,
  Grid,
  Center,
} from "@mantine/core";
import "@mantine/core/styles.css";

function App() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_NEXT_PUBLIC_GOOGLE_MAPS_API_KEY, //rmb to remove
    libraries: ["places", "maps", "core", "marker", "routes"],
    version: "weekly",
  });
  return (
    <MantineProvider>
      <Flex>
        <Flex>
          <Image src="src\assets\RoamGram Logo.png" h={45} w="auto"></Image>
        </Flex>
        <Container>
          <Group gap="xs" grow>
            <div className="header-button">
              <Button variant="transparent" size="xl">
                Book
              </Button>
              <Button variant="transparent" size="xl">
                Planner
              </Button>
              <Button variant="transparent" size="xl">
                Route
              </Button>
            </div>
          </Group>
        </Container>
        <Center>
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
            ></NativeSelect>
          </Group>
        </Center>
      </Flex>
      <Grid>
        <GoogleMaps></GoogleMaps>
      </Grid>
    </MantineProvider>
  );
}
// {isLoaded ? <GoogleMaps></GoogleMaps> : <></>}
=======
import "bootstrap/dist/css/bootstrap.min.css";

import GoogleMapWrapper from "./components/google/GoogleMapWrapper.tsx";
import Header from "./components/Header/Header.tsx";
import Schedule from "./components/schedule/Schedule.tsx";
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/Homepage';
import TravelDiaryPage from './pages/TravelDiaryPage';
import SchedulePage from './pages/SchedulePage';
import CreateTravelPlanPage from './pages/CreateTravelPlanPage';
import NewSchedulePage from './pages/CreateSchedulePage';
import SelectPlacePage from './pages/SelectPlacePage';
import { APIProvider } from '@vis.gl/react-google-maps';
import ScheduleListPage from './pages/ScheduleListPage';

const App: React.FC = () => {
  return (
    <APIProvider apiKey={process.env.REACT_APP_GOOGLE_KEY} onLoad={() => console.log('Maps API has loaded.')}>
      <Header></Header>
      <Schedule></Schedule>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/travelPlans/:id" element={<TravelDiaryPage />} />
          <Route path="/create-travel-plan" element={<CreateTravelPlanPage />} />
          <Route path="/travel-diary/:id/new-schedule" element={<NewSchedulePage />} />
          <Route path="/travel-diary/schedules/:id" element={<SchedulePage />} />
          <Route path="/travel-diary/schedules" element={<ScheduleListPage />} /> {/* New route for schedule list */}
          <Route path="/places-map" element={<SelectPlacePage />} />
        </Routes>
      </Router>
    </APIProvider>
  );
};

>>>>>>> 6dc8f6275022a8156179de929e51c2971b2fd7cf
export default App;
