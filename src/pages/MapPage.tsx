// src/pages/MapPage.tsx
import React from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import GoogleMaps from "../components/GoogleMaps/GoogleMaps.tsx";
import {
    MantineProvider,
    Center,
    Grid,
    Loader,
    Flex,
    Container,
    Group,
    Button,
    Image,
    Switch,
    NativeSelect,
} from "@mantine/core";

const MapPage = () => {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_APP_GOOGLE_KEY,
        libraries: ["places", "maps", "core", "marker", "routes"],
        version: "weekly",
    });

    return isLoaded ? (
        <MantineProvider>
          <Flex>
            <Flex>
              <Image src="src\assets\RoamGram Logo.png" h={45} w="auto"></Image>
            </Flex>
            <Container>
              <Group gap="xs" grow>
                <div className="header-button">
                  <Button variant="transparent" size="xl">
                    Book
                  </Button>
                  <Button variant="transparent" size="xl">
                    Planner
                  </Button>
                  <Button variant="transparent" size="xl">
                    Route
                  </Button>
                </div>
              </Group>
            </Container>
            <Center>
              <Group gap="xs">
                <Button>Login</Button>
                <Button>Register</Button>
                <Switch>Mode</Switch>
                <NativeSelect
                  radius={1}
                  data={["ENG", "CHI", "JPN", "KR"]}
                  styles={{
                    input: { color: "gray", border: "none", textAlign: "left" },
                  }}
                ></NativeSelect>
              </Group>
            </Center>
          </Flex>
          <Grid>
            <GoogleMaps></GoogleMaps>
          </Grid>
        </MantineProvider>
      ) : (
        <></>
      );
};

export default MapPage;
