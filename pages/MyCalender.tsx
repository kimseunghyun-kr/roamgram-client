import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./MyCalender.css";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import {
  Button,
  InputDescription,
  Modal,
  Tabs,
  Text,
  UnstyledButton,
} from "@mantine/core";
import SchedulePageMap from "./SchedulePageMap";
import { useDisclosure } from "@mantine/hooks";

//must set DND outside or it keeps re-rendering fyi!
const DnDCalendar = withDragAndDrop(Calendar);

function MyCalender(props) {
  const localizer = momentLocalizer(moment);
  const [myEvents, setMyEvents] = useState(props.event);
  //console.log(props.event);

  //for our modals when we selet an Event
  const [opened, setOpened] = useState(false);
  console.log("mycalender events are");
  console.log(props.event);
  console.log("myEvents are", myEvents);

  useEffect(() => {
    setMyEvents((p) => props.event);
  }, [props.event]);

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
  ///delete function for onClick

  /*
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
  */
  const [eventID, setEventID] = useState();
  const deleteEvent = useCallback(() => {
    setMyEvents((p) => {
      //console.log("p is ", p);
      // console.log(eventID);
      const filteredEvents = p.find((ev) => ev.id !== eventID);
      return [filteredEvents];
    });
  }, [setMyEvents, eventID]);

  //add function
  //useCallback returns
  const addEvent = useCallback(
    (event) => {
      setMyEvents((p) => [...p, event]);
      return [myEvents];
    },
    [setMyEvents]
  );

  //update
  var updateEvent;

  return (
    <>
      <Text>click to edit to delete button to dete</Text>
      <Text> Click on 9th Sunday etc to go on specific day</Text>
      <DnDCalendar
        selectable //
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
        onSelectEvent={(e) => {
          setOpened(true);
          setEventID(e.id);
          //console.log("onSelectEventID");
          //console.log(eventID);
          //console.log("e id", e.id);
        }}
        //onDoubleClickEvent={deleteEvent}
      />
      <Modal
        opened={opened}
        onClose={() => {
          setOpened(false);
        }}
        withCloseButton={true}
      >
        <nav>
          <Tabs defaultValue="scheduleModal">
            <Tabs.List grow>
              <Tabs.Tab value="reviews">Reviews</Tabs.Tab>
              <Tabs.Tab value="directions">Directions</Tabs.Tab>
              <Tabs.Tab value="edit">Edit</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="reviews">Reviews tab content</Tabs.Panel>

            <Tabs.Panel value="directions">Directions tab content</Tabs.Panel>

            <Tabs.Panel value="edit">
              Edit
              <Button onClick={deleteEvent}>Delete</Button>
            </Tabs.Panel>
          </Tabs>
        </nav>
      </Modal>
    </>
  );
}

export default MyCalender;
