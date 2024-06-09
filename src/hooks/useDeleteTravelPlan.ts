import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import getRequestOptions from './fetchAuth';

const useDeleteTravelPlan = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteTravelPlan = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/travelPlan/delete_travel_plan`, {
        method: 'DELETE',
        ...getRequestOptions(),
        body: JSON.stringify([id]),
      });

      if (!response.ok) {
        throw new Error('Failed to delete travel plan');
      }

      setLoading(false);
      // navigate('/travelPlans');
    } catch (error) {
      console.error('Error deleting travel plan:', error);
      setLoading(false);
      setError('Failed to delete travel plan');
    }
  }, [navigate]);

  return { deleteTravelPlan, loading, error };
};

export default useDeleteTravelPlan;
