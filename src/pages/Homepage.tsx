import { Carousel, CarouselSlide } from "@mantine/carousel";
import "@mantine/carousel/styles.css";
import {
  Box,
  Button,
  Card,
  Center,
  Chip,
  Container,
  Divider,
  Fieldset,
  Flex,
  Grid,
  GridCol,
  Group,
  Image,
  NativeSelect,
  Overlay,
  SimpleGrid,
  Space,
  Stack,
  Switch,
  Text,
  TextInput,
  UnstyledButton,
  rgba,
} from "@mantine/core";
import "@mantine/core/styles.css";
import { DatePickerInput } from "@mantine/dates";
import "@mantine/dates/styles.css";
import Autoplay from "embla-carousel-autoplay";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./HomePage.css";
import { IconBrandGithub, IconSearch } from "@tabler/icons-react";
import { useForm } from "@mantine/form";

const images = [
  "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-2.png",
  "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-3.png",
  "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-4.png",
  "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-5.png",
  "https://placehold.co/600x400?text=Placeholder",
  "https://placehold.co/600x400?text=Placeholder",
  "https://placehold.co/600x400?text=Placeholder",
  "https://placehold.co/600x400?text=Placeholder",
];

function HomePage() {
  //all the carousell stuff make edits below to the key!
  const slides = images.map((url, index) => (
    <Carousel.Slide key={index}>
      <Image src={url} />
    </Carousel.Slide>
  ));

  const slides2 = images.map((url, index) => (
    <Carousel.Slide key={index}>
      <Card shadow="sm" padding="lg" radius="md" withBorder w={470}>
        <Card.Section>
          <Image src={url} height={160}></Image>
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
  const [currentLocation, setCurrentLocation] = useState({});
  const mapRef = useRef<HTMLDivElement>(null);

  const googleMarker = new google.maps.Marker({
    map: map,
    title: "Current Pinned Location",
    icon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
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
      navigator.geolocation.getCurrentPosition((success) => {
        console.log("successful geolocation");
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
      //console.log("is Info Window set?");
      infowindow.setContent(`
      <div style="text-align: center;">
      <img src=${
        place.photos && place.photos.length > 0
          ? place.photos[0].getUrl()
          : null
      } style="width: 100px; height: auto;"></img>
      <div>${
        place.rating
          ? '<text size="xs">Rating: ' + place.rating + "</text>"
          : null
      }</div>
      <div>${
        place.name ? '<text size="xs">' + place.name + "</text>" : ""
      }</div>
      <div>${
        place.opening_hours
          ? `<text>${
              place.opening_hours.open_now
                ? "Currently Open"
                : "Currently Closed"
            }</text>`
          : ""
      }</div>
    </div>
    `);

      infowindow.open(map, marker);
    });
    setMarkerArray((p) => [...p, marker]);
  }
  function apiRequest(type_to_find: string) {
    deleteMarker();
    console.log("current location api", currentLocation);
    const request = {
      location: currentLocation as google.maps.LatLng,
      radius: 1000,
      type: type_to_find,
    };
    return serviceOn?.nearbySearch(request, (results, status) => {
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

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      name: "",
      dateRange: [null, null],
    },
    validate: {
      name: (value) => (value.length > 0 ? null : "Invalid Name"),
      dateRange: (value) =>
        value[0] !== null && value[1] !== null ? null : "Invalid Date",
    },
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const authToken = sessionStorage.getItem(`authToken`);
    if (authToken) {
      setIsLoggedIn(true);
    }
    console.log("logged in?", isLoggedIn);
  });

  const navigate = useNavigate();

  return (
    <>
      <body>
        <Container fluid h={600} p="0">
          <Container fluid h={400} p="0">
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
                  fallbackSrc="assets/japan-background-night.png"
                ></Image>
              </CarouselSlide>
              {/*slides*/}
            </Carousel>
          </Container>
          <Overlay backgroundOpacity={0} h={600}>
            <Container fluid>
              <Grid overflow="hidden" grow pt="15" style={{ minWidth: 900 }}>
                <GridCol span={1.5}></GridCol>
                <Grid.Col span={6}>
                  <Stack align="center">
                    <Group gap="6em">
                      <li className="l-header-menu-list-child">
                        <Link to="/planner">Routes</Link>
                      </li>
                      <li className="l-header-menu-list-child">
                        <Link to="/travelPage">Travel Plans</Link>
                      </li>
                      <li className="l-header-menu-list-child">
                        <Link to="/reviews">Guide</Link>
                      </li>
                    </Group>
                    <Divider w={950} size="sm" mt={-16} />
                  </Stack>
                </Grid.Col>
                <Grid.Col span={1.5}>
                  <Group gap="xs" justify="center">
                    {!isLoggedIn ? (
                      <Link to="/login">
                        <Button
                          className="buttons-login"
                          w="11em"
                          radius="xl"
                          color="orange"
                        >
                          Login / Sign up
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        className="header-logout"
                        radius="xl"
                        color={"orange"}
                        style={{ fontSize: "13px" }}
                        onClick={() => {
                          sessionStorage.removeItem(`authToken`);
                          sessionStorage.removeItem(`refreshToken`);
                          navigate(0);
                        }}
                      >
                        Log Out
                      </Button>
                    )}
                  </Group>
                </Grid.Col>
              </Grid>
            </Container>
            <Flex h={450} justify="flex-end" align="center" direction="column">
              <Center>
                <Image
                  w="auto"
                  h="90px"
                  src="assets/roamgram with white.png"
                  mb={20}
                ></Image>
              </Center>
              <Space></Space>
              <Center>
                <Fieldset c="white" variant="filled" h={76} w={800} radius="lg">
                  {/* change to form eventually :) */}

                  <form
                    onSubmit={form.onSubmit(
                      (values) => (
                        console.log(values),
                        navigate("/travelPage"),
                        sessionStorage.setItem(
                          "HomePageTravel",
                          JSON.stringify(values)
                        )
                      )
                    )}
                  >
                    <Flex justify="center" align="center" gap="lg">
                      <TextInput
                        //value={planName}
                        //onChange={(e) => {
                        //  setPlanName(e.target.value);
                        //}}
                        key={form.key("name")}
                        {...form.getInputProps("name")}
                        placeholder="Input Name"
                        description="PLAN NAME"
                        variant="unstyled"
                        styles={{
                          input: { fontSize: "17px" },
                          description: { height: "7px" },
                        }}
                      ></TextInput>
                      <Divider
                        orientation="vertical"
                        h={50}
                        color="steelblue"
                      ></Divider>
                      <DatePickerInput
                        key={form.key("dateRange")}
                        {...form.getInputProps("dateRange")}
                        //value={dateRange}
                        //onChange={(e) => (setDateRange(e), console.log(e))}
                        variant="unstyled"
                        type="range"
                        description="DATES"
                        placeholder="Choose Date"
                        w={300}
                        styles={{
                          input: { fontSize: "16px" },
                          description: { height: "7px" },
                        }}
                      ></DatePickerInput>
                      <Divider
                        orientation="vertical"
                        h={50}
                        color="steelblue"
                      ></Divider>

                      <Button
                        type="submit"
                        variant="filled"
                        mt={7}
                        color="#487D2E"
                        leftSection={<IconSearch size={24} />}
                        style={{ fontSize: "16px" }}
                        radius="md"
                      >
                        Enter
                      </Button>
                    </Flex>
                  </form>
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
              src="assets/Explore Nearby.png"
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
                <Chip value="food"> Food </Chip>
                <Chip value="shopping_mall">Mall</Chip>
                <Chip value="tourist_attraction">Tourist attractions</Chip>
                <Chip value="restaurant">Restaurants</Chip>

                <Chip value="supermarket">Supermarket</Chip>
                <Chip value="parking">Parking</Chip>
                <Chip value="ath">ATM</Chip>
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
                src="assets/Guide.png"
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
              <Divider mt={5} size="sm" color="black"></Divider>
            </Grid.Col>
          </Grid>

          <Container w={1950} fluid mt="25">
            <Carousel
              withIndicators
              height={260}
              slideSize="23.5%"
              slideGap="sm"
              loop
              align="start"
              slidesToScroll={4}
              plugins={[autoplay.current]}
            >
              {slides2}
            </Carousel>
          </Container>
        </Container>
      </body>
      <footer className="footer">
        <Divider
          labelPosition="center"
          label={
            <>
              <UnstyledButton
                component="a"
                href="https://github.com/kimseunghyun-kr/roamgram"
              >
                <img height="50" src="/assets/github-mark.png"></img>
              </UnstyledButton>
            </>
          }
        ></Divider>
        <Stack align="center" mt={14}>
          <Text size="xs" c="gray">
            Tolentino Alexandra Morales and Kim Seung Hyun
          </Text>
          <Text size="xs" c="gray">
            Orbital 2024
          </Text>
          <Space h={0}></Space>
        </Stack>
      </footer>
    </>
  );
}

export default HomePage;
