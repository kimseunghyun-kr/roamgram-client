import React from 'react';
import { Schedule } from '../../types/Schedule';
import ScheduleItem from './ScheduleItem';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

interface ScheduleListProps {
  schedules: Schedule[];
  onDeleteSchedule: (scheduleId: string) => void;
  onDragEnd: (result: any) => void;
}

const ScheduleList: React.FC<ScheduleListProps> = ({ schedules, onDeleteSchedule, onDragEnd }) => {
  const handleDeleteSchedule = (scheduleId: string) => {
    onDeleteSchedule(scheduleId);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="schedules">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            <ul>
              {schedules.map((schedule, index) => (
                <Draggable key={schedule.id} draggableId={schedule.id} index={index}>
                  {(provided) => (
                    <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                      <ScheduleItem schedule={schedule} />
                      <button onClick={() => handleDeleteSchedule(schedule.id)} className="btn btn-danger">Delete</button>
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default ScheduleList;
