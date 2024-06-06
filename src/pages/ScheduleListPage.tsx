import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DropResult } from 'react-beautiful-dnd';
import { useFetchDaySchedule, useDeleteSchedule } from '../hooks';
import ScheduleList from '../components/schedule/ScheduleList';
import { Schedule } from '../types/Schedule';

const ScheduleListPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const selectedDate = searchParams.get('date');
  const travelPlanId = searchParams.get('travelPlanId');
  
  console.log(travelPlanId +  " + " + selectedDate)
  const { schedules: fetchedSchedules, loading, error } = useFetchDaySchedule(travelPlanId!, selectedDate!);
  const deleteSchedule = useDeleteSchedule();

  const [schedules, setSchedules] = useState<Schedule[]>([]);

  useEffect(() => {
    setSchedules(fetchedSchedules);
  }, [fetchedSchedules]);

  const handleDeleteSchedule = async (scheduleId: string) => {
    try {
      await deleteSchedule(travelPlanId!, scheduleId);
      setSchedules(prevSchedules => prevSchedules.filter(schedule => schedule.id !== scheduleId));
    } catch (error) {
      console.error('Error deleting schedule:', error);
    }
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const newScheduleList = Array.from(schedules);
    const [movedSchedule] = newScheduleList.splice(result.source.index, 1);
    newScheduleList.splice(result.destination.index, 0, movedSchedule);

    setSchedules(newScheduleList);
    // Add logic to update the order in the backend when the endpoint is ready
  };

  const handleBackToMain = () => {
    navigate('/');
  };

  const handleBackToCalendar = () => {
    navigate(-1); // This will go back to the previous page
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <div className="buttons">
        <button onClick={handleBackToMain} className="btn btn-secondary">Back to Main Navigation</button>
        <button onClick={handleBackToCalendar} className="btn btn-secondary">Back to Calendar</button>
      </div>
      <ScheduleList
        schedules={schedules}
        onDeleteSchedule={handleDeleteSchedule}
        onDragEnd={handleDragEnd}
      />
    </div>
  );
};

export default ScheduleListPage;
