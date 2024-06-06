import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import MapComponent from '../components/map/MapComponent';
import { useUpdateSchedule } from '../hooks';
import { Schedule } from '../types/Schedule';
import { Place } from '../types/Place';

const ModifyPlacePage: React.FC<{ schedule: Schedule }> = ({ schedule }) => {
  const { id } = useParams<{ id: string }>();
  const [place, setPlace] = useState<Place | null>(schedule.place);
  const updateSchedule = useUpdateSchedule();

  const handlePlaceChange = (place: Place) => {
    setPlace(place);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    schedule.place = place;
    // Recalculate travel times similar to CreateSchedule
    await updateSchedule.updateSchedule(schedule);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <h1>Map Page</h1>
        <MapComponent />
      </div>
      <button type="submit" className="btn btn-primary">Update Place</button>
    </form>
  );
};

export default ModifyPlacePage;
