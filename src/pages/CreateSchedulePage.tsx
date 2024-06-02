import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {Schedule} from '../types/Schedule'

const NewSchedulePage: React.FC<{ onAddSchedule: (newSchedule: Schedule) => void, travelOrder: number }> = ({ onAddSchedule, travelOrder }) => {
  const [scheduleName, setScheduleName] = useState<string>('');
  const [isActuallyVisited, setIsActuallyVisited] = useState<boolean>(false);
  const [travelDate, setTravelDate] = useState<string>('');
  const [orderOfTravel, setOrderOfTravel] = useState<number>(travelOrder); 
  const [travelStartTimeEstimate, setTravelStartTimeEstimate] = useState(''); 
  const [travelDepartTimeEstimate, setTravelDepartTimeEstimate] = useState(''); 
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSchedule: Schedule = {
      name: scheduleName,
      isActuallyVisited: isActuallyVisited,
      travelDate: travelDate,
      travelStartTimeEstimate: travelStartTimeEstimate,
      travelDepartTimeEstimate: travelDepartTimeEstimate,
      // Add other necessary properties
    };
    onAddSchedule(newSchedule);
    navigate('/travelPlans/:id'); // Redirect back to the main page after adding schedule
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold my-4">Create New Schedule</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Schedule Name:</label>
          <input type="text" value={scheduleName} onChange={e => setScheduleName(e.target.value)} className="form-control" required />
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default NewSchedulePage;
