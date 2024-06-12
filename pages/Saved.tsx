import React, { useEffect, useRef, useState } from "react";

function SchedulePageMap() {
  //map and mapref
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  //autoComplete
  const [autoComplete, setAutoComplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const placeAutoCompleteRef = useRef<HTMLInputElement>();

  //searchPlace of DESTINATION(we will store both start and destination but show only destination)
  const [selectedPlace, setSelectedPlace] = useState<string>("");

  //trravelMethod default to DRIVING
  const [travelMethod, setTravelMethod] = useState("DRIVING");

  //getting current location

  const [currentLocation, setCurrentLocation] = useState({
    lat: 0,
    lng: 0,
  });

  const [currentLocationSet, setCurrentLocationSet] = useState<boolean>(false);

  //currentLocationMarker

  //console.log(currentLocation);
  //console.log(currentLocationSet);

  //Mounts our initial map
  useEffect(() => {
    const mapOptions = {
      center: currentLocation,
      zoom: 14,
      mapId: import.meta.env.VITE_NEXT_PUBLIC_MAP_ID,
    };
    //const google instances
    const mapContainer = new google.maps.Map(
      mapRef.current as HTMLDivElement,
      mapOptions
    );

    //forms our autocomplete
    const autoCompletePlace = new google.maps.places.Autocomplete(
      placeAutoCompleteRef.current as HTMLInputElement,
      { fields: ["formatted_address", "geometry", "name", "place_id"] }
    );

    //setState
    setMap(mapContainer);
    setAutoComplete(autoCompletePlace);
    //console.log(currentLocationMarker.position);
  }, []);

  useEffect(() => {
    if (navigator.geolocation && currentLocationSet == false) {
      const currentGeoLoc = navigator.geolocation.getCurrentPosition(
        (success) => {
          //console.log(success);
          const LatLngLoc = {
            lat: success.coords.latitude,
            lng: success.coords.longitude,
          };
          setCurrentLocation(LatLngLoc);
          setCurrentLocationSet(true);
          map?.setCenter(LatLngLoc);
        }
      );
    }
  }, []);

  //this sets a marker at the location of the current person upon opening
  useEffect(() => {
    const currentLocationMarker = new google.maps.Marker({
      map,
      position: currentLocation,
      title: "Current Position",
    });
    //console.log(currentLocationMarker);
  }, [currentLocation]);

  return (
    <>
      <div style={{ height: "30vh" }} ref={mapRef}></div>
    </>
  );
}

export default SchedulePageMap;
