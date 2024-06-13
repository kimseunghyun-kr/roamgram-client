import { useState, useRef } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";

import "@mantine/core/styles.css";
import "@mantine/carousel/styles.css";
import "@mantine/dates/styles.css";
import "./App.css";
import "@bitnoi.se/react-scheduler/dist/style.css";
import HomePage from "../pages/HomePage.tsx";
import SchedulePage from "../pages/SchedulePage.tsx";
import "react-big-calendar/lib/css/react-big-calendar.css";
import SchedulePageMap from "../pages/SchedulePageMap.tsx";
import { useJsApiLoader } from "@react-google-maps/api";
import CreateSchedule from "../pages/CreateSchedule.tsx";
import TravelPage from "../pages/TravelPage.tsx";

//const myEventsList = [
//  { start: new Date(), end: new Date(), title: "special event" },
//];

function App() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_NEXT_PUBLIC_GOOGLE_MAPS_API_KEY, //rmb to remove
    libraries: ["places", "maps", "core", "marker", "routes"],
    version: "weekly",
  });
  return isLoaded ? (
    <>
      <div>
        <TravelPage></TravelPage>
      </div>
    </>
  ) : (
    <></>
  );
}

export default App;
