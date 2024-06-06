import React from 'react';
import { Schedule } from '../../types/Schedule';
import { Draggable, DragDropContext, DropResult } from 'react-beautiful-dnd';
import StrictModeDroppable from '../dragAndDrop/StrictModeDroppable';
import ScheduleItem from './ScheduleItem';

interface ScheduleListProps {
  schedules: Schedule[];
  onDeleteSchedule: (scheduleId: string) => void;
  onDragEnd: (result: DropResult) => void;
}

const TimetableView: React.FC<ScheduleListProps> = ({ schedules, onDeleteSchedule, onDragEnd }) => {
  const handleDeleteSchedule = (scheduleId: string) => {
    onDeleteSchedule(scheduleId);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <StrictModeDroppable droppableId="timetable">
        {(provided) => (
          <div className="timetable-container" ref={provided.innerRef} {...provided.droppableProps}>
            {schedules.map((schedule, index) => {

              return (
                <Draggable key={schedule.id} draggableId={schedule.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`timetable-item ${schedule.conflict ? 'conflict' : ''}`}
                    >
                      <ScheduleItem schedule={schedule} />
                      <button
                        onClick={() => handleDeleteSchedule(schedule.id)}
                        className="btn btn-danger mt-2"
                      > Delete 
                      </button>
                    </div>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </div>
        )}
      </StrictModeDroppable>
    </DragDropContext>
  );
};

export default TimetableView;
