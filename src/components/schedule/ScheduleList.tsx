import React from 'react';
import { Schedule } from '../../types/Schedule';
import { DragDropContext, Draggable, DropResult } from 'react-beautiful-dnd';
import StrictModeDroppable from '../dragAndDrop/StrictModeDroppable';
import { useNavigate, useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import ScheduleItem from './ScheduleItem';


interface ScheduleListProps {
  schedules: Schedule[];
  onDeleteSchedule: (scheduleId: string) => void;
  onDragEnd: (result: DropResult) => void;
}

const ScheduleList: React.FC<ScheduleListProps> = ({ schedules, onDeleteSchedule, onDragEnd }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const selectedDate = searchParams.get('date');
  const parseDate = (date: Date | [number, number, number, number, number]): Date => {
    if (date instanceof Date) {
      return date;
    } else if (Array.isArray(date)) {
      const [year, month, day, hour, minute] = date;
      return new Date(year, month - 1, day, hour, minute); // Month is zero-indexed in JavaScript Date
    }
    return new Date();
  };
  const filteredSchedules = selectedDate
    ? schedules.filter(schedule => {
        const scheduleDate = format(parseDate(schedule.travelStartTimeEstimate), 'yyyy-MM-dd');
        return scheduleDate === selectedDate;
      })
    : schedules;

  const handleDeleteSchedule = (scheduleId: string) => {
    onDeleteSchedule(scheduleId);
  };

  const handleScheduleClick = (scheduleId: string) => {
    navigate(`/schedule/${scheduleId}/edit`);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <StrictModeDroppable droppableId="schedules">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            <ul>
              {filteredSchedules.map((schedule, index) => (
                <Draggable key={schedule.id} draggableId={schedule.id} index={index}>
                  {(provided) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="mb-2 p-2 border rounded shadow cursor-pointer"
                      onClick={() => handleScheduleClick(schedule.id)}
                    >
                      <ScheduleItem schedule={schedule} />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSchedule(schedule.id);
                        }}
                        className="btn btn-danger mt-2"
                      >
                        Delete
                      </button>
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          </div>
        )}
      </StrictModeDroppable>
    </DragDropContext>
  );
};

export default ScheduleList;
