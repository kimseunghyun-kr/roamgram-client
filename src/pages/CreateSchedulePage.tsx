import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ScheduleInsertRequest } from '../types/request/ScheduleInsertRequest';
import { useAddSchedule } from '../hooks';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { Place } from '../types/Place';

const CreateSchedulePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [newSchedule, setNewSchedule] = useState<ScheduleInsertRequest>({
    place: null,
    previousScheduleId: '',
    isActuallyVisited: false,
    travelDate: new Date(),
    travelStartTimeEstimate: new Date(),
    travelDepartTimeEstimate: new Date(),
  });
  const [place, setPlace] = useState<Place | null>(null);
  const addSchedule = useAddSchedule();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewSchedule(prevState => ({ ...prevState, [name]: value }));
  };

  const handlePlaceChange = (place: Place) => { //this needs to be the google maps place -> connect to API here
    setPlace(place);
    setNewSchedule(prevState => ({ ...prevState, place: place.value}));
  };

  const calculateTimes = async () => {
    // Use Google Maps API to calculate travel times and set start and end times
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await calculateTimes();
    try {
      await addSchedule(id!, newSchedule);
      navigate(`/travelPlans/${id}`);
    } catch (error) {
      console.error('Error adding schedule:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <GooglePlacesAutocomplete
        selectProps={{
          place,
          onChange: handlePlaceChange,
        }}
      />
      <input type="date" name="travelDate" value={newSchedule.travelDate.toISOString().split('T')[0]} onChange={handleInputChange} />
      <input type="time" name="travelStartTimeEstimate" value={newSchedule.travelStartTimeEstimate.toISOString().split('T')[1]} onChange={handleInputChange} />
      <input type="time" name="travelDepartTimeEstimate" value={newSchedule.travelDepartTimeEstimate.toISOString().split('T')[1]} onChange={handleInputChange} />
      <button type="submit" className="btn btn-primary">Add Schedule</button>
    </form>
  );
};

export default CreateSchedulePage;
