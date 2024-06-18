import React, {
  act,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./MyCalender.css";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import {
  Button,
  Container,
  Input,
  InputDescription,
  Modal,
  NativeSelect,
  Tabs,
  Text,
  TextInput,
  Textarea,
  UnstyledButton,
  Image,
} from "@mantine/core";
import SchedulePageMap from "./SchedulePageMap";
import { useDisclosure } from "@mantine/hooks";
import { useJsApiLoader } from "@react-google-maps/api";

//must set DND outside or it keeps re-rendering fyi!
const DnDCalendar = withDragAndDrop(Calendar);

function MyCalender(props) {
  const localizer = momentLocalizer(moment);

  //console.log("prop events are", props.event);

  ////EventID for modal to keep track
  const [eventID, setEventID] = useState();

  ///////////////modal////////////////////////
  //for our modals when we selet an Event
  const [opened, setOpened] = useState(false);
  //console.log(props.event);

  const moveEvent = useCallback(
    ({ event, start, end }) => {
      var bodyData = {};
      props.setEvents((prev) => {
        console.log("prev is", prev);
        const existing = prev.find((ev) => ev.id === event.id);
        const filtered = prev.filter((ev) => ev.id !== event.id);
        bodyData = {
          scheduleId: existing.id,
          name: existing.name,
          description: existing.description,
          travelDepartTimeEstimate: moment(end).format("YYYY-MM-DDTHH:mm:ss"),
          travelStartTimeEstimate: moment(start).format("YYYY-MM-DDTHH:mm:ss"),
          isActuallyVisited: existing.isActuallyVisited,
        };

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
      console.log("fetch resize is", bodyData);
      console.log("jsonfied", JSON.stringify(bodyData));

      fetch(
        `http://localhost:8080/travelPlan/${props.travelPlanId}/schedule/update_schedule_metadata`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_TOKEN}`,
          },
          body: JSON.stringify(bodyData),
        }
      ).then((response) => console.log("success in moving"));
    },
    [props.setEvents]
  );

  const resizeEvent = useCallback(
    ({ event, start, end }) => {
      var bodyData = {};
      props.setEvents((prev) => {
        console.log("prev is", prev);

        const existing = prev.find((ev) => ev.id === event.id);
        const filtered = prev.filter((ev) => ev.id !== event.id);
        bodyData = {
          scheduleId: existing.id,
          name: existing.name,
          description: existing.description,
          travelDepartTimeEstimate: moment(end).format("YYYY-MM-DDTHH:mm:ss"),
          travelStartTimeEstimate: moment(start).format("YYYY-MM-DDTHH:mm:ss"),
          isActuallyVisited: existing.isActuallyVisited,
        };

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
      fetch(
        `http://localhost:8080/travelPlan/${props.travelPlanId}/schedule/update_schedule_metadata`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_TOKEN}`,
          },
          body: JSON.stringify(bodyData),
        }
      ).then((response) => console.log("success in resizing"));
    },
    [props.setEvents]
  );

  //console.log("travelPlanID", props.travelPlanId);

  const deleteEvent = useCallback(() => {
    props.setEvents((p) => {
      //console.log("p is ", p);
      // console.log(eventID);
      //console.log(p);
      const existing = p.filter((ev) => ev.id === eventID);
      console.log("existing to delete", existing);
      const filtered = p.filter((ev) => ev.id != eventID);
      setOpened(false); //turns off modal
      //console.log("deleteEvent ID is", eventID);
      //console.log("filtered events delete are", [...filtered]);
      //console.log("EVENTID", eventID);
      //consol.log([...filtered]);
      return [...filtered];
    });
    //console.log("event id to delete is", eventID);

    fetch(
      `http://localhost:8080/travelPlan/${props.travelPlanId}/schedule/delete_schedule?scheduleId=${eventID}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${import.meta.env.VITE_TOKEN}` },
      }
    )
      .then((response) => response.json())
      .then((data) => console.log("success in deletion"))
      .catch((error) => console.log("error in deleting"));
    //delete in DataBase
  }, [props.setEvents, eventID]);

  const [activityEvent, setActvityEvent] = useState();

  useEffect(() => {
    if (eventID && props.event) {
      const selected = props.event.find((ev) => ev.id === eventID);
      setActvityEvent(selected);
      //console.log("selected is", selected);
    }
  }, [eventID, setEventID]);

  // const activityEvent = Array.isArray(props.event)
  //  ? props.event.find((ev) => ev.id == eventID)
  //  : null;

  //console.log("Activity Event is", activityEvent);
  //console.log("Event ID", eventID);
  //get Activity in modal functions
  const [modalActivityDescription, setModalActivityDescription] = useState({
    title: "",
    description: "",
    googleMapsKeyId: "",
    //destination: ''
  });

  //console.log("activityEvent", activityEvent);

  useEffect(() => {
    if (activityEvent) {
      setModalActivityDescription({
        googleMapsKeyId: activityEvent.place?.googleMapsKeyId || null,
        title: activityEvent.name, //please check here and becareful
        description: activityEvent.description,
      });
    }
    //console.log("modal activity description is");
    //console.log(modalActivityDescription);
  }, [activityEvent, setActvityEvent]);
  //console.log("Modal", modalActivityDescription);

  //map for directions
  //const [map, setMap] = useState<google.maps.Map | null>(null);
  //const mapRef = useRef<HTMLDivElement>(null);
  const [review, setReview] = useState({
    isOpen: false,
    opening_period: [],
    website: "",
    photo: "",
  });

  const service = new google.maps.places.PlacesService(props.map);

  useEffect(() => {
    if (opened) {
      const googlePlaceID = modalActivityDescription.googleMapsKeyId;
      //console.log(googlePlaceID);
      const request = {
        placeId: modalActivityDescription.googleMapsKeyId,
        fields: ["opening_hours", "website", "business_status", "photo"],
      };

      service.getDetails(request, (details, status) => {
        if (status === "OK") {
          console.log("Succesful Google Request");
          setReview({
            isOpen: details?.opening_hours?.open_now
              ? "Currently Open"
              : "Currently Closed",
            opening_period: details?.opening_hours?.weekday_text,
            website: details?.website,
            photo: details?.photos[0].getUrl(),
          });
        } else {
          console.log("Error getting google places of modal details");
        }
      });
      console.log(activityEvent);
      console.log(modalActivityDescription);
    }
  }, [
    opened,
    modalActivityDescription,
    setModalActivityDescription,
    activityEvent,
  ]);
  //console.log(review);

  const showOpeningHours = () => {
    const opening_period = review.opening_period;
    return opening_period.map((items) => {
      return <Text>{items}</Text>;
    });
  };

  /////
  const updateEvents = () => {
    var bodyData = {};
    props.setEvents((p) => {
      const existing = p.find((ev) => ev.id == eventID);
      const filtered = p.filter((ev) => ev.id !== eventID);

      const updatedExisting = {
        ...existing,
        name: modalActivityDescription.title,
        description: modalActivityDescription.description,
      };
      bodyData = {
        scheduleId: existing.id,
        name: updatedExisting.name,
        description: updatedExisting.description,
        travelDepartTimeEstimate: existing.travelDepartTimeEstimate,
        travelStartTimeEstimate: existing.travelStartTimeEstimate,
        isActuallyVisited: existing.isActuallyVisited,
      };
      return [...filtered, updatedExisting];
    });

    fetch(
      `http://localhost:8080/travelPlan/${props.travelPlanId}/schedule/update_schedule_metadata`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
      }
    ).then((response) => console.log("success in updating information"));
  };

  /*
  const showReviews = () => {
    const toShow = Object.values(review);
    return toShow.map((items) => {
      console.log("items", { items });
      return <Text>{items}</Text>;
    });
  };
  */
  {
    /* it was props.event*/
  }

  if (props.event) {
    console.log("names of events", props.event.name);
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
          console.log("e is ", e);
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
          <Tabs defaultValue="description" keepMounted={false}>
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
            <Tabs.Panel value="reviews">
              <Image h={200} w="auto" src={review.photo} />
              <Text>{review.isOpen}</Text>
              <Text>{review.website}</Text>
              <Text>{showOpeningHours()}</Text>
            </Tabs.Panel>

            <Tabs.Panel value="directions">
              <NativeSelect
                data={["Driving", "Walking", "Cycling"]}
              ></NativeSelect>
              Directions tab content
              <Container h="10em"></Container>
            </Tabs.Panel>

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
                  updateEvents();
                  /*
                  props.setEvents((p) => {
                    const existing = p.find((ev) => ev.id == eventID);
                    const filtered = p.filter((ev) => ev.id !== eventID);

                    const updatedExisting = {
                      ...existing,
                      name: modalActivityDescription.title,
                      description: modalActivityDescription.description,
                    };
                    return [...filtered, updatedExisting];
                  });
                  */
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
