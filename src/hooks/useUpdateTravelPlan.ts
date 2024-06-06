import { TravelPlanUpsertRequest } from '../types/request/TravelPlanUpsertRequest';

const useUpdateTravelPlan = () => {
  const updateTravelPlan = async (updatedTravelPlanData: TravelPlanUpsertRequest) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/travelPlan/modify_travel_plan`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTravelPlanData),
      });

      if (!response.ok) {
        throw new Error('Failed to update travel plan');
      }
      // Parse the response body as JSON
      const responseData = await response.json();
      console.log("Response:", responseData);
    } catch (error) {
      console.error('Error updating travel plan:', error);
    }
  };

  return updateTravelPlan;
};

export default useUpdateTravelPlan;
