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
    uuid: "33213",
    title: "2222222",
    description: "",
    place: {
      id: "test",
      googleMapsKeyId: "string",
      name: "string",
      country: "string",
      visitedCount: 0,
      Latitude: 0,
      Longitude: 0,
      longitude: 0,
      latitude: 0,
    },
    isActuallyVisited: false,
    travelStartTimeEstimate: moment("2024-06-16T10:00:00").toDate(),
    travelDepartTimeEstimate: moment("2024-06-16T11:00:00").toDate(),
    previousScheduleId: null,
    nextScheduleId: null,
  },
];

function App() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_NEXT_PUBLIC_GOOGLE_MAPS_API_KEY, //rmb to remove
    libraries: ["places", "maps", "core", "marker", "routes"],
    version: "weekly",
  });
  //remember to change this!

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
