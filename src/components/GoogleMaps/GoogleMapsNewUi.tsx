import {
  Collapse,
  Container,
  Divider,
  Grid,
  NativeSelect,
  ScrollArea,
  SimpleGrid,
  Space,
  Stack,
  TextInput,
  Text,
  UnstyledButton,
  Group,
  Center,
  Title,
  Button,
  CheckIcon,
  Checkbox,
  Card,
  Tabs,
  Timeline,
  TimelineItem,
  Avatar,
  ThemeIcon,
} from "@mantine/core";
import { TimeInput } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import {
  IconArrowRight,
  IconBike,
  IconCar,
  IconClock,
  IconMapPin,
  IconTrain,
  IconWalk,
} from "@tabler/icons-react";
import moment from "moment";
import { useCallback, useEffect, useRef, useState } from "react";
import parse from "parse-duration";
import { motion as m } from "framer-motion";

function GoogleMapsNewUi() {
  //for origin textbox
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [autoComplete, setAutoComplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<String | null>(null);

  //for destination textbox
  const [autoCompleteDest, setAutoCompleteDest] =
    useState<google.maps.places.Autocomplete | null>(null);
  const [selectedPlaceDest, setSelectedPlaceDest] = useState<String | null>(
    null
  );

  //so it doesnt keep rerendering if we search two nearby locations
  const [searchedFilled, setSearchFilled] = useState<boolean>(false);

  const [originPositionID, setOriginPositionID] = useState<string>();
  const [destPositionID, setDestPositionID] = useState<string>();

  const [directionsService, setDirectionsService] =
    useState<google.maps.DirectionsService | null>(null);
  const [directionsRenderer, setDirectionsRenderer] =
    useState<google.maps.DirectionsRenderer | null>(null);

  //
  const [routes, setRoutes] = useState<google.maps.DirectionsRoute[]>([]);
  const [routeIndex, setRouteIndex] = useState(0);
  const selected = routes[routeIndex];
  const leg = selected?.legs[0]; //could be null

  //
  const [travelMethod, setTravelMethod] = useState("DRIVING");

  //check if loaded

  //so can just directly reference to our component
  const mapRef = useRef<HTMLDivElement>(null);
  //
  const placeAutoCompleteRef = useRef<HTMLInputElement>(null);
  const placeAutoCompleteRefDest = useRef<HTMLInputElement>(null);

  //
  const [time, setTime] = useState(
    `${new Date().getHours()}:${new Date().getMinutes()}`
  );
  const [arrivalTime, setArrivalTime] = useState(null);
  useEffect(() => {
    //mounts only if isLoaded is true
    const mapOptions = {
      //default map options
      //change to currentLocation in the future
      center: {
        lat: 25,
        lng: 30,
      },
      zoom: 8,
      mapId: import.meta.env.VITE_NEXT_PUBLIC_MAP_ID,
    };
    const mapContainer = new google.maps.Map( //save this reference using setMap
      mapRef.current as HTMLDivElement,
      mapOptions
    ); //sets new map instance

    //autocomplete
    const googleAutoComplete = new google.maps.places.Autocomplete( //new instance
      placeAutoCompleteRef.current as HTMLInputElement,
      { fields: ["formatted_address", "geometry", "name", "place_id"] } //Edit here to change setSelectedPlace properties
    );
    const googleAutoCompleteDest = new google.maps.places.Autocomplete(
      placeAutoCompleteRefDest.current as HTMLInputElement,
      {
        fields: ["formatted_address", "geometry", "name", "place_id"],
      }
    );
    ///////////////////////////////
    //ADD VARIABLES HERE THAT ARE AFTER LOADED SCRIPT
    ///////////////////////////////
    const directionsServices = new google.maps.DirectionsService();
    const directionsRenderers = new google.maps.DirectionsRenderer();
    setAutoComplete(googleAutoComplete);
    setAutoCompleteDest(googleAutoCompleteDest);
    setMap(mapContainer);
    directionsRenderers.setMap(mapContainer);
    setDirectionsService(directionsServices);
    setDirectionsRenderer(directionsRenderers);
    setTravelMethod("DRIVING"); //initialize with driving travel mode as our default

    //
    //setDirectionsService(new google.maps.DirectionsService());
    //setDirectionsRenderer(new google.maps.DirectionsRenderer());
    //setDirectionsRenderer.setMap(mapContainer); //sets our directionRenderer to our map container instance
  }, []);

  // setting to current location general area //

  const [locations, setLocations] = useState({ lat: 0, lng: 0 });

  useEffect(() => {
    if (map !== null) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const currentPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          map.setCenter(currentPos);
          map.setZoom(16);
          //googleMarker.setPosition(currentPos);
          //googleMarker.setVisible(false);
          setLocations(currentPos);
        });
      }
    }
  }, [map]);

  //runs after every rerender
  //const locations = { lat: 25, lng: 30 }; //change this eventually lol

  useEffect(() => {
    if (autoComplete) {
      //autocomplete not null(our search bar)
      autoComplete.addListener("place_changed", () => {
        //from documentation
        const place = autoComplete.getPlace();
        setSelectedPlace(place.formatted_address as string); //here you can select the address phone number revieews etc
        //replace place. with whatever we need and check console

        const position = place.geometry?.location;

        if (position) {
          //add marker is non-empty position
          //originMarker.setPosition(position);
          setOriginPositionID(place.place_id);
        }

        if (!searchedFilled) {
          //if (map && position) {
          //map.setCenter(position); //location given to center
          //map.setZoom(16);
          //}
          setSearchFilled(!searchedFilled);
        }
      });
    }
    if (autoCompleteDest) {
      autoCompleteDest.addListener("place_changed", () => {
        //remember its place_changed
        const dest = autoCompleteDest.getPlace();

        console.log("this is our dest");
        console.log({ dest });
        setSelectedPlaceDest(dest.formatted_address as string);

        const positionDest = dest.geometry?.location;
        if (positionDest) {
          //setMarkerDest(positionDest, dest.name!); //if dest.name is not null, we set a marker
          //destMarker.setPosition(positionDest);
          setDestPositionID(dest.place_id);
          console.log("check here for placesID");
          console.log(autoCompleteDest?.getPlace().place_id);
          console.log(autoComplete?.getPlace().place_id);
        }
      });
    }
  });

  function calculateRoute(
    directionsService: google.maps.DirectionsService,
    directionsRenderer: google.maps.DirectionsRenderer
  ) {
    const originID = autoComplete?.getPlace()?.place_id;
    const destID = autoCompleteDest?.getPlace()?.place_id;
    // const selectedMode = (document.getElementById("mode") as HTMLInputElement)
    //   .value as keyof typeof google.maps.TravelMode;
    const selectedMode = travelMethod;
    console.log(originID);
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
          console.log("resuts routes", result.routes);
        } else {
          console.log("error getting route");
        }
      }
    });
  }

  useEffect(() => {
    if (!originPositionID || !destPositionID) {
      console.log("Directions services not initialized yet if this runs.");
      return;
    }

    // Assuming the IDs are fetched or defined correctly outside of this block
    console.log("Directions Service running now!");
    // const travelMethodString = (
    //   document.getElementById("mode") as HTMLInputElement
    // ).value;
    if (originPositionID && destPositionID) {
      //   console.log(travelMethodString);
      console.log("Complete locations");
      if (directionsService && directionsRenderer) {
        calculateRoute(directionsService, directionsRenderer);
      }
    }
  }, [
    travelMethod,
    originPositionID,
    destPositionID,
    directionsService,
    directionsRenderer,
  ]);

  const showDetailedRoute = useCallback(() => {}, [routeIndex]);

  //Get the general distance between the two locations

  const setRouteCallback = useCallback(() => {
    if (!directionsRenderer) return; //early return

    directionsRenderer.setRouteIndex(routeIndex);
    console.log(selected);
  }, [routeIndex, directionsRenderer]);

  useEffect(() => {
    setRouteCallback();
  }, [setRouteCallback]);

  function getArrivalTime() {
    const departureTime = moment(time);
  }

  useEffect(() => {
    const departureTime = moment(time, "HH:mm");
    const timeTaken = leg?.duration?.value; //in seconds
    const arrival = departureTime.add(timeTaken, "seconds");
    setArrivalTime(arrival);
  }, [leg, time]);
  const [opened, { toggle }] = useDisclosure(false);

  return (
    <>
      <Grid.Col
        span="auto"
        style={{
          borderRight: "1px solid rgba(128, 128, 128, 0.5)",
        }}
      >
        <m.div
          initial={{ translateY: 40, opacity: 0 }}
          animate={{ translateY: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Container fluid h={190}>
            <Stack justify="center" align="center" mt={35} gap="xs">
              <Timeline bulletSize={30}>
                <TimelineItem
                  lineVariant="dashed"
                  bullet={
                    <ThemeIcon
                      variant="gradient"
                      radius="xl"
                      gradient={{ from: "teal", to: "lime", deg: 90 }}
                    >
                      <IconMapPin />
                    </ThemeIcon>
                  }
                >
                  <TextInput
                    w={310}
                    radius="lg"
                    ref={placeAutoCompleteRef}
                    placeholder="Enter Starting Location "
                  ></TextInput>
                </TimelineItem>
                <TimelineItem
                  lineVariant="dashed"
                  bullet={
                    <ThemeIcon
                      variant="gradient"
                      radius="xl"
                      gradient={{ from: "pink", to: "red", deg: 90 }}
                    >
                      <IconMapPin />
                    </ThemeIcon>
                  }
                >
                  <TextInput
                    radius="lg"
                    w={310}
                    ref={placeAutoCompleteRefDest}
                    placeholder="Enter Ending Location"
                  ></TextInput>
                </TimelineItem>
              </Timeline>

              {/* <SimpleGrid cols={2}> */}
              {/* <NativeSelect
                onChange={(e) => setTravelMethod(e.target.value)}
                id="mode"
                w={150}
                description="Method of Travel"
                data={[
                  { label: "Driving", value: "DRIVING" },
                  { label: "Walking", value: "WALKING" },
                  { label: "Bicycling", value: "BICYCLING" },
                  { label: "Transit", value: "TRANSIT" },
                ]}
              ></NativeSelect> */}

              <TimeInput
                variant="unstyled"
                leftSection={<IconClock size={17} />}
                style={{ borderBottom: "1px solid" }}
                mr="155"
                radius="xl"
                label="Depart At"
                value={moment(time, "HH:mm").format("HH:mm")}
                onChange={(e) => setTime(e.currentTarget.value)}
              ></TimeInput>
              {/* </SimpleGrid> */}
            </Stack>
          </Container>
          <Divider size="xs"></Divider>
          {/* <Space h="md"></Space> */}
          <Card>
            <Stack justify="center" align="center" gap="0">
              <Text size="lg" fw="bold">
                {selectedPlace}
              </Text>
              {placeAutoCompleteRef?.current?.value !== "" &&
              placeAutoCompleteRefDest?.current?.value !== "" ? (
                <IconArrowRight />
              ) : null}
              <Text size="lg" fw="bold">
                {selectedPlaceDest}{" "}
              </Text>
            </Stack>
            <Center>
              <Group>
                {/* <Text c="gray">
                Departing at: <b>{time}</b>
              </Text> */}
                <Text c="gray">
                  Arrival at:{" "}
                  {arrivalTime ? (
                    <b>{moment(arrivalTime).format("HH:mm")}</b>
                  ) : (
                    "null"
                  )}
                </Text>
              </Group>
            </Center>
          </Card>
          <Divider size="xs"></Divider>
          <ScrollArea mt={10} h={570}>
            <Container>
              {leg ? (
                <>
                  <Center mt={7}>
                    <Tabs
                      variant="pills"
                      color="indigo"
                      radius="lg"
                      defaultValue="DRIVING"
                      onChange={(e) => {
                        setTravelMethod(e);
                      }}
                    >
                      <Tabs.List>
                        <Tabs.Tab
                          value="DRIVING"
                          leftSection={<IconCar />}
                        ></Tabs.Tab>

                        <Tabs.Tab
                          value="WALKING"
                          leftSection={<IconWalk />}
                        ></Tabs.Tab>
                        <Tabs.Tab
                          value="BICYCLING"
                          leftSection={<IconBike />}
                        ></Tabs.Tab>
                        <Tabs.Tab
                          value="TRANSIT"
                          leftSection={<IconTrain />}
                        ></Tabs.Tab>
                      </Tabs.List>
                    </Tabs>
                  </Center>
                  <Stack>
                    <UnstyledButton onClick={toggle}>
                      <Stack align="center" mt={30}>
                        <Title style={{ fontFamily: "roboto" }}>
                          {" "}
                          {leg.duration?.text}
                        </Title>
                        <Text
                          style={{ fontSize: "20px", fontFamily: "roboto" }}
                        >
                          {leg.distance?.text}
                        </Text>
                        <Text c="blue" style={{ fontSize: "14px" }}>
                          Click for details
                        </Text>
                      </Stack>
                    </UnstyledButton>
                    <Divider />
                    <Collapse in={opened}>
                      <ScrollArea h={450}>
                        <Stack>
                          <Divider />
                          {leg.steps.map((step) => (
                            <>
                              <Text
                                pt={10}
                                pl={"60"}
                                size="md"
                                dangerouslySetInnerHTML={{
                                  __html: `${step.instructions} in ${step.distance.text}`,
                                }}
                              ></Text>
                              <Divider
                                pl={"40"}
                                w={"95%"}
                                label={
                                  <Text size="sm" fw="bold">
                                    {step.duration.text}
                                  </Text>
                                }
                                labelPosition="right"
                              />
                            </>
                          ))}
                        </Stack>
                      </ScrollArea>
                    </Collapse>
                  </Stack>
                </>
              ) : null}
            </Container>

            <Container>
              {routes.length > 1 ? (
                <>
                  <Center>
                    <Text
                      fw={900}
                      style={{ fontFamily: "roboto", fontSize: "30px" }}
                      p={15}
                    >
                      Other Routes
                    </Text>
                  </Center>
                  <Center>
                    <Group>
                      {routes.map((route, index) => (
                        <Button
                          variant="outline"
                          key={route.summary}
                          onClick={() => setRouteIndex(index)}
                        >
                          {route.summary}
                        </Button>
                      ))}
                    </Group>
                  </Center>
                </>
              ) : null}
            </Container>
          </ScrollArea>
        </m.div>
      </Grid.Col>
      <Grid.Col span={8.5} pt={0} pl={3}>
        <Container
          fluid
          style={{ height: "100vh" }}
          ref={mapRef}
          className="google-map-container"
        />
      </Grid.Col>
    </>
  );
}

export default GoogleMapsNewUi;
