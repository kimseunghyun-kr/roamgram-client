import { useJsApiLoader } from "@react-google-maps/api";
import "./App.css";
import GoogleMaps from "./components/GoogleMaps/GoogleMaps.tsx";
import { Loader } from "@googlemaps/js-api-loader";
import {
  MantineProvider,
  AppShell,
  Container,
  Image,
  Group,
  Button,
  Flex,
  Switch,
  NativeSelect,
  Grid,
  Center,
} from "@mantine/core";
import "@mantine/core/styles.css";

function App() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_NEXT_PUBLIC_GOOGLE_MAPS_API_KEY, //rmb to remove
    libraries: ["places", "maps", "core", "marker", "routes"],
    version: "weekly",
  });
  return (
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
  );
}
// {isLoaded ? <GoogleMaps></GoogleMaps> : <></>}
export default App;
