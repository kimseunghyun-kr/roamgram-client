// src/pages/MapPage.tsx
import React from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import GoogleMaps from "../components/GoogleMaps/GoogleMaps.tsx";
import {
  MantineProvider,
  Center,
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

  return isLoaded ? <GoogleMaps></GoogleMaps> : <></>;
};

export default MapPage;
