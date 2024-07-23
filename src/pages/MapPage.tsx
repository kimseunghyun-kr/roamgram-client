// src/pages/MapPage.tsx
import GoogleMaps from "../components/GoogleMaps/GoogleMaps.tsx";
import { Container, Grid } from "@mantine/core";
import Header from "../components/Header/Header.tsx";
import GoogleMapsNewUi from "../components/GoogleMaps/GoogleMapsNewUi.tsx";

const MapPage = () => {
  return (
    <>
      <header>
        <Header></Header>
      </header>
      <body>
        <Container fluid p={0} mt={7.5}>
          <Grid>
            <GoogleMapsNewUi></GoogleMapsNewUi>
          </Grid>
        </Container>
      </body>
    </>
  );
};

export default MapPage;
