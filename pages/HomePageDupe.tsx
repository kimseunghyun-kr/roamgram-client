import { useState, useRef, useEffect } from "react";
import {
  Container,
  Title,
  Button,
  Text,
  Grid,
  Card,
  Image,
  TextInput,
  Select,
  Flex,
  SimpleGrid,
  Switch,
  NativeSelect,
  Group,
  Box,
  BackgroundImage,
  Overlay,
  Space,
  Paper,
  Fieldset,
  Divider,
  NumberInput,
  Center,
  AspectRatio,
  Chip,
  rgba,
  UnstyledButton,
  Stack,
} from "@mantine/core";
import Autoplay from "embla-carousel-autoplay";
import { DatePicker, DatePickerInput } from "@mantine/dates";
import "@mantine/core/styles.css";
import "@mantine/carousel/styles.css";
import "@mantine/dates/styles.css";
import "./HomePage.css";
import { Carousel, CarouselSlide } from "@mantine/carousel";
import React from "react";
import { Link } from "react-router-dom";
import { IconSearch } from "@tabler/icons-react";

const images = [
  "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-2.png",
  "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-3.png",
  "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-4.png",
  "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-5.png",
  "https://placehold.co/600x400?text=Placeholder",
  "https://placehold.co/600x400?text=Placeholder",
  "https://placehold.co/600x400?text=Placeholder",
];

