import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ScheduleList from '../components/ScheduleList';
import ModalForm from '../components/UpdateTravelPlanModal';
import { useFetchTravelPlan, useUpdateTravelPlan, useAddSchedule, useDeleteSchedule } from '../hooks';
import { Schedule } from '../types/Schedule';
import { TravelPlanUpsertRequest } from '../types/request/TravelPlanUpsertRequest';

const TravelDiaryPage: React.FC = () => {
  const { id = '' } = useParams<{ id: string }>();
  const { travelPlan, refetch } = useFetchTravelPlan(id);
  const updateTravelPlan = useUpdateTravelPlan();
  const addSchedule = useAddSchedule(); // Use the new hook for adding a schedule
  const deleteSchedule = useDeleteSchedule(); // Use the new hook for deleting a schedule
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleAddSchedule = async (newSchedule: Schedule) => {
    try {
      await addSchedule(id, newSchedule);
      refetch(); // Refetch travel plan data after adding a schedule
    } catch (error) {
      console.error('Error adding schedule:', error);
    }
  };

  const handleDeleteSchedule = async (scheduleId: string) => {
    try {
      await deleteSchedule(id, scheduleId);
      refetch(); // Refetch travel plan data after deleting a schedule
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
    refetch(); // Refetch travel plan data after updating the travel plan
  };

  return (
    <div className="container mx-auto">
      <button onClick={deleteTravelPlan} className="btn btn-danger">Delete Travel Plan</button>
      <button onClick={handleUpdateOnClick} className="btn btn-primary">Update Travel Plan</button>
      <h1 className="text-2xl font-bold my-4">{travelPlan.name}</h1>
      <p><strong>Start Date:</strong> {travelPlan.travelStartDate}</p>
      <p><strong>End Date:</strong> {travelPlan.travelEndDate}</p>
      <h2 className="text-xl font-semibold my-4">Schedules</h2>
      <ScheduleList schedules={travelPlan.scheduleList} onAddSchedule={handleAddSchedule} onDeleteSchedule={handleDeleteSchedule} />
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
