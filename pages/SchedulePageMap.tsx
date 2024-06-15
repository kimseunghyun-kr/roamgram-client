import React, { useCallback, useEffect, useRef, useState } from "react";

import {
  ActionIcon,
  Button,
  Container,
  Grid,
  Input,
  NativeSelect,
  Popover,
  Textarea,
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

//testing purposese but make sure to store the travelPlanID somewhere
const travelPlanID = "1bfb5d9c-dd40-4e9e-b0f2-0492fda38c37";
////interface/////////
interface Schedule {
  id: string;
  title: string;
  description: string;
  start: Date;
  end: Date;
}

function SchedulePageMap(props) {
  /////////////////////////////MAP STUFF//////////////////////////////////////
  //Map
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  /////////AutoComplete For Input
  const [autoCompleteStart, setAutoCompleteStart] =
    useState<google.maps.places.Autocomplete | null>(null);
  const [autoCompleteEnd, setAutoCompleteEnd] =
    useState<google.maps.places.Autocomplete | null>(null);
  const autoCompleteStartRef = useRef<HTMLInputElement>();
  const autoCompleteEndRef = useRef<HTMLInputElement>();
  ////////////
  //creating of get location button with current location marker
  const googleMarker = new google.maps.Marker({
    map: map,
    title: "Current Pinned Location",
  });
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
    //////////////
    const _autoCompleteStart = new google.maps.places.Autocomplete(
      autoCompleteStartRef.current as HTMLInputElement,
      { fields: ["place_id", "name", "formatted_address", "geometry"] }
    );
    const _autoCompleteEnd = new google.maps.places.Autocomplete(
      autoCompleteEndRef.current as HTMLInputElement,
      { fields: ["place_id", "name", "formatted_address", "geometry"] }
    );

    setAutoCompleteStart(_autoCompleteStart);
    setAutoCompleteEnd(_autoCompleteEnd);
  }, []);

  useEffect(() => {
    const locationButton = document.createElement("button");
    locationButton.textContent = "Go to Current Location";
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
    }
  }, [map]);

  //autoComplete
  useEffect(() => {
    if (autoCompleteEnd) {
      autoCompleteEnd.addListener("place_changed", () => {
        const endPlace = autoCompleteEnd.getPlace();
        const position = endPlace.geometry?.location;
        console.log("position", position);
        if (position) {
          console.log("check autocomplete");
          googleMarker.setPosition(position);
          map.setCenter(position);
        }
      });
    }
    if (autoCompleteStart) {
      autoCompleteStart.addListener("places_changed", () => {
        const startPlace = autoCompleteStart.getPlace();
        //add Stuff here
      });
    }
  });

  ////////////////////////////////////////////////////////////////////////////
  //////////////for backend
  const [scheduleDetails, setScheduleDetails] = useState({
    place: {
      id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      googleMapsKeyId: "string",
      name: "string",
      country: "string",
      visitedCount: 0,
      Latitude: 0,
      Longitude: 0,
      longitude: 0,
      latitude: 0,
    },
    isActuallyVisited: false,
    travelStartTimeEstimate: "2024-06-13T11:31:58.868Z",
    travelDepartTimeEstimate: "2024-06-13T11:31:58.868Z",
    previousScheduleId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    nextScheduleId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  });

  ////////////////////////FOR CREATING SCHEDULES////////////////////////////////////
  const [startTime, setStartTime] = useState<string>();
  const [endTime, setEndTime] = useState<string>();
  const [scheduleName, setScheduleName] = useState<string>();
  const [scheduleDescription, setScheduleDescription] = useState<string>();
  const [event, setEvent] = useState(props.eventsList);
  const [travelDay, setTravelDay] = useState<Date | null>(null);
  const [endTimePop, setEndTimePop] = useState(false);

  ///for testing to add new schedule using Create Schedule button
  const [addSchedule, setAddSchedule] = useState<Schedule>({
    id: uuid(),
    start: new Date(),
    end: new Date(),
    title: "", ////////change to title input
    description: "", ///////////change to text input
  });

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

    /// making addSchedule
    setAddSchedule((p) => ({
      ...p,
      start: startDateFormatted.toDate(),
      end: endDateFormatted.toDate(),
      title: scheduleName as string,
      description: scheduleDescription as string,
    }));
  };

  //submit button//
  const handleSubmit = (e) => {
    e.preventDefault();
    setEvent((p) => [...p, addSchedule]);
    setAddSchedule((p) => ({
      id: uuid(),
      start: new Date(),
      end: new Date(),
      title: "",
      description: "",
    }));
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Container fluid p="0">
          <Grid grow overflow="hidden">
            <Grid.Col span={7}>
              <Input
                required
                placeholder="Name of Activity"
                value={scheduleName}
                onChange={(e) => {
                  setScheduleName(e.currentTarget.value);
                  console.log(e.currentTarget.value);
                }}
              ></Input>
              <Textarea
                placeholder="add description of activity if needed"
                value={scheduleDescription}
                onChange={(e) => {
                  setScheduleDescription(e.currentTarget.value);
                  console.log(scheduleDescription);
                }}
              />
              <Input placeholder="start" ref={autoCompleteStartRef}></Input>
              <Input
                placeholder="End Location"
                ref={autoCompleteEndRef}
              ></Input>
              <DatePickerInput
                disabled={!scheduleName}
                allowDeselect
                onChange={(e) => {
                  setTravelDay(e);
                }}
                value={travelDay}
              />
              <TimeInput
                description="start"
                id="startTime"
                disabled={!travelDay}
                onChange={(e) => {
                  console.log(
                    "Start using currentTargetValue",
                    e.currentTarget.value
                  );
                  const startTarget = e.currentTarget.value;
                  setStartTime(startTarget);
                }}
              />

              <TimeInput
                disabled={!startTime}
                description="end"
                id="endTime"
                error={
                  endTimePop
                    ? "End Time Should be later than Start Time"
                    : false
                }
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
              <Button
                disabled={endTime < startTime || endTime === undefined}
                type="submit"
                onClick={createScheduleButton}
              >
                Create Schedule
              </Button>
            </Grid.Col>
            <Grid.Col span={5} ref={mapRef} h={"50vh"}></Grid.Col>
          </Grid>
        </Container>
      </form>
      <MyCalender event={event} setEvents={setEvent}></MyCalender>
    </>
  );
}

export default SchedulePageMap;
