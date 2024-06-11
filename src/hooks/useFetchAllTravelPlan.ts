import { useState, useEffect, useCallback } from 'react';
import { TravelPlan } from '../types/TravelPlan';
import {getRequestOptions} from './fetchAuth';

const useFetchAllTravelPlan = () => {
  const [travelPlans, setTravelPlans] = useState<TravelPlan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllTravelPlans = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/travelPlan/get_all`, {
        method: 'GET',
        ...getRequestOptions(),
        credentials: 'include', // Include credentials
      });
      if (!response.ok) {
        throw new Error('Failed to fetch travel plans');
      }
      const data: TravelPlan[] = await response.json();
      setTravelPlans(data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllTravelPlans();
  }, [fetchAllTravelPlans]);

  return { travelPlans, refetch: fetchAllTravelPlans , loading, error };
};

export default useFetchAllTravelPlan;
