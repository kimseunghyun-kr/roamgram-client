import { useState, useEffect } from 'react';
import { Schedule } from '../types/Schedule';

const useFetchDaySchedule = (travelPlanId: string, date: string) => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        console.log("this has been reached")
        const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/travelPlan/${travelPlanId}/schedule/search_schedule_by_day?date=${date}&pageNumber=0&pageSize=10`);
        if (!response.ok) {
          throw new Error('Failed to fetch schedules');
        }
        const data = await response.json();
        console.log(data)
        setSchedules(data.content); // Assuming the API returns a Page<Schedule> object
      } catch (error:unknown) {
        if(error instanceof Error){
          setError(error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    if (travelPlanId && date) {
      fetchSchedules();
    }
  }, [travelPlanId, date]);

  return { schedules, loading, error };
};

export default useFetchDaySchedule;
