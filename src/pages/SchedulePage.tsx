import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import EventList from '../components/EventList';
import PlaceDetails from '../components/PlaceDetails';
import ReviewDetails from '../components/ReviewDetails';
import { Event } from '../types/Event';
import { Place } from '../types/Place';
import { Review } from '../types/Review';

const SchedulePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [events, setEvents] = useState<Event[]>([]);
  const [place, setPlace] = useState<Place | null>(null);
  const [review, setReview] = useState<Review | null>(null);

  useEffect(() => {
    fetch(`/api/schedules/${id}/events`) // REST URI: GET /api/schedules/{id}/events
      .then(response => response.json())
      .then(data => setEvents(data))
      .catch(error => console.error('Error fetching events:', error));
      
    fetch(`/api/schedules/${id}/place`) // REST URI: GET /api/schedules/{id}/place
      .then(response => response.json())
      .then(data => setPlace(data))
      .catch(error => console.error('Error fetching place:', error));

    fetch(`/api/schedules/${id}/review`) // REST URI: GET /api/schedules/{id}/review
      .then(response => response.json())
      .then(data => setReview(data))
      .catch(error => console.error('Error fetching review:', error));
  }, [id]);

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold my-4">Events</h1>
      <EventList events={events} />
      {place && <PlaceDetails place={place} />}
      {review && <ReviewDetails review={review} />}
    </div>
  );
};

export default SchedulePage;
