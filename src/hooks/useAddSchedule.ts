import { Schedule } from '../types/Schedule';

// Custom hook for adding a schedule
const useAddSchedule = () => {
  const addSchedule = async (planId: string, newSchedule: Schedule) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/travelPlan/add_schedule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planId, schedule: newSchedule }),
      });
      const addedSchedule = await response.json();
      return addedSchedule;
    } catch (error) {
      console.error('Error adding schedule:', error);
      throw error; // Rethrow the error to be handled by the caller
    }
  };

  return addSchedule;
};

export default useAddSchedule
