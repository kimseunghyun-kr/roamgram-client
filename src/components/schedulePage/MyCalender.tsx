import {
  Button,
  Center,
  Container,
  Divider,
  Group,
  Image,
  Input,
  Modal,
  NativeSelect,
  Rating,
  ScrollArea,
  Space,
  Stack,
  Tabs,
  Text,
  Textarea,
  UnstyledButton,
} from "@mantine/core";
import {
  IconDirections,
  IconFileDescription,
  IconPencil,
} from "@tabler/icons-react";
import moment from "moment";
import { useCallback, useEffect, useRef, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./MyCalender.css";
import React from "react";
import { useAuth } from "../Login/AuthContext";
import { Link } from "react-router-dom";

//must set DND outside or it keeps re-rendering fyi!
const DnDCalendar = withDragAndDrop(Calendar);

function MyCalender(props) {
  const localizer = momentLocalizer(moment);

  //("prop events are", props.event);

  ////EventID for modal to keep track
  const [eventID, setEventID] = useState();

  ///////////////modal////////////////////////
  //for our modals when we selet an Event
  const [opened, setOpened] = useState(false);
  //(props.event);

  const [directionsService, setDirectionsService] =
    useState<google.maps.DirectionsService | null>(null);
  const [directionsRenderer, setDirectionsRenderer] =
    useState<google.maps.DirectionsRenderer | null>(null);
  const [travelMethod, setTravelMethod] = useState("DRIVING");

  const moveEvent = useCallback(
    ({ event, start, end }) => {
      var bodyData = {};
      props.setEvents((prev) => {
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

        [
          ...filtered,
          {
            ...existing,
            travelDepartTimeEstimate: end,
            travelStartTimeEstimate: start,
          },
        ];
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
          credentials: "include",
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(bodyData),
        }
      )
        .then((response) => "success in moving")
        .then((data) => "sucecss moving data")
        .catch((error) => error);
    },
    [props.setEvents]
  );

  const resizeEvent = useCallback(
    ({ event, start, end }) => {
      var bodyData = {};
      props.setEvents((prev) => {
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
          credentials: "include",
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(bodyData),
        }
      )
        .then((response) => "success in resizing")
        .then((data) => data)
        .catch((error) => error);
    },
    [props.setEvents]
  );

  const deleteEvent = useCallback(() => {
    props.setEvents((p) => {
      //("p is ", p);
      // (eventID);
      //(p);
      const existing = p.filter((ev) => ev.id === eventID);
      const filtered = p.filter((ev) => ev.id != eventID);
      setOpened(false); //turns off modal
      //("deleteEvent ID is", eventID);
      //("filtered events delete are", [...filtered]);
      //("EVENTID", eventID);
      //consol.log([...filtered]);
      return [...filtered];
    });
    //("event id to delete is", eventID);

    fetch(
      `${import.meta.env.VITE_APP_API_URL}/travelPlan/${
        props.travelID
      }/schedule/delete_schedule?scheduleId=${eventID}`,
      {
        credentials: "include",
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => "success in deletion")
      .catch((error) => "error in deleting");
    //delete in DataBase
  }, [props.setEvents, eventID]);

  const [activityEvent, setActvityEvent] = useState();

  useEffect(() => {
    if (eventID && props.event) {
      const selected = props.event.find((ev) => ev.id === eventID);
      setActvityEvent(selected);
      //("selected is", selected);
    }
  }, [eventID, setEventID]);

  // const activityEvent = Array.isArray(props.event)
  //  ? props.event.find((ev) => ev.id == eventID)
  //  : null;

  //("Activity Event is", activityEvent);
  //("Event ID", eventID);
  //get Activity in modal functions
  const [modalActivityDescription, setModalActivityDescription] = useState({
    title: "",
    description: "",
    googleMapsKeyId: "",
    //destination: ''
  });

  //("activityEvent", activityEvent);

  useEffect(() => {
    if (activityEvent) {
      setModalActivityDescription({
        googleMapsKeyId: activityEvent.place?.googleMapsKeyId || null,
        title: activityEvent.name, //please check here and becareful
        description: activityEvent.description,
      });
    }
    //("modal activity description is");
    //(modalActivityDescription);
  }, [activityEvent, setActvityEvent]);
  //("Modal", modalActivityDescription);

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

  const authToken = sessionStorage.getItem(`authToken`);

  useEffect(() => {
    if (opened && service) {
      const googlePlaceID = modalActivityDescription.googleMapsKeyId;
      //correct  googlePlaceID
      //(googlePlaceID);
      const request = {
        placeId: modalActivityDescription.googleMapsKeyId,
        fields: ["opening_hours", "website", "business_status", "photo"],
      };
      if (googlePlaceID) {
        service.getDetails(request, (details, status) => {
          if (status === "OK") {
            ("Succesful Google Request");
            setReview({
              isOpen: details?.opening_hours?.open_now
                ? "Currently Open"
                : "Currently Closed",
              opening_period: details?.opening_hours?.weekday_text,
              website: details?.website,
              photo:
                details?.photos?.length > 0 ? details.photos[0].getUrl() : null,
            });
          } else {
            ("Error getting google places of modal details");
          }
        });
      }
      activityEvent;
      modalActivityDescription;

      if (opened && modalMapRef.current) {
        const mapOptions = {
          center: { lat: 25, lng: 30 },
          zoom: 8,
          mapId: import.meta.env.VITE_NEXT_PUBLIC_MAP_ID,
        };
        const mapContainer = new google.maps.Map(
          modalMapRef.current,
          mapOptions
        );
        const directionsServices = new google.maps.DirectionsService();
        const directionsRenderers = new google.maps.DirectionsRenderer({
          map: mapContainer,
        });

        setModalMap(mapContainer);
        setDirectionsService(directionsServices);
        setDirectionsRenderer(directionsRenderers);
      }
    }
  }, [
    opened,
    modalActivityDescription,
    setModalActivityDescription,
    activityEvent,
  ]);
  //(review);

  useEffect(() => {
    const modeElement = document.getElementById(
      "modalMode"
    ) as HTMLInputElement;
    if (!travelMethod || !modeElement) return; //ensures modeElement redenred before we open modal
    if (
      directionsService &&
      directionsRenderer &&
      opened &&
      modalActivityDescription &&
      travelMethod
    ) {
      calculateRoute(directionsService, directionsRenderer);
    }
  }, [
    opened,
    travelMethod,
    directionsRenderer,
    directionsService,
    modalActivityDescription,
    setModalActivityDescription,
  ]);

  const showOpeningHours = () => {
    const opening_period = review.opening_period;
    return opening_period?.map((items) => {
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
      formattedStart = moment(existing.travelStartTimeEstimate).format(
        "YYYY-MM-DDTHH:mm:ss.SSS[Z]"
      );
      formattedEnd = moment(existing.travelDepartTimeEstimate).format(
        "YYYY-MM-DDTHH:mm:ss.SSS[Z]"
      );

      return [...filtered, updatedExisting];
    });

    //this is causing errors lol --> reconvert bodyData here for the travelDepartTime and travelStartTime

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
        credentials: "include",
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
      }
    ).then((response) => "success in updating information");
  };

  const showReviews = () => {
    const toShow = Object.values(review);
    return toShow.map((items) => {
      return <Text>{items}</Text>;
    });
  };

  {
    /* it was props.event*/
  }

  const [currentLocation, setCurrentLocation] = useState({});
  const [directionSteps, setDirectionSteps] =
    useState<google.maps.DirectionsStep[]>();

  const [route, setRoute] = useState<google.maps.DirectionsRoute[]>([]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const currentPos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setCurrentLocation(currentPos);
      });
    }
  }, []);
  /////

  function calculateRoute(
    directionsService: google.maps.DirectionsService,
    directionsRenderer: google.maps.DirectionsRenderer
  ) {
    ("calculate Route");
    const currentLoc = currentLocation as google.maps.LatLng;

    const destID = modalActivityDescription.googleMapsKeyId;
    const selectedMode = (
      document.getElementById("modalMode") as HTMLInputElement
    ).value as keyof typeof google.maps.TravelMode;
    var request = {
      origin: { location: currentLoc },
      destination: { placeId: destID },
      travelMode: google.maps.TravelMode[
        selectedMode
      ] as google.maps.TravelMode,
    };
    directionsService.route(request, function (result, status) {
      if (status == "OK") {
        directionsRenderer.setDirections(result);

        if (result?.routes) {
          setRoute(result.routes);
          const steps = result.routes[0]?.legs[0].steps;
          if (steps) {
            setDirectionSteps(steps);
          }
        }
      }
    });
  }

  ///
  const [modalMap, setModalMap] = useState<google.maps.Map | null>(null);

  const modalMapRef = useRef<HTMLDivElement>(null);

  const [rating, setRating] = useState(null);
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
          setEventID(e.id);
        }}
      />
      <Modal
        size="auto"
        opened={opened}
        onClose={() => {
          setOpened(false);
          setRating(null);
        }}
        withCloseButton={true}
      >
        <nav>
          <Tabs defaultValue="description" keepMounted={true}>
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
                {review ? (
                  <>
                    <Image w={350} h="auto" src={review.photo} />
                    <Divider w={350} />
                    <Text>{review.isOpen}</Text>
                    <Divider w={350} />
                    <a href={review.website}>{review.website}</a>
                    <Divider w={350} />
                    <Text>{showOpeningHours()}</Text>
                  </>
                ) : null}
                <Divider w={350} />
                <Text>Leave a short review</Text>
                <Rating
                  value={rating}
                  onChange={(e) => {
                    setRating(e);
                    console.log(rating);
                  }}
                />
                <Textarea autosize w={350} />
                <Button
                  onClick={() => {
                    console.log(rating);
                  }}
                >
                  Submit Review
                </Button>
                <Divider c="gray" w={250} />
                <Link to="/reviews/detailed_review">
                  <UnstyledButton c="purple">
                    Click here to give a detailed review
                  </UnstyledButton>
                </Link>
              </Stack>
            </Tabs.Panel>

            <Tabs.Panel mt={10} value="directions">
              <Text>
                <b>Fastest</b> Route to this location from Current Position
              </Text>

              <NativeSelect
                onChange={(e) => setTravelMethod(e.target.value)}
                id="modalMode"
                description="Method of Travel"
                data={[
                  { label: "Driving", value: "DRIVING" },
                  { label: "Walking", value: "WALKING" },
                  { label: "Bicycling", value: "BICYCLING" },
                  { label: "Transit", value: "TRANSIT" },
                ]}
              ></NativeSelect>
              <Space h={20}></Space>
              <Container h={300} w={400} ref={modalMapRef}></Container>
              <Space h={20}></Space>
              {route ? (
                <>
                  <Group>
                    <Text>Distance: {route[0]?.legs[0]?.distance?.text}</Text>
                    <Text>Duration: {route[0]?.legs[0]?.duration?.text}</Text>
                  </Group>
                  <ScrollArea h={300}>
                    {directionSteps ? (
                      directionSteps.map((item, index) => (
                        <Stack key={index}>
                          <Divider></Divider>
                          <div
                            dangerouslySetInnerHTML={{
                              __html: item.instructions,
                            }}
                          ></div>
                          <Group>
                            <Text size="xs">{item.distance.text}</Text>
                            <Text size="xs">{item.duration.text}</Text>
                          </Group>
                        </Stack>
                      ))
                    ) : (
                      <Text>No directions available</Text>
                    )}
                  </ScrollArea>
                </>
              ) : (
                <Text>No Information found</Text>
              )}
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
                  }}
                ></Textarea>
                <Button
                  className="update-content"
                  variant="outline"
                  color="green"
                  onClick={() => {
                    setOpened(false);
                    updateEvents();
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
