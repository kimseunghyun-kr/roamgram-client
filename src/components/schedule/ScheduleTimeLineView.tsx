import React from 'react';
import { Schedule } from '../../types/Schedule';
import ScheduleItem from './ScheduleItem';

const TimelineView: React.FC<{ schedules: Schedule[] }> = ({ schedules }) => {
  const convertToDate = (dateInput: Date | [number, number, number, number, number]) => {
    if (Array.isArray(dateInput)) {
      return new Date(dateInput[0], dateInput[1] - 1, dateInput[2], dateInput[3], dateInput[4]);
    }
    return new Date(dateInput);
  };

  const sortedSchedules = [...schedules].sort((a, b) => {
    const dateA = convertToDate(a.travelStartTimeEstimate);
    const dateB = convertToDate(b.travelStartTimeEstimate);
    return dateA.getTime() - dateB.getTime();
  });

  return (
    <div className="timeline-container">
      {sortedSchedules.map(schedule => {
        return (
          <div key={schedule.id} className="timeline-item">
            <ScheduleItem schedule={schedule} />
          </div>
        );
      })}
    </div>
  );
};

export default TimelineView;
