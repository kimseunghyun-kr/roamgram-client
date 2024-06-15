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
import MyCalender from "../pages/MyCalender.tsx";
import moment from "moment";

//const myEventsList = [
//  { start: new Date(), end: new Date(), title: "special event" },
//];
const events111 = [
  {
    id: "1",
    start: moment("2024-06-11T10:00:00").toDate(),
    end: moment("2024-06-11T11:00:00").toDate(),
    title: "Alex-Testing",
    description: "test1",
  },
  {
    id: "2",
    start: moment("2024-06-11T12:00:00").toDate(),
    end: moment("2024-06-11T13:00:00").toDate(),
    title: "Alex-Testing-2-check-overlap",
    description: "test2",
  },
];

function App() {
  //remember to change this!
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_NEXT_PUBLIC_GOOGLE_MAPS_API_KEY, //rmb to remove
    libraries: ["places", "maps", "core", "marker", "routes"],
    version: "weekly",
  });

  return isLoaded ? (
    <>
      <div>
        <SchedulePageMap eventsList={events111}></SchedulePageMap>
      </div>
    </>
  ) : (
    <></>
  );
}

export default App;
