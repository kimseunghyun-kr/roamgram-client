// src/pages/HomePage.tsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import TravelPlanList from '../components/travelPlan/TravelPlanList';
import { useDeleteTravelPlan, useFetchAllTravelPlan } from '../hooks';
import { useAuthContext } from '../context/AuthContext';

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuthContext();
  const { travelPlans, loading, error, refetch } = useFetchAllTravelPlan(); // Assuming refetch is available
  const { deleteTravelPlan } = useDeleteTravelPlan(refetch);

  useEffect(() => {
    if (isAuthenticated) {
      refetch(); // Refetch travel plans if user is authenticated
    }
  }, [isAuthenticated, refetch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold my-4">Welcome to Travel Planner</h1>
      <Link to="/create-travel-plan" className="text-blue-500 hover:underline">Create New Travel Plan</Link>
      <h1 className="text-2xl font-bold my-4">Travel Diaries</h1>
      <TravelPlanList travelPlans={travelPlans!} onDelete={deleteTravelPlan} />
    </div>
  );
};

export default HomePage;
