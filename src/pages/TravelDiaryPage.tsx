import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import ModalForm from '../components/travelPlan/UpdateTravelPlanModal';
import { useFetchTravelPlan, useUpdateTravelPlan, useDeleteSchedule, useConvertToDate, useDeleteTravelPlan } from '../hooks';
import { TravelPlanUpsertRequest } from '../types/request/TravelPlanUpsertRequest';
import { Schedule } from '../types/Schedule';
import TimetableView from '../components/schedule/ScheduleTimeTableView';
import ScheduleList from '../components/schedule/ScheduleList';
import { DropResult } from 'react-beautiful-dnd';
import CalendarView from '../components/schedule/CalendarView';
import { format } from 'date-fns';

const TravelDiaryPage: React.FC = () => {
  const { id = '' } = useParams<{ id: string }>();
  const location = useLocation();
  const { travelPlan, refetch } = useFetchTravelPlan(id);
  const updateTravelPlan = useUpdateTravelPlan();
  const deleteSchedule = useDeleteSchedule();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [viewMode, setViewMode] = useState<'calendar' | 'timetable' | 'list'>('calendar');
  const { convertToDate } = useConvertToDate();
  const {deleteTravelPlan} = useDeleteTravelPlan();

  useEffect(() => {
    if (travelPlan) {
      setSchedules(travelPlan.scheduleList);
    }
  }, [travelPlan]);

  useEffect(() => {
    refetch(); // Refetch data on location change
  }, [location.pathname, refetch]);

  if (!travelPlan) {
    return <div>Loading...</div>;
  }

  const handleDeleteSchedule = async (scheduleId: string) => {
    try {
      await deleteSchedule(id, scheduleId);
      refetch();
    } catch (error) {
      console.error('Error deleting schedule:', error);
    }
  };

  const handleUpdateOnClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleModalSubmit = async (updatedTravelPlanData: TravelPlanUpsertRequest) => {
    await updateTravelPlan(updatedTravelPlanData);
    setIsModalOpen(false);
    refetch();
  };

  const recalculateTimesAndCheckConflicts = (schedules: Schedule[]) => {
    let hasConflict = false;

    for (let i = 1; i < schedules.length; i++) {
      const prevSchedule = schedules[i - 1];
      const currentSchedule = schedules[i];
      const prevEnd = convertToDate(prevSchedule.travelDepartTimeEstimate);
      const currentStart = convertToDate(currentSchedule.travelStartTimeEstimate);

      // Calculate estimated start time of current schedule
      const estimatedStartTime = new Date(prevEnd.getTime() + prevSchedule.inwardRoute.durationOfTravel * 60000); // Assuming durationOfTravel is in minutes

      // If the estimated start time is after the current start time, there's a conflict
      if (estimatedStartTime > currentStart) {
        currentSchedule.conflict = true;
        hasConflict = true;
      } else {
        currentSchedule.conflict = false;
      }
    }

    return hasConflict;
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const newScheduleList = Array.from(schedules);
    const [removed] = newScheduleList.splice(result.source.index, 1);
    newScheduleList.splice(result.destination.index, 0, removed);

    setSchedules(newScheduleList);
    recalculateTimesAndCheckConflicts(newScheduleList);
  };

  const searchParams = new URLSearchParams(location.search);
  const selectedDate = searchParams.get('date');
  const filteredSchedules = selectedDate
    ? schedules.filter((schedule) => {
        const scheduleDate = format(convertToDate(schedule.travelStartTimeEstimate), 'yyyy-MM-dd');
        return scheduleDate === selectedDate;
      })
    : schedules;

  return (
    <div className="container mx-auto">
      {!isModalOpen && (
        <div className="container mx-auto">
          <button onClick={() => deleteTravelPlan(id)} className="btn btn-danger">Delete Travel Plan</button>
          <button onClick={handleUpdateOnClick} className="btn btn-primary">Update Travel Plan</button>
          <button onClick={() => setViewMode('calendar')} className="btn btn-secondary">Calendar View</button>
          <button onClick={() => setViewMode('timetable')} className="btn btn-secondary">Timetable View</button>
          <button onClick={() => setViewMode('list')} className="btn btn-secondary">List View</button>
          <h1 className="text-2xl font-bold my-4">{travelPlan.name}</h1>
          <p><strong>Start Date:</strong> {new Date(travelPlan.travelStartDate).toLocaleDateString()}</p>
          <p><strong>End Date:</strong> {new Date(travelPlan.travelEndDate).toLocaleDateString()}</p>
          <Link to={`/travel-diary/${id}/new-schedule`} className="btn btn-primary">Add Schedule</Link>
          <h2 className="text-xl font-semibold my-4">Schedules</h2>
          {viewMode === 'timetable' && <TimetableView schedules={schedules} onDragEnd={onDragEnd} onDeleteSchedule={handleDeleteSchedule} />}
          {viewMode === 'calendar' && <CalendarView initialTravelPlan = {travelPlan} initialSchedules={schedules} onDragEnd={onDragEnd} onDeleteSchedule={handleDeleteSchedule} />}
          {viewMode === 'list' && <ScheduleList schedules={filteredSchedules} onDeleteSchedule={handleDeleteSchedule} onDragEnd={onDragEnd} />}
        </div>
      )}
      {isModalOpen && (
        <ModalForm
          travelPlan={travelPlan}
          handleModalSubmit={handleModalSubmit}
          handleCloseModal={handleCloseModal}
        />
      )}
    </div>
  );
};

export default TravelDiaryPage;
