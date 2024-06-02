import React from 'react';
import { Schedule } from '../types/Schedule';
import ScheduleItem from './ScheduleItem';

interface ScheduleListProps {
  schedules: Schedule[];
  onAddSchedule: (schedule: Schedule) => void;
  onDeleteSchedule: (scheduleId: string) => void;
}


const ScheduleList: React.FC<ScheduleListProps> = ({ schedules, onAddSchedule, onDeleteSchedule }) => {
  const handleAddSchedule = () => {
    const newSchedule: Schedule = {
      id: 'new-id', // Generate a unique ID or let the backend handle it
      name: 'New Schedule',
      // Add other necessary properties
    };
    onAddSchedule(newSchedule);
  };

  const handleDeleteSchedule = (scheduleId: string) => {
    onDeleteSchedule(scheduleId);
  };

  return (
    <div>
      <button onClick={handleAddSchedule} className="btn btn-primary">Add Schedule</button>
      <ul>
        {schedules.map(schedule => (
          <li key={schedule.id}>
            <ScheduleItem key={schedule.id} schedule={schedule} />
            <button onClick={() => handleDeleteSchedule(schedule.id)} className="btn btn-danger">Delete</button>
          </li>
        ))}
      </ul>
    </div>

  );
};

export default ScheduleList;
