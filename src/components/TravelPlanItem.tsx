import React from 'react';
import { Link } from 'react-router-dom';
import { TravelPlan } from '../types/TravelPlan';

interface TravelPlanItemProps {
  travelPlan: TravelPlan;
  onDelete: (id: string) => void;
}

const TravelPlanItem: React.FC<TravelPlanItemProps> = ({ travelPlan, onDelete }) => {
  const handleDelete = () => {
    onDelete(travelPlan.id);
  };

  return (
    <div className="p-4 border rounded shadow">
      <h2 className="text-xl font-bold">{travelPlan.name}</h2>
      <p>{travelPlan.travelStartDate} - {travelPlan.travelEndDate}</p>
      <button onClick={handleDelete} className="text-red-500 hover:underline">
        Delete
      </button>
      <Link to={`/travelPlans/${travelPlan.id}`} className="text-blue-500 hover:underline ml-2">
        Details
      </Link>
    </div>
  );
}

export default TravelPlanItem;
