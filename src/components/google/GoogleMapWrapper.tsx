import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
} from "@vis.gl/react-google-maps";

import { useState } from "react";
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
        mapId={import.meta.env.VITE_NEXT_PUBLIC_MAP_ID}
      />
      <AdvancedMarker
        position={defaultPosition}
        onClick={() => setOpen(!open)}
      ></AdvancedMarker>
      {open && (
        <InfoWindow position={defaultPosition}>
          <p>Change accordingly</p>
        </InfoWindow>
      )}
    </APIProvider>
  );
}

export default GoogleMapWrapper;
