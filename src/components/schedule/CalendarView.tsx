// CalendarView.tsx
import React, { useState, useEffect } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { format, startOfMonth, endOfMonth, addDays, addMonths, differenceInDays } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { TravelPlan } from '../../types/TravelPlan';
import { Schedule } from '../../types/Schedule';
import { useUpdateTravelPlan, useConvertToDate, useFetchTravelPlan } from '../../hooks';
import { TravelPlanUpsertRequestImpl } from '../../types/request/TravelPlanUpsertRequest';
import CalendarModal from './CalendarModal'; // Import the ConfirmModal component

interface CalendarViewProps {
  initialTravelPlan: TravelPlan;
  initialSchedules: Schedule[];
  onDeleteSchedule: (scheduleId: string) => void;
  onDragEnd: (result: DropResult) => void;
}

// Define the type for modal options
interface ModalOption {
  label: string;
  value: string;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  initialTravelPlan,
  initialSchedules,
  onDeleteSchedule,
  onDragEnd,
}) => {
  const navigate = useNavigate();
  const [travelPlan, setTravelPlan] = useState(initialTravelPlan);
  const [schedules, setSchedules] = useState(initialSchedules);
  const [currentMonth, setCurrentMonth] = useState(new Date(travelPlan.travelStartDate));
  const travelPlanId = travelPlan.id;
  const { travelPlan: fetchedTravelPlan, refetch: refetchTravelPlan, loading, error } = useFetchTravelPlan(travelPlanId);
  const updateTravelPlan = useUpdateTravelPlan();
  const { convertToDate } = useConvertToDate();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOptions, setModalOptions] = useState<ModalOption[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    if (fetchedTravelPlan) {
      setTravelPlan(fetchedTravelPlan);
      setSchedules(fetchedTravelPlan.scheduleList || []);
    }
  }, [fetchedTravelPlan]);

  useEffect(() => {
    setTravelPlan(initialTravelPlan);
    setSchedules(initialSchedules);
  }, [initialTravelPlan, initialSchedules]);

  const fetchUpdatedTravelPlan = async () => {
    await refetchTravelPlan();
  };

  const daysInMonth: Date[] = [];
  const startOfCurrentMonth = startOfMonth(currentMonth);
  const endOfCurrentMonth = endOfMonth(currentMonth);

  const travelPlanStartDate = new Date(travelPlan.travelStartDate);
  const travelPlanEndDate = new Date(travelPlan.travelEndDate);

  const isWithinTravelPlanRange = (date: Date) => {
    return date >= travelPlanStartDate && date <= travelPlanEndDate;
  };

  for (let day = startOfCurrentMonth; day <= endOfCurrentMonth; day = addDays(day, 1)) {
    daysInMonth.push(day);
  }

  const handleDateClick = (date: Date) => {
    if (!isWithinTravelPlanRange(date)) return;
    navigate(`/travel-diary/schedules?date=${format(date, 'yyyy-MM-dd')}&travelPlanId=${travelPlanId}`);
  };

  const handleContextMenu = (e: React.MouseEvent<HTMLDivElement>, date: Date) => {
    e.preventDefault();

    if (isWithinTravelPlanRange(date)) {
      setModalOptions([
        { label: 'Move start date', value: 'moveStart' },
        { label: 'Move end date', value: 'moveEnd' },
      ]);
    } else {
      setModalOptions([{ label: 'Include this date in the travel plan', value: 'includeDate' }]);
    }

    setSelectedDate(date);
    setModalOpen(true);
  };

  const handleModalConfirm = async (option: string) => {
    if (!selectedDate) return;

    const date = selectedDate;
    let affectedSchedules = [];
    let confirmDeletion = true;

    if (option === 'moveStart') {
      affectedSchedules = schedules.filter(schedule => convertToDate(schedule.travelStartTimeEstimate) < date);
      if (affectedSchedules.length > 0) {
        confirmDeletion = window.confirm(`Moving the start date will delete ${affectedSchedules.length} schedules. Do you want to proceed?`);
      }
      if (confirmDeletion) {
        affectedSchedules.forEach(schedule => onDeleteSchedule(schedule.id));
        const updatedTravelPlan = { ...travelPlan, travelStartDate: format(date, 'yyyy-MM-dd') };
        const request = TravelPlanUpsertRequestImpl.fromTravelPlan(updatedTravelPlan);
        await updateTravelPlan(request);
      }
    } else if (option === 'moveEnd') {
      affectedSchedules = schedules.filter(schedule => convertToDate(schedule.travelStartTimeEstimate) > date);
      if (affectedSchedules.length > 0) {
        confirmDeletion = window.confirm(`Moving the end date will delete ${affectedSchedules.length} schedules. Do you want to proceed?`);
      }
      if (confirmDeletion) {
        affectedSchedules.forEach(schedule => onDeleteSchedule(schedule.id));
        const updatedTravelPlan = { ...travelPlan, travelEndDate: format(date, 'yyyy-MM-dd') };
        const request = TravelPlanUpsertRequestImpl.fromTravelPlan(updatedTravelPlan);
        await updateTravelPlan(request);
      }
    } else if (option === 'includeDate') {
      if (date < travelPlanStartDate) {
        const updatedTravelPlan = { ...travelPlan, travelStartDate: format(date, 'yyyy-MM-dd') };
        const request = TravelPlanUpsertRequestImpl.fromTravelPlan(updatedTravelPlan);
        await updateTravelPlan(request);
      } else if (date > travelPlanEndDate) {
        const updatedTravelPlan = { ...travelPlan, travelEndDate: format(date, 'yyyy-MM-dd') };
        const request = TravelPlanUpsertRequestImpl.fromTravelPlan(updatedTravelPlan);
        await updateTravelPlan(request);
      }
    }

    await fetchUpdatedTravelPlan(); // Fetch updated data
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const previousMonth = () => {
    setCurrentMonth(addMonths(currentMonth, -1));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="calendar-container p-4 border rounded-lg bg-white">
        <div className="flex justify-between items-center mb-4">
          <button onClick={previousMonth} className="text-blue-500">&lt;</button>
          <h2 className="text-lg font-semibold">{format(currentMonth, 'MMMM yyyy')}</h2>
          <button onClick={nextMonth} className="text-blue-500">&gt;</button>
        </div>
        <div className="grid grid-cols-7 gap-4">
          {daysOfWeek.map((day, index) => (
            <div key={index} className="text-center font-bold">{day}</div>
          ))}
          {daysInMonth.map((day, index) => {
            const classNames = ["border p-2 rounded shadow-sm cursor-pointer"];
            if (isWithinTravelPlanRange(day)) {
              classNames.push("bg-blue-200"); // Add your custom class for dates within travel plan range
            }
            return (
              <div
                key={index}
                onClick={() => handleDateClick(day)}
                onContextMenu={(e) => handleContextMenu(e, day)} // Right-click handler
                className={classNames.join(" ")}
                style={{ gridColumn: index === 0 ? differenceInDays(day, startOfCurrentMonth) + 1 : undefined }}
              >
                <h4 className="font-bold">{format(day, 'd')}</h4>
              </div>
            );
          })}
        </div>
      
      <CalendarModal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleModalConfirm}
        options={modalOptions}
      />
    </div>
    </DragDropContext>
  );
};

export default CalendarView;
