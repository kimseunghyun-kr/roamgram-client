import React from 'react';
import { Event } from '../types/Event';
import EventItem from './EventItem';

interface EventListProps {
  events: Event[];
}

const EventList: React.FC<EventListProps> = ({ events }) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {events.map(event => (
        <EventItem key={event.id} event={event} />
      ))}
    </div>
  );
};

export default EventList;
