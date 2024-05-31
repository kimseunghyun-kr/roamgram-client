import React from 'react';
import { Schedule } from '../types/Schedule';
import ScheduleItem from './ScheduleItem';

interface ScheduleListProps {
  schedules: Schedule[];
}

const ScheduleList: React.FC<ScheduleListProps> = ({ schedules }) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {schedules.map(schedule => (
        <ScheduleItem key={schedule.id} schedule={schedule} />
      ))}
    </div>
  );
};

export default ScheduleList;
