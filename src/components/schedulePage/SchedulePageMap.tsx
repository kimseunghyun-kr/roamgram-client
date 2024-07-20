import { useEffect, useRef, useState } from "react";

import {
  Box,
  Button,
  Center,
  Checkbox,
  Divider,
  Flex,
  Group,
  Image,
  Input,
  NativeSelect,
  Popover,
  SimpleGrid,
  Space,
  Stack,
  Text,
  TextInput,
  Textarea,
  Tooltip,
} from "@mantine/core";
import { DatePickerInput, TimeInput } from "@mantine/dates";
import moment from "moment";

import MyCalender from "./MyCalender.tsx";

import { IconMapPin } from "@tabler/icons-react";
import Header from "../Header/Header.tsx";
import "./SchedulePageMap.css";
import { motion as m } from "framer-motion";

//testing purposese but make sure to store the travelPlanID somewhere

////interface/////////

interface scheduleGoogle {
  googleMapsKeyId: string | undefined;
  latitude: number;
  longitude: number;
}

function SchedulePageMap(
  {
    /*props*/
  }
) {
  /////////////////////////////MAP STUFF//////////////////////////////////////
  //Map
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const mapRef = useRef<HTMLDivElement | null>(null);

  /////////AutoComplete For Input
  const [autoCompleteStart, setAutoCompleteStart] =
    useState<google.maps.places.Autocomplete | null>(null);
  const [autoCompleteEnd, setAutoCompleteEnd] =
    useState<google.maps.places.Autocomplete | null>(null);
  const autoCompleteStartRef = useRef<HTMLInputElement>();
  const autoCompleteEndRef = useRef<HTMLInputElement>();
  const [directionsService, setDirectionsService] =
    useState<google.maps.DirectionsService | null>(null);
  const [directionsRenderer, setDirectionsRenderer] =
    useState<google.maps.DirectionsRenderer | null>(null);
  const [travelMethod, setTravelMethod] = useState("DRIVING");
  const [originPositionID, setOriginPositionID] = useState<string>();
  const [destPositionID, setDestPositionID] = useState<string>();
  const [routes, setRoutes] = useState<google.maps.DirectionsRoute[]>([]);

  ////////////marker
  const [markerArray, setMarkerArray] = useState<google.maps.Marker[]>([]);

  //////////schedule constants/////////

  ////////////////////////////////////////////////////////////////////////////
  //////////////for backend
  const [scheduleDetails, setScheduleDetails] = useState({
    place: {
      googleMapsKeyId: "string",
      longitude: 0,
      latitude: 0,
    },
    id: "",
    travelPlanId: "",
    name: "test",
    description: "",
    isActuallyVisited: false,
    travelStartTimeEstimate: null,
    travelDepartTimeEstimate: null,
    previousScheduleId: null,
    nextScheduleId: null,
  });

  //This is a duplicate since our travelStartTime and travelDepartTime needs to be in String Format for API
  const [apiScheduleDetails, setApiScheduleDetails] = useState({
    place: {
      googleMapsKeyId: "string",
      longitude: 0,
      latitude: 0,
    },
    name: "test",
    description: "",
    isActuallyVisited: false,
    travelStartTimeEstimate: "",
    travelDepartTimeEstimate: "",
    previousScheduleId: null,
    nextScheduleId: null,
  });

  //creating of get location button with current location marker
  const googleMarker = new google.maps.Marker({
    map: map,
    title: "Current Pinned Location",
  });

  const infowindow = new google.maps.InfoWindow();

  /////////////useEffects///////////////
  //mounting of map and autocomplete
  useEffect(() => {
    //////////////
    const mapOptions = {
      center: {
        lat: 1,
        lng: 100,
      },
      zoom: 6,
      mapId: import.meta.env.VITE_NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    };

    const mapContainer = new google.maps.Map(
      mapRef.current as HTMLDivElement,
      mapOptions
    );

    setMap(mapContainer);

    const _autoCompleteStart = new google.maps.places.Autocomplete(
      autoCompleteStartRef.current as HTMLInputElement,
      { fields: ["place_id", "name", "formatted_address", "geometry"] }
    );
    const _autoCompleteEnd = new google.maps.places.Autocomplete(
      autoCompleteEndRef.current as HTMLInputElement,
      {
        fields: ["place_id", "name", "formatted_address", "geometry"],
      }
    );

    setAutoCompleteStart(_autoCompleteStart);
    setAutoCompleteEnd(_autoCompleteEnd);

    //////////////
    const directionsServices = new google.maps.DirectionsService();
    const directionsRenderers = new google.maps.DirectionsRenderer();
    setDirectionsService(directionsServices);
    setDirectionsRenderer(directionsRenderers);
    directionsRenderers.setMap(mapContainer);
  }, []);

  const locationButton = document.createElement("button");

  function deleteMarker() {
    markerArray.forEach((item) => {
      item.setMap(null);
    });
    markerArray;
    setMarkerArray([]);
  }
  useEffect(() => {
    locationButton.textContent = "Go to Current Location";
    //Style
    locationButton.style.fontSize = "1.5em";
    locationButton.style.marginTop = "10px";
    //
    if (map !== null) {
      //("current location button");
      map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
      if (locationButton) {
        locationButton.addEventListener("click", () => {
          if (navigator.geolocation) {
            //if browser has thios
            navigator.geolocation.getCurrentPosition((position) => {
              const currentPos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              };
              map.setCenter(currentPos);
              map.setZoom(16);
              googleMarker.setPosition(currentPos);
            });
          }
        });
      }
      googleMarker.addListener("click", () => {
        infowindow.setContent("Current Position");
        infowindow.open({
          anchor: googleMarker,
          map,
        });
      });
    }
  }, [map]);

  //autoComplete
  //(autoCompleteEnd); //this is the places in scheduleDetails that is Sent to our backend
  const [scheduleGooglePlaces, setScheduleGooglePlaces] =
    useState<scheduleGoogle>({
      googleMapsKeyId: "",
      longitude: 0,
      latitude: 0,
    });

  function calculateRoute(
    directionsService: google.maps.DirectionsService,
    directionsRenderer: google.maps.DirectionsRenderer
  ) {
    const originID = autoCompleteStart?.getPlace().place_id;
    const destID = autoCompleteEnd?.getPlace().place_id;
    const selectedMode = (document.getElementById("mode") as HTMLInputElement)
      .value as keyof typeof google.maps.TravelMode;
    originID;
    var request = {
      origin: { placeId: originID },
      destination: { placeId: destID },
      travelMode: google.maps.TravelMode[
        selectedMode
      ] as google.maps.TravelMode,
      provideRouteAlternatives: true, //always set to TRUE
    };
    directionsService.route(request, function (result, status) {
      if (status == "OK") {
        directionsRenderer.setDirections(result);
        if (result?.routes) {
          setRoutes(result.routes);
        } else {
          ("error getting route");
        }
      }
    });
  }
  //renders if there is directions to do
  useEffect(() => {
    if (originPositionID && destPositionID) {
      ("Complete locations");

      if (directionsService && directionsRenderer) {
        calculateRoute(directionsService, directionsRenderer);
        deleteMarker();
      }
    }
  }, [
    directionsService,
    directionsRenderer,
    travelMethod,
    originPositionID,
    destPositionID,
  ]);

  routes;

  useEffect(() => {
    if (autoCompleteEnd) {
      autoCompleteEnd.addListener("place_changed", () => {
        const endPlace = autoCompleteEnd.getPlace();
        const position = endPlace.geometry?.location;
        position;
        autoCompleteEnd.getPlace();
        autoCompleteEnd.getFields();
        if (position) {
          const dependentMarker = new google.maps.Marker({
            map: map,
            position: position,
          });
          ("check autocomplete");
          setMarkerArray((p) => [...p, dependentMarker]);
          if (endPlace.place_id) {
            setDestPositionID(endPlace.place_id);
            endPlace.place_id;
          }
          map.setCenter(position);
          map.setZoom(16);
          setScheduleGooglePlaces((p) => ({
            ...p,
            googleMapsKeyId: endPlace.place_id,
            latitude: position.lat(),
            longitude: position.lng(),
          }));
          setScheduleDetails((p) => ({
            ...p,
            place: {
              googleMapsKeyId: endPlace.place_id,
              latitude: position.lat(),
              longitude: position.lng(),
            },
          }));

          setApiScheduleDetails((p) => ({
            ...p,
            place: {
              googleMapsKeyId: endPlace.place_id,
              latitude: position.lat(),
              longitude: position.lng(),
            },
          }));
        }
        scheduleDetails;
      });
    }
    if (autoCompleteStart) {
      autoCompleteStart.addListener("place_changed", () => {
        //add Stuff here
        const startPlace = autoCompleteStart.getPlace();
        const startPosition = startPlace.geometry?.location;

        if (startPosition) {
          const dependentMarker = new google.maps.Marker({
            map: map,
            position: startPosition,
          });
          ("check autocomplete");
          setMarkerArray((p) => [...p, dependentMarker]);
          setOriginPositionID(startPlace.place_id);
          map.setCenter(startPosition);
          map.setZoom(16);
          ("check here for placesID");
        }
      });
    }
  });

  ////////////////////////FOR CREATING SCHEDULES////////////////////////////////////
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [scheduleName, setScheduleName] = useState<string>("");
  const [scheduleDescription, setScheduleDescription] = useState<string>("");
  const [event, setEvent] = useState([]);
  const [travelDay, setTravelDay] = useState<Date | null>(null);
  const [endTimePop, setEndTimePop] = useState(false);

  //check this lol it looks redundant
  useEffect(() => {}, [
    startTime,
    endTime,
    scheduleName,
    scheduleDescription,
    travelDay,
    endTimePop,
  ]);

  //create schedule button for form//
  const createScheduleButton = () => {
    //title
    //description

    //both are under the same day
    //String format
    const startDate = startTime;
    const endDate = endTime;
    /////Date format
    const chosenTravelday = moment(travelDay).format("YYYY-MM-DD");
    chosenTravelday;
    //Making startDate & endDate into format needed for event
    const startDateFormatted = moment(
      chosenTravelday + startDate,
      "YYYY-MM-DD hh:mm"
    );

    const endDateFormatted = moment(
      chosenTravelday + endDate,
      "YYYY-MM-DD hh:mm"
    );
    startDateFormatted;
    endDateFormatted;

    setScheduleDetails((p) => ({
      ...p,
      place: scheduleGooglePlaces,
      name: scheduleName,
      description: scheduleDescription,
      travelStartTimeEstimate: startDateFormatted.toDate(),
      travelDepartTimeEstimate: endDateFormatted.toDate(),
    }));

    setApiScheduleDetails((p) => ({
      ...p,
      place: scheduleGooglePlaces,
      name: scheduleName,
      description: scheduleDescription,
      travelStartTimeEstimate: moment(startDateFormatted.toDate()).format(
        "YYYY-MM-DDTHH:mm:ss"
      ),
      travelDepartTimeEstimate: moment(endDateFormatted.toDate()).format(
        "YYYY-MM-DDTHH:mm:ss"
      ),
    }));
  };

  //submit button//

  const handleSubmit = (e) => {
    e.preventDefault();
    scheduleDetails;
    //("json version is", JSON.stringify(scheduleDetails));
    //create duplicate;
    //FETCH API HERE!

    fetch(
      `${
        import.meta.env.VITE_APP_API_URL
      }/travelPlan/${travelID}/schedule/create_schedule`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(apiScheduleDetails),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        data;
        data.id;
        //this is async and may causes problems
        const newSchedule = {
          ...scheduleDetails,
          id: data.id,
          travelPlanId: data.travelPlanId,
        };
        setScheduleDetails((p) => newSchedule);
        setEvent((p) => [...p, newSchedule]);
      })
      .catch((error) => error);

    //("shecule aded");
    setScheduleDetails({
      id: "",
      travelPlanId: "",
      name: "",
      description: "",
      place: {
        googleMapsKeyId: "string",
        longitude: 0,
        latitude: 0,
      },
      isActuallyVisited: false,
      travelStartTimeEstimate: "",
      travelDepartTimeEstimate: "null",
      previousScheduleId: null,
      nextScheduleId: null,
    });
  };

  const [keepStart, setKeepStart] = useState(false);
  const [keepEnd, setKeepEnd] = useState(false);

  ////////////////testing purposes/////////////////////////
  //const travelPlanId = props.travelID;
  const url = window.location.search;
  const urlParams = new URLSearchParams(url);
  const travelID = urlParams.get(`id`);
  //("id travel is", travelID);

  const authToken = sessionStorage.getItem(`authToken`);

  const getAllSchedule = () => {
    //("authToken", authToken); this works but the call has an error itself
    fetch(
      `${
        import.meta.env.VITE_APP_API_URL
      }/travelPlan/${travelID}/schedule/search_all`,
      {
        method: "GET",
        headers: {
          //Accept: "application/json", // Optional: Explicitly requests JSON responses
          Authorization: `Bearer ${authToken}`,
        },
      }
    )
      .then((response) => response.json())
      .then(
        (data) => (
          //(data),
          data.forEach((items) => {
            items.travelStartTimeEstimate[1] =
              items.travelStartTimeEstimate[1] - 1;
            items.travelStartTimeEstimate = moment(
              items.travelStartTimeEstimate.slice(0, 5)
            ).toDate();
            items.travelDepartTimeEstimate[1] =
              items.travelDepartTimeEstimate[1] - 1;
            items.travelDepartTimeEstimate = moment(
              items.travelDepartTimeEstimate.slice(0, 5)
            ).toDate();
          }),
          setEvent(data)
          //("events taken from api are", data)
          //(moment(data[0].travelDepartTimeEstimate.slice(0, 5)))
        )
      )
      .catch((error) => error);
  };

  useEffect(() => {
    if (authToken) {
      getAllSchedule();
    }
  }, [authToken]);

  //("events", event);

  //(event);
  //("events directly are", event);
  return (
    <>
      <header>
        <Header></Header>
      </header>
      <body>
        <m.div
          initial={{ opacity: 0.1 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          exit={{ opacity: 1 }}
        >
          <Stack align="stretch" justify="space-between">
            <SimpleGrid cols={2}>
              <Center mt={10}>
                <form style={{}} onSubmit={handleSubmit}>
                  <Image
                    h={74}
                    w="auto"
                    src="/assets/Create Schedule.png"
                  ></Image>
                  <Space h={20}></Space>
                  <Input
                    mb={10}
                    placeholder="Name of Activity"
                    w={350}
                    value={scheduleName}
                    required
                    onChange={(e) => {
                      setScheduleName(e.currentTarget.value);
                      //(e.currentTarget.value);
                    }}
                  ></Input>
                  <Textarea
                    mb={10}
                    w={350}
                    placeholder="Activity Description"
                    value={scheduleDescription}
                    onChange={(e) => {
                      setScheduleDescription(e.currentTarget.value);
                      //(scheduleDescription);
                    }}
                  />
                  <Group mb={10}></Group>
                  <Group mb={10}>
                    <Input
                      leftSection={
                        <IconMapPin size={"15"} color="red"></IconMapPin>
                      }
                      required
                      w={350}
                      placeholder="Destination [Place Added to Schedules]"
                      ref={autoCompleteEndRef}
                      disabled={keepEnd}
                      rightSectionPointerEvents="all"
                      rightSection={
                        <Tooltip label="Press checkbox to Keep location on Map">
                          <Checkbox
                            checked={keepEnd}
                            onChange={(e) => {
                              setKeepEnd(e.currentTarget.checked);
                            }}
                          />
                        </Tooltip>
                      }
                    ></Input>
                  </Group>

                  <Group>
                    <TimeInput
                      w={167}
                      description="START"
                      required
                      id="startTime"
                      onChange={(e) => {
                        e.currentTarget.value;
                        const startTarget = e.currentTarget.value;
                        setStartTime(startTarget);
                      }}
                    />

                    <Popover
                      opened={endTimePop}
                      onChange={setEndTimePop}
                      position="right"
                      withArrow
                      shadow="md"
                    >
                      <Popover.Target>
                        <TimeInput
                          required
                          w={167}
                          description="END"
                          aria-label="endTime"
                          id="endTime"
                          onChange={(e) => {
                            e.currentTarget.value < startTime
                              ? (setEndTimePop(true),
                                setEndTime(e.currentTarget.value))
                              : (setEndTime(e.currentTarget.value),
                                "okie",
                                setEndTimePop(false));
                          }}
                        />
                      </Popover.Target>
                      <Popover.Dropdown>
                        <Text size="xs" c="red">
                          End time should be later than start time
                        </Text>
                      </Popover.Dropdown>
                    </Popover>
                  </Group>
                  <Group mt={10}>
                    <DatePickerInput
                      description="DAY"
                      id="day-select"
                      w={167}
                      allowDeselect
                      onChange={(e) => {
                        setTravelDay(e);
                      }}
                      value={travelDay}
                      required
                    />
                    <Button
                      className="schedule-button"
                      mt={17}
                      w={167}
                      //disabled={endTime < startTime || endTime === undefined}
                      type="submit"
                      radius="lg"
                      onClick={createScheduleButton}
                      variant="light"
                      c="cyan"
                    >
                      Create Schedule
                    </Button>
                  </Group>
                </form>
              </Center>
              <Stack>
                <Box h={400} ref={mapRef}></Box>
                <Flex justify="flex-start" align="center" gap="sm">
                  <TextInput
                    description="Start Location"
                    w={350}
                    placeholder="Start Location --> Check Distance"
                    ref={autoCompleteStartRef}
                    disabled={keepStart}
                    leftSection={
                      <IconMapPin size={"15"} color="green"></IconMapPin>
                    }
                    rightSectionPointerEvents="all"
                    rightSection={
                      <Tooltip label="Press checkbox to Keep location on Map">
                        <Checkbox
                          checked={keepStart}
                          onChange={(e) => {
                            setKeepStart(e.currentTarget.checked);
                            keepStart;
                          }}
                        />
                      </Tooltip>
                    }
                  ></TextInput>
                  <NativeSelect
                    id="mode"
                    onChange={(e) => setTravelMethod(e.target.value)}
                    w={150}
                    description="Method of Travel"
                    data={[
                      { label: "Driving", value: "DRIVING" },
                      { label: "Walking", value: "WALKING" },
                      { label: "Bicycling", value: "BICYCLING" },
                      { label: "Transit", value: "TRANSIT" },
                    ]}
                  ></NativeSelect>
                  <SimpleGrid cols={3}>
                    <Text size="md">Information: </Text>
                    <Text>{routes[0]?.legs[0]?.distance?.text}</Text>
                    <Text>{routes[0]?.legs[0]?.duration?.text}</Text>
                  </SimpleGrid>
                </Flex>
              </Stack>
            </SimpleGrid>
            <Divider size="sm" color="lavender" mt={5}></Divider>
            <div>
              <MyCalender
                h="auto"
                event={event}
                setEvents={setEvent}
                travelID={travelID}
                map={map}
                //currentLocation={currentLocation}
              ></MyCalender>
            </div>
          </Stack>
        </m.div>
      </body>
    </>
  );
}

export default SchedulePageMap;
