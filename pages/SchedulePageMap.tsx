import React, { useEffect, useRef, useState } from "react";

const currentLocation = navigator.geolocation.getCurrentPosition(
  (position: GeolocationPosition) => {
    return { lat: position.coords.latitude, lng: position.coords.longitude };
  }
);
console.log(currentLocation);

function SchedulePageMap() {
  //map and mapref
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  //autoComplete
  const [autoComplete, setAutoComplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const placeAutoCompleteRef = useRef<HTMLInputElement>();

  //searchPlace
  const [selectedPlace, setSelectedPlace] = useState<string>("");

  //trravelMethod default to DRIVING
  const [travelMethod, setTravelMethod] = useState("DRIVING");

  //getting current location
  const [currentLocation, setCurrentLocation] = useState({
    lat: 0,
    lng: 0,
  });

  const [currentLocationChanged, setCurrentLocationChanged] =
    useState<boolean>(false);

  //get GeoLocation and do it only once(cause navigator SPAMS)
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          //console.log(position);
          const currentPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCurrentLocation(currentPos);
        }
      );
    }
    setCurrentLocationChanged(true);
  }, []);
  console.log(currentLocationChanged);

  //Mounts our initial map
  useEffect(() => {
    console.log(currentLocation);
    const mapOptions = {
      center: currentLocation,
      zoom: 14,
      mapId: import.meta.env.VITE_NEXT_PUBLIC_MAP_ID,
    };
    const mapContainer = new google.maps.Map(
      mapRef.current as HTMLDivElement,
      mapOptions
    );
    console.log(mapOptions.center);
    setMap(mapContainer);
  }, [currentLocationChanged]);

  return (
    <>
      <div style={{ height: "30vh" }} ref={mapRef}></div>
    </>
  );
}

export default SchedulePageMap;
