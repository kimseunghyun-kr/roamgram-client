import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/Homepage';
import TravelDiaryPage from './pages/TravelDiaryPage';
import SchedulePage from './pages/SchedulePage';
import CreateTravelPlanPage from './pages/CreateTravelPlanPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" Component ={HomePage} />
        <Route path="/travelPlans/:id" Component={TravelDiaryPage} />
        <Route path="/create-travel-plan" Component={CreateTravelPlanPage} />
        <Route path="/travelPlans/schedules/:id" Component={SchedulePage} />
      </Routes>
    </Router>
  );
};

export default App;
