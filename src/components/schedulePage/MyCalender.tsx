import {
  Button,
  Center,
  Container,
  Divider,
  Image,
  Input,
  Modal,
  NativeSelect,
  Stack,
  Tabs,
  Text,
  Textarea,
} from "@mantine/core";
import {
  IconDirections,
  IconFileDescription,
  IconPencil,
} from "@tabler/icons-react";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./MyCalender.css";

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
        `${import.meta.env.VITE_APP_API_URL}/travelPlan/${
          props.travelID
        }/schedule/update_schedule_metadata`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem(`authToken`)}`,
          },
          body: JSON.stringify(bodyData),
        }
      )
        .then((response) => console.log("success in moving"))
        .then((data) => console.log("sucecss moving data"))
        .catch((error) => console.log(error));
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
        `${import.meta.env.VITE_APP_API_URL}/travelPlan/${
          props.travelID
        }/schedule/update_schedule_metadata`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem(`authToken`)}`,
          },
          body: JSON.stringify(bodyData),
        }
      )
        .then((response) => console.log("success in resizing"))
        .then((data) => console.log(data))
        .catch((error) => console.log(error, "error resizing"));
    },
    [props.setEvents]
  );

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
      `${import.meta.env.VITE_APP_API_URL}/travelPlan/${
        props.travelID
      }/schedule/delete_schedule?scheduleId=${eventID}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem(`authToken`)}`,
        },
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

  const [service, setService] =
    useState<google.maps.places.PlacesService | null>(null);
  useEffect(() => {
    if (props.map) {
      const svc = new google.maps.places.PlacesService(props.map);
      setService(svc);
    }
  }, [props.map]);

  useEffect(() => {
    if (opened && service) {
      const googlePlaceID = modalActivityDescription.googleMapsKeyId;
      //correct  googlePlaceID
      //console.log(googlePlaceID);
      const request = {
        placeId: modalActivityDescription.googleMapsKeyId,
        fields: ["opening_hours", "website", "business_status", "photo"],
      };
      if (googlePlaceID) {
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
      }
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
    var formattedStart;
    var formattedEnd;
    props.setEvents((p) => {
      const existing = p.find((ev) => ev.id == eventID);
      const filtered = p.filter((ev) => ev.id !== eventID);

      console.log("existing", existing);

      const updatedExisting = {
        ...existing,
        name: modalActivityDescription.title,
        description: modalActivityDescription.description,
      };

      console.log("updatedExisting", updatedExisting);

      bodyData = {
        scheduleId: existing.id,
        name: updatedExisting.name,
        description: updatedExisting.description,
        travelDepartTimeEstimate: existing.travelDepartTimeEstimate,
        travelStartTimeEstimate: existing.travelStartTimeEstimate,
        isActuallyVisited: existing.isActuallyVisited,
      };
      formattedStart = moment(existing.travelStartTimeEstimate).format(
        "YYYY-MM-DDTHH:mm:ss.SSS[Z]"
      );
      formattedEnd = moment(existing.travelDepartTimeEstimate).format(
        "YYYY-MM-DDTHH:mm:ss.SSS[Z]"
      );

      return [...filtered, updatedExisting];
    });

    //this is causing errors lol --> reconvert bodyData here for the travelDepartTime and travelStartTime
    console.log("bodyData-nonJSON", bodyData);
    bodyData = {
      ...bodyData,
      travelDepartTimeEstimate: formattedEnd,
      travelStartTimeEstimate: formattedStart,
    };

    fetch(
      `${import.meta.env.VITE_APP_API_URL}/travelPlan/${
        props.travelID
      }/schedule/update_schedule_metadata`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem(`authToken`)}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
      }
    ).then((response) => console.log("success in updating information"));
  };

  const showReviews = () => {
    const toShow = Object.values(review);
    return toShow.map((items) => {
      console.log("items", { items });
      return <Text>{items}</Text>;
    });
  };

  {
    /* it was props.event*/
  }

  if (props.event) {
    console.log("names of events", props.event.name);
  }

  return (
    <>
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
        style={{ height: 500, width: "100%" }}
        defaultView="week"
        views={["month", "week", "day"]}
        formats={{
          dayFormat: (date) => {
            return moment(date).format("Do dddd");
          },
        }}
        onSelectEvent={(e) => {
          setOpened(true);
          console.log("e is ", e);
          setEventID(e.id);
          console.log("eventID is", e.id);
          //console.log("onSelectEventID");
          //console.log(eventID);
          //console.log("e id", e.id);
        }}
        //onDoubleClickEvent={deleteEvent}
      />
      <Modal
        size="auto"
        opened={opened}
        onClose={() => {
          setOpened(false);
        }}
        withCloseButton={true}
      >
        <nav>
          <Tabs defaultValue="description" keepMounted={false}>
            <Tabs.List grow>
              <Tabs.Tab
                value="description"
                leftSection={<IconFileDescription size={15} color="gray" />}
              >
                Description
              </Tabs.Tab>
              <Tabs.Tab value="reviews">Reviews</Tabs.Tab>
              <Tabs.Tab
                value="directions"
                leftSection={<IconDirections size={15} color="gray" />}
              >
                Directions
              </Tabs.Tab>
              <Tabs.Tab
                value="edit"
                leftSection={<IconPencil size={15} color="gray" />}
              >
                Edit
              </Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel mt={10} value="description">
              {modalActivityDescription.description ? (
                <Text>{modalActivityDescription.description}</Text>
              ) : (
                <Text>Empty Description</Text>
              )}
            </Tabs.Panel>
            <Tabs.Panel mt={10} value="reviews">
              <Stack align="center">
                <Image w={350} h="auto" src={review.photo} />
                <Divider w={350} />
                <Text>{review.isOpen}</Text>
                <Divider w={350} />
                <a href={review.website}>{review.website}</a>
                <Divider w={350} />
                <Text>{showOpeningHours()}</Text>
              </Stack>
            </Tabs.Panel>

            <Tabs.Panel mt={10} value="directions">
              <NativeSelect
                data={["Driving", "Walking", "Cycling"]}
              ></NativeSelect>
              Directions tab content
              <Container h="10em"></Container>
            </Tabs.Panel>

            <Tabs.Panel mt={10} value="edit">
              <Stack>
                <Input.Wrapper description="Schedule Name" size="sm">
                  <Input
                    value={modalActivityDescription.title}
                    placeholder="Activity Name"
                    onChange={(e) => {
                      setModalActivityDescription((p) => ({
                        ...p,
                        title: e.target.value,
                      }));
                    }}
                  ></Input>
                </Input.Wrapper>
                <Textarea
                  description="Schedule Description"
                  placeholder="Description"
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
                <Button
                  className="update-content"
                  variant="outline"
                  color="green"
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
                <Divider label="Danger" labelPosition="center"></Divider>
                <Button
                  className="delete-content"
                  color="red"
                  variant="outline"
                  onClick={deleteEvent}
                >
                  Delete
                </Button>
              </Stack>
            </Tabs.Panel>
          </Tabs>
        </nav>
      </Modal>
    </>
  );
}

export default MyCalender;
