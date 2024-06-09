import { useState } from 'react';
import axios from 'axios';
import { Schedule } from '../types/Schedule';

const useUpdateSchedule = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getRequestOptions = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      }
    };
  };

  const updateSchedule = async (schedule: Schedule) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.put(`${import.meta.env.VITE_APP_API_URL}/schedules/${schedule.id}`, schedule, getRequestOptions());
      setLoading(false);
      return response.data;
    } catch (err : unknown) {
        if (err instanceof Error) {
            setLoading(false);
            setError(err);
            throw err;
        }
        return {
            message: `Things exploded (${err})`,
        };
    }
  };

  return { updateSchedule, loading, error };
};

export default useUpdateSchedule;
