import React, { act, useCallback, useEffect, useMemo, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./MyCalender.css";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import {
  Button,
  Input,
  InputDescription,
  Modal,
  Tabs,
  Text,
  TextInput,
  Textarea,
  UnstyledButton,
} from "@mantine/core";
import SchedulePageMap from "./SchedulePageMap";
import { useDisclosure } from "@mantine/hooks";

//must set DND outside or it keeps re-rendering fyi!
const DnDCalendar = withDragAndDrop(Calendar);

function MyCalender(props) {
  const localizer = momentLocalizer(moment);

  ////EventID for modal to keep track
  const [eventID, setEventID] = useState();

  ///////////////modal////////////////////////
  //for our modals when we selet an Event
  const [opened, setOpened] = useState(false);
  //console.log(props.event);

  const moveEvent = useCallback(
    ({ event, start, end }) => {
      props.setEvents((prev) => {
        console.log("prev is", prev);
        const existing = prev.find((ev) => ev.uuid === event.uuid);
        const filtered = prev.filter((ev) => ev.uuid !== event.uuid);
        console.log("existing is", existing);
        console.log("filtered is", filtered);
        console.log("returned is", [
          ...filtered,
          {
            ...existing,
            travelDepartTimeEstimate: end,
            travelStartTimeEstimate: start,
          },
        ]);
        return [
          ...filtered,
          {
            ...existing,
            travelDepartTimeEstimate: end,
            travelStartTimeEstimate: start,
          },
        ];
      });
    },
    [props.setEvents]
  );

  const resizeEvent = useCallback(
    ({ event, start, end }) => {
      props.setEvents((prev) => {
        console.log("prev is", prev);
        const existing = prev.find((ev) => ev.uuid === event.uuid);
        const filtered = prev.filter((ev) => ev.uuid !== event.uuid);

        console.log("existing is", existing);
        console.log("filtered is", filtered);
        console.log("returned is", [...filtered, { ...existing, start, end }]);
        return [
          ...filtered,
          {
            ...existing,
            travelDepartTimeEstimate: end,
            travelStartTimeEstimate: start,
          },
        ];
      });
    },
    [props.setEvents]
  );

  const deleteEvent = useCallback(() => {
    props.setEvents((p) => {
      //console.log("p is ", p);
      // console.log(eventID);
      //console.log(p);

      const filtered = p.filter((ev) => ev.uuid != eventID);
      setOpened(false); //turns off modal
      //console.log("deleteEvent ID is", eventID);
      //console.log("filtered events delete are", [...filtered]);
      console.log("EVENTID", eventID);
      console.log([...filtered]);
      return [...filtered];
    });
  }, [props.setEvents, eventID]);

  //console.log(eventID);

  //add function

  //Event Activities const
  //const activityDescription = props.event

  //get Activity in modal functions
  const [modalActivityDescription, setModalActivityDescription] = useState({
    title: "",
    description: "",
    //destination: ''
  });
  //console.log("props events are");

  const activityEvent = props.event.find((ev) => ev.uuid === eventID);
  //console.log("activityEvent", activityEvent);
  useEffect(() => {
    if (activityEvent) {
      setModalActivityDescription({
        title: activityEvent.title,
        description: activityEvent.description,
      });
    }
    //console.log("modal activity description is");
    //console.log(modalActivityDescription);
  }, [activityEvent]);

  //update
  var updateEvent;

  {
    /* it was props.event*/
  }
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
        startAccessor="travelStartTimeEstimate"
        endAccessor="travelDepartTimeEstimate"
        titleAccessor="name"
        //resourceIdAccessor="place: id"
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
          setEventID(e.uuid);
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
          <Tabs defaultValue="description">
            <Tabs.List grow>
              <Tabs.Tab value="description">Description</Tabs.Tab>
              <Tabs.Tab value="reviews">Reviews</Tabs.Tab>
              <Tabs.Tab value="directions">Directions</Tabs.Tab>
              <Tabs.Tab value="edit">Edit</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="description">
              {modalActivityDescription.description ? (
                <Text>{modalActivityDescription.description}</Text>
              ) : (
                <Text>Empty Description</Text>
              )}
            </Tabs.Panel>
            <Tabs.Panel value="reviews">Reviews tab content</Tabs.Panel>

            <Tabs.Panel value="directions">Directions tab content</Tabs.Panel>

            <Tabs.Panel value="edit">
              <Input
                value={modalActivityDescription.title}
                placeholder="ACTIVITY nAME"
                onChange={(e) => {
                  setModalActivityDescription((p) => ({
                    ...p,
                    title: e.target.value,
                  }));
                }}
              ></Input>
              <Textarea
                placeholder="description"
                value={modalActivityDescription.description}
                onChange={(e) => {
                  setModalActivityDescription((p) => ({
                    ...p,
                    description: e.target.value,
                  }));
                  //console.log(e.currentTarget.value);
                  //console.log("modal", modalActivityDescription);
                }}
              ></Textarea>
              <Textarea placeholder="destination"></Textarea>
              <Button
                onClick={() => {
                  setOpened(false);

                  props.setEvents((p) => {
                    const existing = p.find((ev) => ev.uuid == eventID);
                    const filtered = p.filter((ev) => ev.uuid !== eventID);

                    const updatedExisting = {
                      ...existing,
                      name: modalActivityDescription.title,
                      description: modalActivityDescription.description,
                    };
                    return [...filtered, updatedExisting];
                  });
                }}
              >
                Update Content
              </Button>
              <Button onClick={deleteEvent}>Delete</Button>
            </Tabs.Panel>
          </Tabs>
        </nav>
      </Modal>
    </>
  );
}

export default MyCalender;
