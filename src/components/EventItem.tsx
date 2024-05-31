import React from 'react';
import { Event } from '../types/Event';

interface EventItemProps {
  event: Event;
}

const EventItem: React.FC<EventItemProps> = ({ event }) => {
  return (
    <div className="p-4 border rounded shadow">
      <p>{new Date(event.eventStartTime).toLocaleString()} - {new Date(event.eventEndTime).toLocaleString()}</p>
      {/* Additional event details can be rendered here */}
    </div>
  );
};

export default EventItem;
