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
  Grid,
} from "@mantine/core";
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
