import React from 'react';
import { Schedule } from '../../types/Schedule';

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
        const travelStart = convertToDate(schedule.travelStartTimeEstimate);
        const travelEnd = convertToDate(schedule.travelDepartTimeEstimate);

        return (
          <div key={schedule.id} className="timeline-item">
            <h2>{schedule.place?.name ?? "someDefaultTravel"}</h2>
            <h3>Travel Date</h3>
            <p>{travelStart.toLocaleDateString()}</p>
            <h3>Travel Start Time</h3>
            <p>{travelStart.toLocaleTimeString()}</p>
            <h3>Travel Depart Time</h3>
            <p>{travelEnd.toLocaleTimeString()}</p>
          </div>
        );
      })}
    </div>
  );
};

export default TimelineView;
