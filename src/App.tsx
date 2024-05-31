import React , {Component} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/Homepage';
import TravelDiaryPage from './pages/TravelDiaryPage';
import SchedulePage from './pages/SchedulePage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" Component ={HomePage} />
        <Route path="/travelDiaries/:id" Component={TravelDiaryPage} />
        <Route path="/schedules/:id" Component={SchedulePage} />
      </Routes>
    </Router>
  );
};

export default App;
