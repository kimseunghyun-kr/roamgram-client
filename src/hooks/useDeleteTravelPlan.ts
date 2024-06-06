import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const useDeleteTravelPlan = () => {
  const navigate = useNavigate();

  const deleteTravelPlan = useCallback(async (id: string) => {
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/travelPlan/delete_travel_plan`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([id]),
      });
      navigate('/');
    } catch (error) {
      console.error('Error deleting travel plan:', error);
    }
  }, [navigate]);

  return deleteTravelPlan;
};

export default useDeleteTravelPlan;
