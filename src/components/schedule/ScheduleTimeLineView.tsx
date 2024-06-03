import React from 'react';
import { Schedule } from '../../types/Schedule';

const TimelineView: React.FC<{ schedules: Schedule[] }> = ({ schedules }) => {
  return (
    <div className="timeline-container">
      {schedules.map(schedule => (
        <div key={schedule.id} className="timeline-item">
          <h2>{schedule.place!.name}</h2>
          <p>{schedule.travelDate.toDateString()}</p>
        </div>
      ))}
    </div>
  );
};

export default TimelineView;
