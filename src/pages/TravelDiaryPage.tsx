import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ModalForm from '../components/UpdateTravelPlanModal';
import { useFetchTravelPlan, useUpdateTravelPlan, useDeleteSchedule } from '../hooks';
import { TravelPlanUpsertRequest } from '../types/request/TravelPlanUpsertRequest';
import { Link } from 'react-router-dom';
import { Schedule } from '../types/Schedule';
import TimelineView from '../components/schedule/ScheduleTimeLineView';
import TimetableView from '../components/schedule/ScheduleTimeTableView';
import ScheduleList from '../components/schedule/ScheduleList';

const TravelDiaryPage: React.FC = () => {
  const { id = '' } = useParams<{ id: string }>();
  const { travelPlan, refetch } = useFetchTravelPlan(id);
  const updateTravelPlan = useUpdateTravelPlan();
  const deleteSchedule = useDeleteSchedule(); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState(travelPlan ? travelPlan.scheduleList : []);
  const [viewMode, setViewMode] = useState<'timeline' | 'timetable' | 'list'>('timeline'); // New state for view mode

  const handleDeleteSchedule = async (scheduleId: string) => {
    try {
      await deleteSchedule(id, scheduleId);
      refetch(); 
    } catch (error) {
      console.error('Error deleting schedule:', error);
    }
  };

  const deleteTravelPlan = async () => {
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/travelPlan/delete_travel_plan`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([id]),
      });
      navigate('/');
    } catch (error) {
      console.error('Error deleting travel plan:', error);
    }
  };

  if (!travelPlan) {
    return <div>Loading...</div>;
  }

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
  
      // Calculate estimated start time of current schedule
      const estimatedStartTime = new Date(prevSchedule.travelDepartTimeEstimate.getTime() + prevSchedule.inwardRoute.durationOfTravel * 60000); // Assuming durationOfTravel is in minutes
  
      // If the estimated start time is after the current start time, there's a conflict
      if (estimatedStartTime > currentSchedule.travelStartTimeEstimate) {
        currentSchedule.conflict = true;
        hasConflict = true;
      } else {
        currentSchedule.conflict = false;
      }
    }
  
    return hasConflict;
  };
  
  
  const onDragEnd = (result: any) => {
    if (!result.destination) return;
  
    const newScheduleList = Array.from(schedules);
    const [removed] = newScheduleList.splice(result.source.index, 1);
    newScheduleList.splice(result.destination.index, 0, removed);
  
    setSchedules(newScheduleList);
    recalculateTimesAndCheckConflicts(newScheduleList);
  };

  return (
    <div className="container mx-auto">
      {!isModalOpen && (
        <div className="container mx-auto">
          <button onClick={deleteTravelPlan} className="btn btn-danger">Delete Travel Plan</button>
          <button onClick={handleUpdateOnClick} className="btn btn-primary">Update Travel Plan</button>
          <button onClick={() => setViewMode('timeline')} className="btn btn-secondary">Timeline View</button>
          <button onClick={() => setViewMode('timetable')} className="btn btn-secondary">Timetable View</button>
          <button onClick={() => setViewMode('list')} className="btn btn-secondary">List View</button>
          <h1 className="text-2xl font-bold my-4">{travelPlan.name}</h1>
          <p><strong>Start Date:</strong> {travelPlan.travelStartDate}</p>
          <p><strong>End Date:</strong> {travelPlan.travelEndDate}</p>
          <Link to={`/travel-diary/${id}/new-schedule`} className="btn btn-primary">Add Schedule</Link>
          <h2 className="text-xl font-semibold my-4">Schedules</h2>
          {viewMode === 'timetable' && <TimetableView schedules={travelPlan.scheduleList} onDragEnd={onDragEnd} />}
          {viewMode === 'timeline' && <TimelineView schedules={travelPlan.scheduleList} />}
          {viewMode === 'list' && <ScheduleList schedules={travelPlan.scheduleList} onDeleteSchedule={handleDeleteSchedule} onDragEnd={onDragEnd}/>}
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
