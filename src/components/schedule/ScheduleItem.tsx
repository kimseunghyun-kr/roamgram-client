import React from 'react';
import { Link } from 'react-router-dom';
import { Schedule } from '../../types/Schedule';

interface ScheduleItemProps {
  schedule: Schedule;
}

const parseDate = (date: Date | [number, number, number, number, number]): Date => {
  if (date instanceof Date) {
    return date;
  } else if (Array.isArray(date)) {
    const [year, month, day, hour, minute] = date;
    return new Date(year, month - 1, day, hour, minute); // Month is zero-indexed in JavaScript Date
  }
  return new Date();
};

const ScheduleItem: React.FC<ScheduleItemProps> = ({ schedule }) => {
  const travelStart = parseDate(schedule.travelStartTimeEstimate);
  const travelEnd = parseDate(schedule.travelDepartTimeEstimate);

  return (
    <div className="p-4 border rounded shadow">
      <h2 className="text-xl font-bold">{schedule.place?.name ?? 'No place specified'}</h2>
      <div className="timeline-item">
        <h2>{schedule.place?.name ?? "someDefaultTravel"}</h2>
        <h3>Travel Date</h3>
        <p>{travelStart.toLocaleDateString()}</p>
        <h3>Travel Start Time</h3>
        <p>{travelStart.toLocaleTimeString()}</p>
        <h3>Travel Depart Time</h3>
        <p>{travelEnd.toLocaleTimeString()}</p>
      </div>
      <Link to={`/schedules/${schedule.id}`} className="text-blue-500 hover:underline">
        View Events
      </Link>
    </div>
  );
};

export default ScheduleItem;
