// src/pages/MapPage.tsx
import GoogleMaps from "../components/GoogleMaps/GoogleMaps.tsx";
import { Grid } from "@mantine/core";
import Header from "../components/Header/Header.tsx";
import GoogleMapsNewUi from "../components/GoogleMaps/GoogleMapsNewUi.tsx";

const MapPage = () => {
  return (
    <>
      <Header></Header>
      <Grid>
        <GoogleMapsNewUi></GoogleMapsNewUi>
      </Grid>
    </>
  );
};

export default MapPage;
