import React from 'react';
import { TravelDiary } from '../types/TravelDiary';
import TravelDiaryItem from './TravelDiaryItem';

interface TravelDiaryListProps {
  travelDiaries: TravelDiary[];
}

const TravelDiaryList: React.FC<TravelDiaryListProps> = ({ travelDiaries }) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {travelDiaries.map(diary => (
        <TravelDiaryItem key={diary.id} travelDiary={diary} />
      ))}
    </div>
  );
};

export default TravelDiaryList;
