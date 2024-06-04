import React from 'react';
import { Schedule } from '../../types/Schedule';
import { Droppable, Draggable, DragDropContext, DropResult } from 'react-beautiful-dnd';
import StrictModeDroppable from '../dragAndDrop/StrictModeDroppable';

const TimetableView: React.FC<{ schedules: Schedule[], onDragEnd: (result: DropResult) => void }> = ({ schedules, onDragEnd }) => {
  const convertToDate = (dateInput: Date | [number, number, number, number, number]) => {
    if (Array.isArray(dateInput)) {
      return new Date(dateInput[0], dateInput[1] - 1, dateInput[2], dateInput[3], dateInput[4]);
    }
    return new Date(dateInput);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <StrictModeDroppable droppableId="timetable">
        {(provided) => (
          <div className="timetable-container" ref={provided.innerRef} {...provided.droppableProps}>
            {schedules.map((schedule, index) => {
              const travelStart = convertToDate(schedule.travelStartTimeEstimate);
              const travelEnd = convertToDate(schedule.travelDepartTimeEstimate);

              return (
                <Draggable key={schedule.id} draggableId={schedule.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`timetable-item ${schedule.conflict ? 'conflict' : ''}`}
                    >
                      <h2>{schedule.place?.name ?? "someDefaultTravel"}</h2>
                      <p>{travelStart.toLocaleDateString()}</p>
                      <p>{travelStart.toLocaleTimeString()}</p>
                      <p>{travelEnd.toLocaleTimeString()}</p>
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
