import React from 'react';
import { TravelPlan } from '../types/TravelPlan';
import TravelPlanItem from './TravelPlanItem';

interface TravelPlanListProps {
  travelPlans: TravelPlan[];
  onDelete: (id: string) => void;
}


const TravelPlanList: React.FC<TravelPlanListProps> = ({ travelPlans, onDelete }) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {travelPlans.map(travelPlan => (
        <TravelPlanItem key={travelPlan.id} travelPlan={travelPlan} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default TravelPlanList;
