// src/pages/MapPage.tsx
import React from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import GoogleMaps from '../components/GoogleMaps/GoogleMaps';
import { MantineProvider, Center, Loader, Flex, Container, Group, Button, Image, Switch, NativeSelect } from '@mantine/core';

const MapPage = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_APP_GOOGLE_KEY,
    libraries: ['places', 'maps', 'core', 'marker', 'routes'],
    version: 'weekly',
  });

  return (
    <MantineProvider>
      <Flex justify="space-between" align="center" p="md">
        <Image src="src/assets/RoamGram Logo.png" h={45} w="auto" />
        <Container>
          <Group gap="xs">
            {/* <Button variant="link" href="/travelPlans">Home</Button>
            <Button variant="link" href="/create-travel-plan">Create Plan</Button>
            <Button variant="link" href="/travel-diary/schedules">Schedules</Button>
            <Button variant="link" href="/places-map">Select Place</Button>
            <Button variant="link" href="/map">Map</Button> */}
          </Group>
        </Container>
        <Group gap="xs">
          <Button>Login</Button>
          <Button>Register</Button>
          <Switch>Mode</Switch>
          <NativeSelect
            radius={1}
            data={['ENG', 'CHI', 'JPN', 'KR']}
            styles={{ input: { color: 'gray', border: 'none', textAlign: 'left' } }}
          />
        </Group>
      </Flex>
      {isLoaded ? (
        <GoogleMaps />
      ) : (
        <Center>
          <Loader />
        </Center>
      )}
    </MantineProvider>
  );
};

export default MapPage;
