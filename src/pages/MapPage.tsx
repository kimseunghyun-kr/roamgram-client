// src/pages/MapPage.tsx
import GoogleMaps from "../components/GoogleMaps/GoogleMaps.tsx";
import { Grid } from "@mantine/core";
import Header from "../components/Header/Header.tsx";

const MapPage = () => {
  return (
    <>
      <Header></Header>
      <Grid>
        <GoogleMaps></GoogleMaps>
      </Grid>
    </>
  );
};

export default MapPage;
