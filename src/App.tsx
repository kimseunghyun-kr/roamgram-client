import "@bitnoi.se/react-scheduler/dist/style.css";
import "@mantine/carousel/styles.css";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import { useJsApiLoader } from "@react-google-maps/api";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import LoginPage from "./components/Login/LoginPage.tsx";
import SchedulePageMap from "./components/schedulePage/SchedulePageMap.tsx";
import TravelPlans from "./components/travelPage/TravelPlans.tsx";
import MapPage from "./pages/MapPage.tsx";
import GoogleLogin from "./components/Login/GoogleLogin.tsx";
import HomePage from "./pages/HomePage.tsx";

//const myEventsList = [
//  { start: new Date(), end: new Date(), title: "special event" },
//];

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
        <Routes>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/login" element={<LoginPage />}></Route>
          <Route path="/travelPage" element={<TravelPlans />}></Route>
          <Route path="/schedulePage/:travelID" element={<SchedulePageMap />} />
          <Route path="/planner" element={<MapPage />}></Route>
          <Route path="/authSuccess" element={<GoogleLogin />}></Route>
        </Routes>
      </div>
    </>
  ) : (
    <></>
  );
}

export default App;
