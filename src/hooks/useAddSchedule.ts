import { ScheduleInsertRequest } from "../types/request/ScheduleInsertRequest";

const useAddSchedule = () => {
  const addSchedule = async (travelPlanId:string, scheduleInsertRequest: ScheduleInsertRequest) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/travelPlan/${travelPlanId}/schedule/create_schedule`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(scheduleInsertRequest)
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

export default useAddSchedule;
