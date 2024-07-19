// src/pages/MapPage.tsx
import GoogleMaps from "../components/GoogleMaps/GoogleMaps.tsx";
import { Grid } from "@mantine/core";
import Header from "../components/Header/Header.tsx";
import { useJsApiLoader } from "@react-google-maps/api";

const MapPageDebug = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_NEXT_PUBLIC_GOOGLE_MAPS_API_KEY, //rmb to remove
    libraries: ["places", "maps", "core", "marker", "routes"],
    version: "weekly",
  });

  return isLoaded ? (
    <>
      <Header></Header>
      <Grid>
        <GoogleMaps></GoogleMaps>
      </Grid>
    </>
  ) : null;
};

export default MapPageDebug;
