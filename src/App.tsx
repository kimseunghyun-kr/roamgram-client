import { useState, useRef } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";

import "@mantine/core/styles.css";
import "@mantine/carousel/styles.css";
import "@mantine/dates/styles.css";
import "./App.css";
import "@bitnoi.se/react-scheduler/dist/style.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useJsApiLoader } from "@react-google-maps/api";
import TravelPage from "../pages/TravelPage.tsx";
import MyCalender from "../pages/MyCalender.tsx";
import moment from "moment";
import { Route, Routes } from "react-router-dom";
import HomePage from "../pages/HomePage.tsx";
import GoogleMaps from "./components/GoogleMaps/GoogleMaps.tsx";
import MapPage from "./pages/MapPage.tsx";
import GoogleTesting from "../pages/GoogleTesting.tsx";
import TravelPlans from "../pages/TravelPlans.tsx";
import WalletPage from "../pages/WalletPage.tsx";
import LoginPage from "../pages/LoginPage.tsx";
import CreatePage from "../pages/CreatePage.tsx";
import Login from "./components/Login.tsx";
import Header from "../pages/Header.tsx";
import SchedulePageMap from "../pages/SchedulePageMap.tsx";

//const myEventsList = [
//  { start: new Date(), end: new Date(), title: "special event" },
//];
const events111 = [
  {
    uuid: "33213",
    name: "2222222",
    description: "",
    place: {
      id: "test",
      googleMapsKeyId: "ChIJN1t_tDeuEmsRUsoyG83frY4",
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
        {/*
        <Routes>
          <Route path="/schedulePage" element={<SchedulePageMap />}></Route>
          <Route path="" element={<HomePage />}></Route>
          <Route path="/travelPage" element={<TravelPage />}></Route>
          <Route path="/maps" element={<MapPage />}></Route>
        </Routes>
  */}
        <header>
          <Header></Header>
        </header>
        <body>
          <SchedulePageMap></SchedulePageMap>
        </body>
      </div>
    </>
  ) : (
    <></>
  );
}

export default App;
