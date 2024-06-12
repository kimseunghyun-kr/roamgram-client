import { useEffect, useRef, useState } from "react";

function SchedulePageMap() {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const [currentLocation, setCurrentLocation] = useState();

  //mounting of map
  useEffect(() => {
    const mapOptions = {
      center: {
        lat: 1,
        lng: 100,
      },
      zoom: 6,
      mapId: import.meta.env.VITE_NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    };

    const mapContainer = new google.maps.Map(
      mapRef.current as HTMLDivElement,
      mapOptions
    );
    setMap(mapContainer);
  }, []);

  //creating of get location button
  useEffect(() => {
    const locationButton = document.createElement("button");
    locationButton.textContent = "Go to Current Location";
    if (map !== null) {
      console.log("current location button");
      map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
      if (locationButton) {
        locationButton.addEventListener("click", () => {
          if (navigator.geolocation) {
            //if browser has thios
            navigator.geolocation.getCurrentPosition((position) => {
              const currentPos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              };
              map.setCenter(currentPos);
              map.setZoom(16);
            });
          }
        });
      }
    }
  }, [map]);

  return (
    <>
      <div ref={mapRef} style={{ height: "50vh", width: "50vh" }}></div>
    </>
  );
}

export default SchedulePageMap;
