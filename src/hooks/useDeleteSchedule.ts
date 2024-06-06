const useDeleteSchedule = () => {
  const deleteSchedule = async (planId: string, scheduleId: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/travelPlan/${planId}/schedule/delete_schedule?scheduleId=${scheduleId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planId, scheduleId }),
      });
      const deletedScheduleId = await response.json();
      return deletedScheduleId;
    } catch (error) {
      console.error('Error deleting schedule:', error);
      throw error; // Rethrow the error to be handled by the caller
    }
  };

  return deleteSchedule;
};

export default useDeleteSchedule;
