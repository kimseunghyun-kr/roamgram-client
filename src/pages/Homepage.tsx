import React, { useEffect, useState, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import TravelPlanList from '../components/travelPlan/TravelPlanList';
import { TravelPlan } from '../types/TravelPlan';

const HomePage: React.FC = () => {
  const [travelPlans, setTravelPlans] = useState<TravelPlan[]>([]);
  const location = useLocation();

  const fetchTravelPlans = useCallback(async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/travelPlan/get_all`);
      const data = await response.json();
      setTravelPlans(data);
    } catch (error) {
      console.error('Error fetching travel diaries:', error);
    }
  }, []); // Empty dependency array ensures this function is created once

  useEffect(() => {
    fetchTravelPlans();
  }, [fetchTravelPlans]); // Fetch travel plans on component mount

  useEffect(() => {
    fetchTravelPlans(); // Fetch travel plans on component mount and location change
  }, [fetchTravelPlans, location]);

  const deleteTravelPlan = async (id: string) => {
    try {
      console.log("id for delete is {}", id)
      await fetch(`${import.meta.env.VITE_APP_API_URL}/travelPlan/delete_travel_plan`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([id]),
      });
      // Update state to remove the deleted travel plan
      setTravelPlans(prevPlans => prevPlans.filter(plan => plan.id !== id));
    } catch (error) {
      console.error('Error deleting travel plan:', error);
    }
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold my-4">Welcome to Travel Planner</h1>
      <Link to="/create-travel-plan" className="text-blue-500 hover:underline">
        Create New Travel Plan
      </Link>
      <h1 className="text-2xl font-bold my-4">Travel Diaries</h1>
      <TravelPlanList travelPlans={travelPlans} onDelete={deleteTravelPlan} />
    </div>
  );
};

export default HomePage;