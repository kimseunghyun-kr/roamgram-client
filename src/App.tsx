import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import GoogleMapWrapper from "./components/google/GoogleMapWrapper.tsx";
import Header from "./components/Header/Header.tsx";
import Home from "./components/Home/Home.tsx";
import Schedule from "./components/Schedule/Schedule.tsx";
import Place from "./components/Place/Place.tsx";
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

export default App;
