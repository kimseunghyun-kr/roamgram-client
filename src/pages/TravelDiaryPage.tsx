import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ScheduleList from '../components/ScheduleList';
import { Schedule } from '../types/Schedule';

const TravelDiaryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  useEffect(() => {
    fetch(`/api/travelDiaries/${id}/schedules`) // REST URI: GET /api/travelDiaries/{id}/schedules
      .then(response => response.json())
      .then(data => setSchedules(data))
      .catch(error => console.error('Error fetching schedules:', error));
  }, [id]);

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold my-4">Schedules</h1>
      <ScheduleList schedules={schedules} />
    </div>
  );
};

export default TravelDiaryPage;
