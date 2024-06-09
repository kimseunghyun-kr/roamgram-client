import React from 'react';
import { Link } from 'react-router-dom';
import TravelPlanList from '../components/travelPlan/TravelPlanList';
import { useDeleteTravelPlan, useFetchAllTravelPlan } from '../hooks';


const HomePage: React.FC = () => {
  console.log("token fetchTravelPlan {},",localStorage.getItem('token'))
  const { travelPlans, loading, error } = useFetchAllTravelPlan();

  const {deleteTravelPlan} = useDeleteTravelPlan();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold my-4">Welcome to Travel Planner</h1>
      <Link to="/create-travel-plan" className="text-blue-500 hover:underline">
        Create New Travel Plan
      </Link>
      <h1 className="text-2xl font-bold my-4">Travel Diaries</h1>
      <TravelPlanList travelPlans={travelPlans!} onDelete={deleteTravelPlan} />
    </div>
  );
};

export default HomePage;
