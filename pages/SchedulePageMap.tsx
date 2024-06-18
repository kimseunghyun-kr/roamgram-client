import React, { useCallback, useEffect, useRef, useState } from "react";

import {
  ActionIcon,
  Anchor,
  Button,
  Checkbox,
  Container,
  Grid,
  Input,
  NativeSelect,
  Popover,
  Text,
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

import TravelPage from "./TravelPage.tsx";
import { Link, Navigate } from "react-router-dom";

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

  console.log(event);
  //console.log("events directly are", event);
  return (
    <>
      <Container fluid p="0">
        <Button onClick={getAllSchedule}>Test</Button>
        <Link to="/">Click here to go back</Link>;
        <Grid grow overflow="hidden">
          <Grid.Col span={7}>
            <form onSubmit={handleSubmit}>
              <Input
                placeholder="Name of Activity"
                value={scheduleName}
                onChange={(e) => {
                  setScheduleName(e.currentTarget.value);
                  //console.log(e.currentTarget.value);
                }}
              ></Input>
              <Textarea
                placeholder="add description of activity if needed"
                value={scheduleDescription}
                onChange={(e) => {
                  setScheduleDescription(e.currentTarget.value);
                  //console.log(scheduleDescription);
                }}
              />
              <Input
                placeholder="Start Location --> Check Distance"
                ref={autoCompleteStartRef}
                disabled={keepStart}
              ></Input>
              <Input
                placeholder="Destination(Which is added as place to our schedule)"
                ref={autoCompleteEndRef}
                disabled={keepEnd}
              ></Input>
              <Text>For Checking distances between your locations</Text>
              <Checkbox
                label="Keep Start Destiantion"
                checked={keepStart}
                onChange={(e) => {
                  setKeepStart(e.currentTarget.checked);
                  console.log(keepStart);
                }}
              />
              <Checkbox
                label="Keep End Destination"
                checked={keepEnd}
                onChange={(e) => {
                  setKeepEnd(e.currentTarget.checked);
                }}
              />
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
            </form>
          </Grid.Col>

          <Grid.Col span={5} ref={mapRef} h={"50vh"}>
            TEST
          </Grid.Col>
        </Grid>
      </Container>

      <MyCalender
        event={event}
        setEvents={setEvent}
        map={map}
        travelPlanId={travelPlanId}
      ></MyCalender>
    </>
  );
}

export default SchedulePageMap;
