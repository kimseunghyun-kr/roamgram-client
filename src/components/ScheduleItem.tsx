import React from 'react';
import { Link } from 'react-router-dom';
import { Schedule } from '../types/Schedule';

interface ScheduleItemProps {
  schedule: Schedule;
}

const ScheduleItem: React.FC<ScheduleItemProps> = ({ schedule }) => {
  return (
    <div className="p-4 border rounded shadow">
      <h2 className="text-xl font-bold">{schedule.place.name}</h2>
      <p>{schedule.travelDate}</p>
      <Link to={`/schedules/${schedule.id}`} className="text-blue-500 hover:underline">
        View Events
      </Link>
    </div>
  );
};

export default ScheduleItem;
