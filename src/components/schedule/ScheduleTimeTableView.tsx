import React from 'react';
import { Schedule } from '../../types/Schedule';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { useUpdateSchedule } from '../../hooks';

const TimetableView: React.FC<{ schedules: Schedule[], onDragEnd: (result: any) => void }> = ({ schedules, onDragEnd }) => {
  const updateSchedule = useUpdateSchedule();

  const handleDragEnd = async (result: { destination: { index: number; }; source: { index: number; }; }) => {
    if (!result.destination) return;

    const newScheduleList = Array.from(schedules);
    const [movedSchedule] = newScheduleList.splice(result.source.index, 1);
    newScheduleList.splice(result.destination.index, 0, movedSchedule);

    for (let i = 0; i < newScheduleList.length; i++) {
      newScheduleList[i].travelStartTimeEstimate = new Date(/* Calculate new start time based on previous schedule's end time */);
      newScheduleList[i].travelDepartTimeEstimate = new Date(/* Calculate new end time based on estimated duration */);
      await updateSchedule.updateSchedule(newScheduleList[i]);
    }
  };

  return (
    <Droppable droppableId="timetable">
      {(provided) => (
        <div className="timetable-container" ref={provided.innerRef} {...provided.droppableProps}>
          {schedules.map((schedule, index) => (
            <Draggable key={schedule.id} draggableId={schedule.id} index={index}>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className={`timetable-item ${schedule.conflict ? 'conflict' : ''}`}>
                  <h2>{schedule.place!.name}</h2>
                  <p>{schedule.travelDate.toDateString()}</p>
                  <p>{schedule.travelStartTimeEstimate.toLocaleTimeString()}</p>
                  <p>{schedule.travelDepartTimeEstimate.toLocaleTimeString()}</p>
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default TimetableView;
