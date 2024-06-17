import { useState, useRef } from "react";
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
} from "@mantine/core";
import Autoplay from "embla-carousel-autoplay";
import { DatePickerInput } from "@mantine/dates";
import "@mantine/core/styles.css";
import "@mantine/carousel/styles.css";
import "@mantine/dates/styles.css";
import "./HomePage.css";
import { Carousel, CarouselSlide } from "@mantine/carousel";
import React from "react";
import { Link } from "react-router-dom";

const images = [
  "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-2.png",
  "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-3.png",
  "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-4.png",
  "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-5.png",
  "https://placehold.co/600x400?text=Placeholder",
  "https://placehold.co/600x400?text=Placeholder",
  "https://placehold.co/600x400?text=Placeholder",
];

function HomePage() {
  //all the carousell stuff
  const slides = images.map((url) => (
    <Carousel.Slide key={url} w="100%">
      <Image src={url} />
    </Carousel.Slide>
  ));
  const autoplay = useRef(Autoplay({ delay: 6000 }));
  /////
  return (
    <>
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
                fallbackSrc="https://placehold.co/600x400?text=Placeholder"
              ></Image>
            </CarouselSlide>
            {/*slides*/}
          </Carousel>
        </Container>
        <Overlay backgroundOpacity={0} h={600}>
          <Grid grow pt="15">
            <Grid.Col span={4}></Grid.Col>
            <Grid.Col span={4}>
              <Group justify="center" gap="5em">
                <li className="l-header-menu-list-child">
                  <Link to="/travelPage">Routes</Link>
                </li>
                <li className="l-header-menu-list-child">
                  <Link to="maps">Map</Link>
                  <Link to="/schedulePage">Schedule</Link>
                </li>
                <li className="l-header-menu-list-child">
                  <a href="Book">Booking</a>
                </li>
              </Group>
            </Grid.Col>
            <Grid.Col span={4}>
              <Group gap="xs" justify="flex-end">
                <Button w="5.5em" radius="xl" color="violet">
                  Login
                </Button>
                <Button w="6.8em" radius="xl" color="violet">
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
                  variant="unstyled"
                  className="language-button"
                ></NativeSelect>
              </Group>
            </Grid.Col>
          </Grid>
          <Flex h={450} justify="flex-end" align="center" direction="column">
            <Center>
              <Image
                w="auto"
                h="90px"
                src="\components\assets\RoamGram Logo.png"
                mb={20}
              ></Image>
            </Center>
            <Space></Space>
            <Center>
              <Fieldset variant="filled" w={800} radius="xl">
                {/* change to form eventually :) */}
                <Flex justify="center" align="center" gap="xl">
                  <TextInput
                    placeholder="Input Name"
                    description="NAME "
                  ></TextInput>
                  <Divider
                    orientation="vertical"
                    size="md"
                    color="steelblue"
                  ></Divider>
                  <DatePickerInput
                    type="range"
                    description="DATES"
                    placeholder="Choose Date"
                    w={250}
                  ></DatePickerInput>
                  <Divider
                    orientation="vertical"
                    size="md"
                    color="steelblue"
                  ></Divider>
                  <NumberInput
                    description="TRAVELLERS"
                    min={1}
                    placeholder="Num"
                    w={80}
                  ></NumberInput>
                  <Button mt={20}>Enter</Button>
                </Flex>
              </Fieldset>
            </Center>
          </Flex>
        </Overlay>
      </Container>
      <Container fluid h={700} mt="50">
        <Image
          h={79}
          w="auto"
          src="components\assets\Explore Nearby.png"
          ml={50}
          mb={20}
        ></Image>
        {/* Put Map Here*/}
        <Center>
          <AspectRatio ratio={16 / 5}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3025.3063874233135!2d-74.04668908358428!3d40.68924937933441!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25090129c363d%3A0x40c6a5770d25022b!2sStatue%20of%20Liberty%20National%20Monument!5e0!3m2!1sen!2sru!4v1644262070010!5m2!1sen!2sru"
              title="Google map"
              style={{ border: 0 }}
              height={500}
            />
          </AspectRatio>
        </Center>
      </Container>
      <Container h={300} fluid>
        <Image
          h={71}
          w="auto"
          src="\components\assets\Guide.png"
          ml={50}
          mb={20}
        ></Image>
        <Carousel
          withIndicators
          height={200}
          slideSize="20%"
          slideGap="sm"
          loop
          align="start"
          slidesToScroll={3}
          plugins={[autoplay.current]}
        >
          {slides}
        </Carousel>
      </Container>
      <Container></Container>
      <Container mt="50" fluid>
        <Image
          ml={50}
          mb={20}
          h={79}
          w="auto"
          src="\components\assets\Booking.png"
        ></Image>
      </Container>
    </>
  );
}

export default HomePage;
