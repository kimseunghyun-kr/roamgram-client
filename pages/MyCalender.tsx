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

  ////
  const [myEvents, setMyEvents] = useState(props.event);
  const [eventID, setEventID] = useState();
  //console.log(props.event);

  //for our modals when we selet an Event
  const [opened, setOpened] = useState(false);

  //console.log("mycalender props events are", props.event);
  //console.log("myEvents are", myEvents);

  // useEffect(() => {}, [eventID, setID]);

  const moveEvent = useCallback(
    ({ event, start, end }) => {
      props.setEvents((prev) => {
        console.log("prev is", prev);
        const existing = prev.find((ev) => ev.id === event.id);
        const filtered = prev.filter((ev) => ev.id !== event.id);
        console.log("myEvents are", myEvents);
        console.log("existing is", existing);
        console.log("filtered is", filtered);
        console.log("returned is", [...filtered, { ...existing, start, end }]);
        return [...filtered, { ...existing, start, end }];
      });
    },
    [props.setEvents]
  );

  const resizeEvent = useCallback(
    ({ event, start, end }) => {
      props.setEvents((prev) => {
        console.log("prev is", prev);
        const existing = prev.find((ev) => ev.id === event.id);
        const filtered = prev.filter((ev) => ev.id !== event.id);
        console.log("myEvents are", myEvents);
        console.log("existing is", existing);
        console.log("filtered is", filtered);
        console.log("returned is", [...filtered, { ...existing, start, end }]);
        return [...filtered, { ...existing, start, end }];
      });
    },
    [setMyEvents]
  );

  const deleteEvent = useCallback(() => {
    setMyEvents((p) => {
      //console.log("p is ", p);
      // console.log(eventID);
      const filteredEvents = p.find((ev) => ev.id !== eventID);
      return [filteredEvents];
    });
  }, [setMyEvents, eventID]);

  //add function

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
        events={props.event}
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
