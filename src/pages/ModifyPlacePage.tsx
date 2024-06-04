import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { useUpdateSchedule } from '../hooks';
import { Schedule } from '../types/Schedule';

const ModifyPlacePage: React.FC<{ schedule: Schedule }> = ({ schedule }) => {
  const { id } = useParams<{ id: string }>();
  const [place, setPlace] = useState(schedule.place);
  const updateSchedule = useUpdateSchedule();

  const handlePlaceChange = (place) => {
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
      <GooglePlacesAutocomplete
        selectProps={{
          value: place
          onChange: handlePlaceChange,
        }}
      />
      <button type="submit" className="btn btn-primary">Update Place</button>
    </form>
  );
};

export default ModifyPlacePage;
