import React from 'react';
import { Schedule } from '../../types/Schedule';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { format, startOfMonth, endOfMonth, addDays } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface CalendarViewProps {
  travelPlanId: string
  schedules: Schedule[];
  onDeleteSchedule: (scheduleId: string) => void;
  onDragEnd: (result: DropResult) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ travelPlanId, onDragEnd }) => {
  const navigate = useNavigate();
  const today = new Date();
  const startOfCurrentMonth = startOfMonth(today);
  const endOfCurrentMonth = endOfMonth(today);
  const daysInMonth = [];

  for (let day = startOfCurrentMonth; day <= endOfCurrentMonth; day = addDays(day, 1)) {
    daysInMonth.push(day);
  }

  const handleDateClick = (date: Date) => {
    console.log("navigating to the page")
    navigate(`/travel-diary/schedules?date=${format(date, 'yyyy-MM-dd')}&travelPlanId=${travelPlanId}`);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-7 gap-4">
        {daysInMonth.map((day, index) => (
          <div
            key={index}
            onClick={() => handleDateClick(day)}
            className="border p-2 rounded shadow-sm cursor-pointer"
          >
            <h4 className="font-bold">{format(day, 'd')}</h4>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};

export default CalendarView;
