import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ScheduleInsertRequest } from '../types/request/ScheduleInsertRequest';
import { useAddSchedule, useFetchTravelPlan } from '../hooks';
import { Place } from '../types/Place';
import { format } from 'date-fns';
import { Link } from "react-router-dom";
const CreateSchedulePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const today = new Date()
  // Fetch travel plan and handle loading state within the custom hook
  const { travelPlan, refetch } = useFetchTravelPlan(id!);
  console.log("travel Plan at {} ", travelPlan)
  const fetchedDate = new Date(travelPlan?.travelStartDate!)
  const formattedDate = malformedDateCorrector(fetchedDate);
  console.log(formattedDate)
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

  useEffect(() => {
    refetch(); // Refetch data on location change
  }, [location, refetch]);

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
      <Link to="/map" className = "placeSelect" > select place </Link>
      <input type="date" name="travelDate" value={travelDate} onChange={handleInputChange} />
      <input type="time" name="travelStartTimeEstimate" value={travelStart} onChange={handleInputChange} />
      <input type="time" name="travelDepartTimeEstimate" value={travelEnd} onChange={handleInputChange} />
      <button type="submit" className="btn btn-primary">Add Schedule</button>
    </form>
  );

  function malformedDateCorrector(malformedDate : Date) {
    const [year, month, day] = malformedDate.toLocaleDateString().split('.')
    console.log(year, month, day)
  // Pad the month and day with leading zeros if needed
  // const paddedMonth = month.length === 1 ? '0' + month : month;
  // const paddedDay = day.length === 1 ? '0' + day : day;

  // Construct the new date string in 'yyyy-MM-dd' format
  // const newDateString = `${year}-${paddedMonth}-${paddedDay}`;
  // console.log(newDateString)

  return malformedDate;
  }
};

export default CreateSchedulePage;
