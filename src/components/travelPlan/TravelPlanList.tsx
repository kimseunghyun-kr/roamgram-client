import React, { useCallback, useEffect, useState } from 'react';
import { TravelPlan } from '../../types/TravelPlan';
import TravelPlanItem from './TravelPlanItem';

interface TravelPlanListProps {
  travelPlans: TravelPlan[];
  onDelete: (id: string) => void;
}


const TravelPlanList: React.FC<TravelPlanListProps> = ({ travelPlans, onDelete }) => {
  const [updatedTravelPlans, setUpdatedTravelPlans] = useState<TravelPlan[]>(travelPlans);

  useEffect(() => {
    setUpdatedTravelPlans(travelPlans);
  }, [travelPlans]);

  const handleDelete = useCallback((id: string) => {
    onDelete(id);
    setUpdatedTravelPlans(prevTravelPlans => prevTravelPlans.filter(plan => plan.id !== id));
  }, [onDelete]);

  return (
    <div className="grid grid-cols-1 gap-4">
      {travelPlans.map(travelPlan => (
        <TravelPlanItem key={travelPlan.id} travelPlan={travelPlan} onDelete={() => handleDelete(travelPlan.id)} />
      ))}
    </div>
  );
};

export default TravelPlanList;
