import React, { useEffect, useState } from 'react';
import TravelDiaryList from '../components/TravelDiaryList';
import { TravelDiary } from '../types/TravelDiary';

const HomePage: React.FC = () => {
  const [travelDiaries, setTravelDiaries] = useState<TravelDiary[]>([]);

  useEffect(() => {
    fetch('/api/travelDiaries') // REST URI: GET /api/travelDiaries
      .then(response => response.json())
      .then(data => setTravelDiaries(data))
      .catch(error => console.error('Error fetching travel diaries:', error));
  }, []);

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold my-4">Travel Diaries</h1>
      <TravelDiaryList travelDiaries={travelDiaries} />
    </div>
  );
};

export default HomePage;