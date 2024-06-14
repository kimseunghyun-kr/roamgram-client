import React, { useEffect, useRef, useState } from "react";

import {
  ActionIcon,
  Button,
  Container,
  Grid,
  Input,
  NativeSelect,
  Textarea,
} from "@mantine/core";
import { v4 as uuid } from "uuid";
import {
  DatePicker,
  DateTimePicker,
  DateValue,
  TimeInput,
} from "@mantine/dates";
import moment from "moment";
//testing purposese but make sure to store the travelPlanID somewhere
const travelPlanID = "1bfb5d9c-dd40-4e9e-b0f2-0492fda38c37";

function SchedulePageMap() {
  /////////////////////////////
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

  const [startTime, setStartTime] = useState<string>();
  const [endTime, setEndTime] = useState<string>();
  const [scheduleName, setScheduleName] = useState();
  const [scheduleDescription, setScheduleDescription] = useState();

  ///////////////////////////////////////////////////

  /////////////////functions//////////////////

  //setting Date format for start and endTime
  ////

  ///////////////////////////////////////

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
      console.log("current location button");
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

  //console test
  //
  console.log(startTime);
  console.log(endTime);

  //testing
  const [travelDay, setTravelDay] = useState<Date | null>(null);
  const [formattedTravelDay, setFormattedTravelDay] = useState<string>();

  const setTravelDayFunc = (e: Date) => {
    console.log("e is", { e });
    setTravelDay(e);

    const dateAsMoment = moment(e);
    const formattedDate = dateAsMoment.format("Y-MM-DD");
    setFormattedTravelDay(formattedDate);
  };
  //console.log("travel day is", { travelDay });
  //console.log("formatted date is", { formattedTravelDay });

  return (
    <>
      <Container fluid p="0">
        <Grid grow overflow="hidden">
          <Grid.Col span={7}>
            <Input placeholder="Name of Activity"></Input>
            <Textarea placeholder="add description of activity if needed" />
            <Input placeholder="start" ref={autoCompleteStartRef}></Input>
            <Input placeholder="End Location" ref={autoCompleteEndRef}></Input>
            <DatePicker onChange={setTravelDayFunc} value={travelDay} />
            <TimeInput
              description="start"
              id="startTime"
              onChange={(e) => {
                console.log(e.currentTarget.value);
                const startTarget = e.currentTarget.value + ":00";
                setStartTime(startTarget);
              }}
            />
            <TimeInput
              description="end"
              id="endTime"
              onChange={(e) => {
                console.log(e.currentTarget.value);
                const day = formattedTravelDay;
                if (day) {
                  const endTarget = day + "T" + e.currentTarget.value + ":00";
                  setEndTime(endTarget);
                } else {
                  alert("Choose Day");
                }
              }}
            />
            <NativeSelect
              data={[
                { value: "DRIVING", label: "Driving" },
                { value: "WALKING", label: "Walk" },
                { value: "TRANSIT", label: "Train" },
              ]}
            ></NativeSelect>
            <Button>Create Schedule</Button>
          </Grid.Col>
          <Grid.Col span={5} ref={mapRef} h={"50vh"}></Grid.Col>
        </Grid>
      </Container>
    </>
  );
}

export default SchedulePageMap;
