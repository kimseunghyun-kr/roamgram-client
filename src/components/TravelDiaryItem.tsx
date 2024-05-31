import React from 'react';
import { Link } from 'react-router-dom';
import { TravelDiary } from '../types/TravelDiary';

interface TravelDiaryItemProps {
  travelDiary: TravelDiary;
}

const TravelDiaryItem: React.FC<TravelDiaryItemProps> = ({ travelDiary }) => {
  return (
    <div className="p-4 border rounded shadow">
      <h2 className="text-xl font-bold">{travelDiary.name}</h2>
      <p>{travelDiary.travelStartDate} - {travelDiary.travelEndDate}</p>
      <Link to={`/travelDiaries/${travelDiary.id}`} className="text-blue-500 hover:underline">
        View Schedules
      </Link>
    </div>
  );
};

export default TravelDiaryItem;
