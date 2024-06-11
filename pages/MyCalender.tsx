import React, { useCallback, useMemo, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./MyCalender.css";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import { Text } from "@mantine/core";

const localizer = momentLocalizer(moment);

//remember to change this!
const events = [
  {
    id: "1",
    start: moment("2024-06-11T10:00:00").toDate(),
    end: moment("2024-06-11T11:00:00").toDate(),
    title: "Alex-Testing",
  },
  {
    id: "2",
    start: moment("2024-06-11T12:00:00").toDate(),
    end: moment("2024-06-11T13:00:00").toDate(),
    title: "Alex-Testing-2-check-overlap",
  },
];

//must set DND outside or it keeps re-rendering fyi!
const DnDCalendar = withDragAndDrop(Calendar);

function MyCalender() {
  const [myEvents, setMyEvents] = useState(events);

  const moveEvent = useCallback(
    ({ event, start, end }) => {
      //const nextEvent = event.id;
      //console.log(nextEvent);
      setMyEvents((p) => {
        console.log("drag");
        const existingEvent = p.find((ev) => event.id == ev.id);
        const filteredEvents = p.find((ev) => ev.id !== event.id); //events without the same id
        //console.log("existingEvent", existingEvent);
        //console.log("filteredEvent", filteredEvents);
        //console.log([filteredEvents, { ...existingEvent, start, end }]);
        return [filteredEvents, { ...existingEvent, start, end }];
      });
    },
    [setMyEvents]
  );

  const resizeEvent = useCallback(
    ({ event, start, end }) => {
      setMyEvents((p) => {
        console.log("resize");
        const existingEvent = p.find((ev) => event.id == ev.id);
        const filteredEvents = p.find((ev) => ev.id !== event.id);

        return [filteredEvents, { ...existingEvent, start, end }];
      });
    },
    [setMyEvents]
  );

  const deleteEvent = useCallback(
    (event) => {
      setMyEvents((p) => {
        console.log("deleteEvent");
        console.log(event.id);
        const filteredEvents = p.find((ev) => ev.id !== event.id);

        return [filteredEvents];
      });
    },
    [setMyEvents]
  );

  return (
    <>
      <Text>Right Click to Delete ATM</Text>
      <DnDCalendar
        onEventDrop={moveEvent}
        onEventResize={resizeEvent}
        localizer={localizer}
        events={myEvents}
        //startAccessor="start"
        //endAccessor="end"
        style={{ height: 500, width: "100vw" }}
        defaultView="week"
        views={["month", "week", "day", "agenda"]}
        formats={{
          dayFormat: (date) => {
            return moment(date).format("Do dddd");
          },
        }}
        onSelectEvent={deleteEvent}
      />
    </>
  );
}

export default MyCalender;
