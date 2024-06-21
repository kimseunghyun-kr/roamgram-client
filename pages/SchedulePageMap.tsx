import React, { useCallback, useEffect, useRef, useState } from "react";

import {
  ActionIcon,
  Anchor,
  AppShell,
  AspectRatio,
  Box,
  Button,
  Center,
  Checkbox,
  Container,
  Divider,
  Grid,
  Group,
  Input,
  NativeSelect,
  Popover,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  Tooltip,
  Image,
  Space,
} from "@mantine/core";
import { v4 as uuid } from "uuid";
import {
  DatePicker,
  DatePickerInput,
  DateTimePicker,
  DateValue,
  TimeInput,
} from "@mantine/dates";
import moment from "moment";

import MyCalender from "./MyCalender.tsx";

import TravelPage from "./TravelPage.tsx";
import { Link, Navigate } from "react-router-dom";
import "./SchedulePageMap.css";
import { IconMapPin } from "@tabler/icons-react";

//testing purposese but make sure to store the travelPlanID somewhere

////interface/////////

interface scheduleGoogle {
  googleMapsKeyId: string | undefined;
  latitude: number;
  longitude: number;
}

function SchedulePageMap(props) {
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
  ////////////

  //////////schedule constants/////////

  ////////////////////////////////////////////////////////////////////////////
  //////////////for backend
  const [scheduleDetails, setScheduleDetails] = useState({
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
  }, []);

  const locationButton = document.createElement("button");

  useEffect(() => {
    locationButton.textContent = "Go to Current Location";
    //Style
    locationButton.style.fontSize = "1.5em";
    locationButton.style.marginTop = "10px";
    //
    if (map !== null) {
      //console.log("current location button");
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
  //console.log(autoCompleteEnd); //this is the places in scheduleDetails that is Sent to our backend
  const [scheduleGooglePlaces, setScheduleGooglePlaces] =
    useState<scheduleGoogle>({
      googleMapsKeyId: "",
      longitude: 0,
      latitude: 0,
    });

  useEffect(() => {
    if (autoCompleteEnd) {
      autoCompleteEnd.addListener("place_changed", () => {
        const endPlace = autoCompleteEnd.getPlace();
        const position = endPlace.geometry?.location;
        console.log("position", position);
        console.log("end is", autoCompleteEnd.getPlace());
        console.log("fields", autoCompleteEnd.getFields());
        if (position) {
          console.log("check autocomplete");
          googleMarker.setPosition(position);
          if (endPlace.place_id) {
            console.log("id", endPlace.place_id);
          }
          map.setCenter(position);
          map?.setZoom(16);
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
        console.log("schedule details checking", scheduleDetails);
      });
    }
    if (autoCompleteStart) {
      autoCompleteStart.addListener("place_changed", () => {
        const startPlace = autoCompleteStart.getPlace();
        //add Stuff here
      });
    }
  });

  //console.log("schedule google palces is", scheduleGooglePlaces);

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
    console.log(chosenTravelday);
    //Making startDate & endDate into format needed for event
    const startDateFormatted = moment(
      chosenTravelday + startDate,
      "YYYY-MM-DD hh:mm"
    );

    const endDateFormatted = moment(
      chosenTravelday + endDate,
      "YYYY-MM-DD hh:mm"
    );
    console.log(startDateFormatted);
    console.log(endDateFormatted);

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
    console.log("schedule to api is", scheduleDetails);
    console.log("json version is", JSON.stringify(scheduleDetails));
    //create duplicate;
    //FETCH API HERE!
    fetch(
      `http://localhost:8080/travelPlan/${travelPlanId}/schedule/create_schedule`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_TOKEN}`,
        },
        body: JSON.stringify(apiScheduleDetails),
      }
    )
      .then((response) => response.json())
      .then((data) => console.log("success in adding"))
      .catch((error) => console.log("error in adding new schedule"));

    ////////////
    ///////////////////////
    setEvent((p) => [...p, scheduleDetails]);
    //console.log("shecule aded");
    setScheduleDetails({
      name: "",
      description: "",
      place: {
        googleMapsKeyId: "string",
        longitude: 0,
        latitude: 0,
      },
      isActuallyVisited: false,
      travelStartTimeEstimate: null,
      travelDepartTimeEstimate: null,
      previousScheduleId: null,
      nextScheduleId: null,
    });
  };

  const [keepStart, setKeepStart] = useState(false);
  const [keepEnd, setKeepEnd] = useState(false);

  ////////////////testing purposes/////////////////////////
  const travelPlanId = "d91cc99f-3f8c-44da-8747-08d16b08604c";
  const getAllSchedule = () => {
    fetch(
      `http://localhost:8080/travelPlan/${travelPlanId}/schedule/search_all`,
      {
        method: "GET",
        headers: {
          //Accept: "application/json", // Optional: Explicitly requests JSON responses
          Authorization: `Bearer ${import.meta.env.VITE_TOKEN}`,
        },
      }
    )
      .then((response) => response.json())
      .then(
        (data) => (
          //console.log(data),
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
          //console.log("events taken from api are", data)
          //console.log(moment(data[0].travelDepartTimeEstimate.slice(0, 5)))
        )
      )
      .catch((error) => console.log(error));
  };

  const checkValidForm = () => {};

  //console.log(event);
  //console.log("events directly are", event);
  return (
    <>
      <Stack align="stretch" justify="space-between">
        <SimpleGrid cols={2}>
          <Center mt={30}>
            <form style={{}} onSubmit={handleSubmit}>
              <Image
                h={74}
                w="auto"
                src="src\assets\Create Schedule.png"
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
                  //console.log(e.currentTarget.value);
                }}
              ></Input>
              <Textarea
                mb={10}
                w={350}
                placeholder="Activity Description"
                value={scheduleDescription}
                onChange={(e) => {
                  setScheduleDescription(e.currentTarget.value);
                  //console.log(scheduleDescription);
                }}
              />
              <Group mb={10}>
                <Input
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
                          console.log(keepStart);
                        }}
                      />
                    </Tooltip>
                  }
                ></Input>
              </Group>
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
                    console.log(
                      "Start using currentTargetValue",
                      e.currentTarget.value
                    );
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
                      id="endTime"
                      onChange={(e) => {
                        e.currentTarget.value < startTime
                          ? (console.log("less than start"),
                            setEndTimePop(true),
                            setEndTime(e.currentTarget.value))
                          : (setEndTime(e.currentTarget.value),
                            console.log("okie"),
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

          <Box ref={mapRef}></Box>
        </SimpleGrid>
        <Divider size="sm" color="lavender" mt={5}></Divider>
        <div>
          <MyCalender h="auto"></MyCalender>
        </div>
      </Stack>
    </>
  );
}

export default SchedulePageMap;
