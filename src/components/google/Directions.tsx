import { useState, useEffect } from "react";
import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";

function Directions(props) {
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
  const [originLocation, setOriginLocation] = useState();
  const [destLocation, setDestLocation] = useState();

  console.log(props.destination);

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
        origin: props.origin,
        destination: props.destination,
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
  console.log(document.getElementById("to"));

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

export default Directions;
