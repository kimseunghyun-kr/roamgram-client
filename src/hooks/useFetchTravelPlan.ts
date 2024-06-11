import { useState, useEffect, useCallback } from 'react';
import { TravelPlan } from '../types/TravelPlan';
import {getRequestOptions} from './fetchAuth';

const useFetchTravelPlan = (planId: string) => {
  const [travelPlan, setTravelPlan] = useState<TravelPlan | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  console.log("token fetchTravelPlan {},",localStorage.getItem('token'))
  const fetchTravelPlan = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/travelPlan/get_by_id?planId=${planId}`, {
        method: 'GET',
        ...getRequestOptions(),
        credentials: 'include', // Include credentials
      });
      if (!response.ok) {
        throw new Error('Failed to fetch travel plan');
      }
      const data: TravelPlan = await response.json();
      setTravelPlan(data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  }, [planId]);

  useEffect(() => {
    fetchTravelPlan();
  }, [fetchTravelPlan]);

  return { travelPlan, refetch: fetchTravelPlan, loading, error };
};

export default useFetchTravelPlan;
