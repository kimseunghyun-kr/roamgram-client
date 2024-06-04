import React from 'react';
import { Schedule } from '../../types/Schedule';
import ScheduleItem from './ScheduleItem';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import StrictModeDroppable from '../dragAndDrop/StrictModeDroppable';

interface ScheduleListProps {
  schedules: Schedule[];
  onDeleteSchedule: (scheduleId: string) => void;
  onDragEnd: (result: DropResult) => void;
}

const ScheduleList: React.FC<ScheduleListProps> = ({ schedules, onDeleteSchedule, onDragEnd }) => {
  const handleDeleteSchedule = (scheduleId: string) => {
    onDeleteSchedule(scheduleId);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <StrictModeDroppable droppableId="schedules">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            <ul>
              {schedules.map((schedule, index) => (
                <Draggable key={schedule.id} draggableId={schedule.id} index={index}>
                  {(provided) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="mb-2 p-2 border rounded shadow"
                    >
                      <ScheduleItem schedule={schedule} />
                      <button
                        onClick={() => handleDeleteSchedule(schedule.id)}
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
