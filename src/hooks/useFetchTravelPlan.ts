import { useState, useEffect, useCallback } from 'react';
import { TravelPlan } from '../types/TravelPlan';

const useFetchTravelPlan = (id: string) => {
  const [travelPlan, setTravelPlan] = useState<TravelPlan | null>(null);

  const fetchTravelPlan = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/travelPlan/get_by_id?planId=${id}`);
      const data: TravelPlan = await response.json();
      setTravelPlan(data);
    } catch (error) {
      console.error('Error fetching travel plan:', error);
    }
  }, [id]);

  useEffect(() => {
    fetchTravelPlan();
  }, [fetchTravelPlan]);

  return { travelPlan, refetch: fetchTravelPlan };
};

export default useFetchTravelPlan;
