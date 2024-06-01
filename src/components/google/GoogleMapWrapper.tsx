import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";

import { useState, useEffect } from "react";
//Google Map Viewer using the API Key from .env

function GoogleMapWrapper() {
  const defaultPosition = { lat: 22.54992, lng: 0 };
  const [open, setOpen] = useState(false);

  return (
    <APIProvider apiKey={import.meta.env.VITE_NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
      <Map
        style={{ width: "80vw", height: "80vh" }}
        defaultCenter={defaultPosition}
        defaultZoom={8}
        gestureHandling={"greedy"}
        disableDefaultUI={true}
        fullscreenControl={false} //turns off fullscreen mode
        mapId={import.meta.env.VITE_NEXT_PUBLIC_MAP_ID} //this is just for styles for mapID
      >
        <Directions></Directions>
      </Map>
      <AdvancedMarker
        position={defaultPosition}
        onClick={() => setOpen(!open)}
      ></AdvancedMarker>
      {open && (
        <InfoWindow
          position={defaultPosition}
          onCloseClick={() => {
            setOpen(false);
          }}
        >
          <p>Change accordingly</p>
        </InfoWindow>
      )}
    </APIProvider>
  );
}

function Directions() {
  const map = useMap();
  const routesLibrary = useMapsLibrary("routes");
  const [directionsService, setDirectionsService] =
    useState<google.maps.DirectionsService>();
  const [directionsRenderer, setDirectionsRenderer] =
    useState<google.maps.DirectionsRenderer>();
  const [routes, setRoutes] = useState<google.maps.DirectionsRoute[]>([]); //empty route

  const [routeIndex, setrouteIndex] = useState(0); //starts with first route
  const selectedRoute = routes[routeIndex];
  const leg = selectedRoute?.legs[0]; //chooses the leg property(check console routes)

  useEffect(() => {
    if (!routesLibrary || !map) return; //returns nothing if no map instance or routeslibrary
    setDirectionsService(new routesLibrary.DirectionsService());
    setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map }));
  }, [routesLibrary, map]);

  useEffect(() => {
    if (!directionsRenderer) return;
    directionsRenderer?.setRouteIndex(routeIndex);
  }, [routeIndex, directionsRenderer]);

  useEffect(() => {
    if (!directionsService || !directionsRenderer) return;

    directionsService
      .route({
        origin: document.getElementById("from").value,
        destination: document.getElementById("to").value,
        travelMode: google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: true,
      })
      .then((response) => {
        directionsRenderer.setDirections(response);
        setRoutes(response.routes);
      });
  }, [directionsService, directionsRenderer]);

  console.log(directionsService);
  console.log(routes);

  if (!leg) return null;
  return (
    <div className="directions">
      <h2>{selectedRoute.summary}</h2>
      <p>Starting point: {leg.start_address.split(",")[0]}</p>
      <p>Ending point: {leg.end_address.split(",")[0]}</p>
      <p>Distance: {leg.distance?.text} </p>
      <p>Duration: {leg.duration?.text}</p>
      <h3>Alternative Routes</h3>
      <ol>
        {routes.map((route, index) => (
          <li key={route.summary}>
            <button onClick={() => setrouteIndex(index)}>
              {route.summary}
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default GoogleMapWrapper;