function HomePageDupe() {
  //all the carousell stuff make edits below to the key!
  const slides = images.map((url, index) => (
    <Carousel.Slide key={index}>
      <Image src={url} />
    </Carousel.Slide>
  ));

  const slides2 = images.map((url, index) => (
    <Carousel.Slide key={index}>
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Card.Section>
          <Image src={url} height={150}></Image>
        </Card.Section>
        <Text style={{ textAlign: "center" }}>Title</Text>
        <Text style={{ textAlign: "center" }}>Descripton</Text>
        <UnstyledButton style={{ textAlign: "center" }}>
          Check More Here
        </UnstyledButton>
      </Card>
    </Carousel.Slide>
  ));
  const autoplay = useRef(Autoplay({ delay: 6000 }));

  ///Explore Nearby Locations///
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [currentLocation, setCurrentLocation] = useState();
  const mapRef = useRef<HTMLDivElement>(null);

  const googleMarker = new google.maps.Marker({
    map: map,
    title: "Current Pinned Location",
  });
  //map initialization
  useEffect(() => {
    const mapOptions = {
      center: { lat: 1, lng: 100 },
      zoom: 15,
      mapId: import.meta.env.VITE_NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    };

    const mapContainer = new google.maps.Map(
      mapRef.current as HTMLDivElement,
      mapOptions
    );
    setMap(mapContainer);
  }, []);

  useEffect(() => {
    if (navigator.geolocation && map && googleMarker) {
      console.log("successful geolocation");
      navigator.geolocation.getCurrentPosition((success) => {
        const currentLoc = {
          lat: success.coords.latitude,
          lng: success.coords.longitude,
        };
        googleMarker.setPosition(currentLoc);
        map.setCenter(currentLoc);
        console.log(currentLoc);
        setCurrentLocation(currentLoc);
        console.log("curr loc state", currentLocation);
      });
    } else {
      console.log("unsuccecsful");
    }
  }, [map]);

  /////For NEARBY SEARCH SECTION///
  const [type, setType] = useState<string>();
  const [serviceOn, setServiceOn] =
    useState<google.maps.places.PlacesService>();

  const infowindow = new google.maps.InfoWindow();

  const [markerArray, setMarkerArray] = useState<google.maps.Marker[]>([]);

  function createMarker(place: google.maps.places.PlaceResult) {
    const marker = new google.maps.Marker({
      map,
      position: place.geometry?.location,
    });

    google.maps.event.addListener(marker, "click", () => {
      console.log("is Info Window set?");
      infowindow.setContent(
        `<img src = ${place.icon}></img> <text>${place.name}</text>`
      );

      infowindow.open(map, marker);
    });
    setMarkerArray((p) => [...p, marker]);
  }
  function apiRequest(type_to_find: string) {
    deleteMarker();
    console.log("current location api", currentLocation);
    const request = {
      location: currentLocation as google.maps.LatLng,
      radius: "500",
      type: [type_to_find],
    };
    return serviceOn.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        //console.log("Results below");
        //console.log(results);
        results?.map((item) => {
          createMarker(item);
        });
      } else {
        console.log("nearby search is not working as expected");
      }
    });
  }

  function deleteMarker() {
    markerArray.forEach((item) => {
      item.setMap(null);
    });
    console.log("delete marker Array", markerArray);
    setMarkerArray([]);
  }

  useEffect(() => {
    if (type) {
      apiRequest(type);
      console.log("type is", type);
    }
  }, [setType, type]);

  useEffect(() => {
    if (map) {
      const service = new google.maps.places.PlacesService(map);
      setServiceOn(service);

      /*
    service.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        console.log(results);
        results?.map((item) => {
          createMarker(item);
        });
      } else {
        console.log("nearby search is not working as expected");
      }
    });
    */
    }
  }, [map]);

  return (
    <>
      <Container fluid h={700} p="0">
        <Container fluid h={600} p="0">
          <Carousel
            plugins={[autoplay.current]}
            onMouseEnter={autoplay.current.stop}
            onMouseLeave={autoplay.current.reset}
            withControls={false}
            draggable={false}
            loop
          >
            <CarouselSlide>
              <Image
                h={600}
                style={{ minWidth: 1200 }}
                fallbackSrc="src\assets\japan-background-digital-art.jpg"
              ></Image>
            </CarouselSlide>
            {/*slides*/}
          </Carousel>
        </Container>
        <Overlay backgroundOpacity={0} h={600}>
          <Container fluid>
            <Grid overflow="hidden" grow pt="15" style={{ minWidth: 900 }}>
              <Grid.Col span={6.8}>
                <Group justify="flex-end" gap="5em">
                  <li className="l-header-menu-list-child">
                    <Link to="/travelPage">Guide</Link>
                  </li>
                  <li className="l-header-menu-list-child">
                    <Link to="/schedulePage">Routes</Link>
                  </li>
                  <li className="l-header-menu-list-child">
                    <a href="Book">Planner</a>
                  </li>
                </Group>
              </Grid.Col>
              <Grid.Col span={4}>
                <Group gap="xs">
                  <Button radius="md" className="buttons-login" color="violet">
                    Login
                  </Button>
                  <Button radius="md" className="buttons-login" color="violet">
                    Register
                  </Button>
                  <Switch
                    size="lg"
                    onLabel="Dark"
                    offLabel="Light"
                    color="dark.4"
                  />
                  <NativeSelect
                    w={"4em"}
                    data={["ENG", "KR", "JPN", "CHI", "ETC."]}
                    styles={{
                      input: { backgroundColor: "rgba(255, 255, 255, 0.5)" },
                    }}
                    variant="unstyled"
                    className="language-button"
                  ></NativeSelect>
                </Group>
              </Grid.Col>
            </Grid>
          </Container>
          <Flex h={450} justify="flex-end" align="center" direction="column">
            <Center>
              <Image
                w="auto"
                h="90px"
                src="src\assets\roamgram with white.png"
                mb={35}
              ></Image>
            </Center>
            <Space></Space>
            <Container style={{ zIndex: "1" }}>
              <Box
                w={300}
                h={40}
                style={{
                  backgroundColor: "white",
                  borderRadius: "40px",
                  textAlign: "center",
                  alignContent: "center",
                  top: "px",
                  position: "relative",
                  zIndex: "1",
                }}
              >
                <Text
                  style={{
                    fontFamily: "arial",
                    fontWeight: "bold",
                    fontSize: "15px",
                    zIndex: "2",
                    position: "relative",
                  }}
                >
                  Create Your Journey
                </Text>
              </Box>
            </Container>

            <Center style={{ zIndex: "1", position: "relative" }}>
              <Fieldset
                style={{
                  backgroundColor: "white",
                }}
                variant="filled"
                w={800}
                radius="lg"
              >
                {/* change to form eventually :) */}

                <Flex justify="center" align="flex-end" gap="xl" p={0}>
                  <TextInput
                    styles={{
                      description: {
                        fontFamily: "monospace",
                        fontSize: "1em",
                      },
                    }}
                    className="popup"
                    placeholder="Input Name"
                    description="PLAN NAME"
                    variant="unstyled"
                  ></TextInput>
                  <Divider
                    orientation="vertical"
                    size="lg"
                    h={40}
                    mt={20}
                    color="purple"
                  ></Divider>
                  <DatePickerInput
                    styles={{
                      description: {
                        fontFamily: "monospace",
                        fontSize: "1em",
                      },
                    }}
                    type="range"
                    description="DATES"
                    placeholder="Input Date"
                    variant="unstyled"
                    w={300}
                  ></DatePickerInput>
                  <Divider
                    orientation="vertical"
                    size="lg"
                    color="purple"
                    h={40}
                    mt={20}
                  ></Divider>

                  <Button
                    variant="filled"
                    color="#8A9A5B"
                    leftSection={<IconSearch size={19} />}
                    mt={20}
                  >
                    Enter
                  </Button>
                </Flex>
              </Fieldset>
            </Center>
          </Flex>
        </Overlay>
      </Container>
      <Container fluid h={700} mt="50">
        <SimpleGrid cols={2}>
          <Image
            h={79}
            w="auto"
            src="src\assets\Explore Nearby.png"
            ml={250}
            mb={20}
          ></Image>
          <Chip.Group
            onChange={(e) => {
              setType(e as string);
              //deleteMarker();
              //apiRequest(e as string);
            }}
          >
            <Group mt={35}>
              <Chip value="food"> food </Chip>
              <Chip value="shopping_mall">mall</Chip>
              <Chip value="tourist_attraction">tourist attractions</Chip>
              <Chip value="library">library</Chip>
              <Chip value="no">hotels</Chip>
              <Chip value="n2o">public transport</Chip>
              <Chip value="n1o">parking</Chip>
            </Group>
          </Chip.Group>
        </SimpleGrid>
        {/* Put Map Here*/}
        <Container ref={mapRef} fluid h={500} w={1370}></Container>
      </Container>
      <Container fluid h={350}>
        <Grid>
          <Grid.Col span={3}>
            <Image
              h={71}
              w="auto"
              src="src\assets\Guide.png"
              ml={250}
              mb={20}
            ></Image>
          </Grid.Col>
          <Grid.Col
            span="content"
            offset={3}
            style={{ alignContent: "center" }}
          >
            <Group gap="5em" mt={20}>
              <UnstyledButton>Nature</UnstyledButton>
              <UnstyledButton>Shopping</UnstyledButton>
              <UnstyledButton>Food</UnstyledButton>
              <UnstyledButton>Nightlife</UnstyledButton>
              <UnstyledButton>Travelling</UnstyledButton>
            </Group>
            <Divider mt={5} size="md" color="black"></Divider>
          </Grid.Col>
        </Grid>
        <div style={{ minWidth: 1000 }}>
          <Carousel
            withIndicators
            height={250}
            slideSize="30%"
            slideGap="sm"
            loop
            align="start"
            slidesToScroll={3}
            plugins={[autoplay.current]}
          >
            {slides}
          </Carousel>
        </div>
      </Container>
      <Container h={300} fluid mt="50">
        <Image
          h={71}
          w="auto"
          src="src\assets\Itinerary.png"
          ml={250}
          mb={20}
        ></Image>
        <Container fluid>
          <Container fluid w={1400}>
            <Carousel
              withIndicators
              height={300}
              slideSize="15%"
              slideGap="sm"
              loop
              align="start"
              slidesToScroll={3}
              plugins={[autoplay.current]}
            >
              {slides2}
            </Carousel>
          </Container>
        </Container>
      </Container>
      <Container></Container>
      <Container mt="50" fluid>
        <Image
          ml={250}
          mb={20}
          h={79}
          w="auto"
          src="src\assets\Booking.png"
        ></Image>
      </Container>
    </>
  );
}

export default HomePageDupe;