import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ScheduleInsertRequest } from '../types/request/ScheduleInsertRequest';
import { useAddSchedule } from '../hooks';
import { Place } from '../types/Place';
import { format } from 'date-fns';

const CreateSchedulePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const today = new Date()
  const [travelDate, setTravelDate] = useState<string>(format(today, 'yyyy-MM-dd'));
  const [travelStart, setTravelStart] = useState<string>('');
  const [travelEnd, setTravelEnd] = useState<string>('');

  const [newSchedule, setNewSchedule] = useState<ScheduleInsertRequest>({
    place: null,
    previousScheduleId: '',
    isActuallyVisited: false,
    travelStartTimeEstimate: new Date(),
    travelDepartTimeEstimate: new Date(),
  });
  const [place, setPlace] = useState<Place | null>(null);
  const addSchedule = useAddSchedule();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'travelDate') {
      setTravelDate(value);
      setNewSchedule(prevState => ({
        ...prevState,
        travelStartTimeEstimate: new Date(`${value}T${travelStart}`),
        travelDepartTimeEstimate: new Date(`${value}T${travelEnd}`),
      }));
    } else if (name === 'travelStartTimeEstimate') {
      setTravelStart(value);
      const k = new Date(`${travelDate}T${value}`)
      console.log("ISO string time at {}" ,new Date(k))
      console.log("travel start estimated time at {}", value)
      setNewSchedule(prevState => ({
        ...prevState,
        travelStartTimeEstimate: new Date(`${travelDate}T${value}Z`),
      }));
    } else if (name === 'travelDepartTimeEstimate') {
      setTravelEnd(value);
      console.log("travel start estimated time at {}", value)
      setNewSchedule(prevState => ({
        ...prevState,
        travelDepartTimeEstimate: new Date(`${travelDate}T${value}Z`),
      }));
    }
  };

  const handlePlaceChange = (place: Place) => {
    setPlace(place);
    setNewSchedule(prevState => ({ ...prevState, place: place }));
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
      <input type="date" name="travelDate" value={travelDate} onChange={handleInputChange} />
      <input type="time" name="travelStartTimeEstimate" value={travelStart} onChange={handleInputChange} />
      <input type="time" name="travelDepartTimeEstimate" value={travelEnd} onChange={handleInputChange} />
      <button type="submit" className="btn btn-primary">Add Schedule</button>
    </form>
  );
};

export default CreateSchedulePage;
