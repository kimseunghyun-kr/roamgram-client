import React from "react";
import { createRoot } from "react-dom/client";
import { APIProvider, Map } from "@vis.gl/react-google-maps";

//Google Map Viewer using the API Key from .env

function GoogleMapWrapper() {
  return (
    <APIProvider apiKey={"AIzaSyAidzQlt_sF0jc_V_qGQ6sYS28ValgjEpY"}>
      <Map
        style={{ width: "80vw", height: "80vh" }}
        defaultCenter={{ lat: -33.860664, lng: 151.208138 }}
        defaultZoom={8}
        gestureHandling={"greedy"}
        disableDefaultUI={true}
        mapTypeId={google.maps.MapTypeId.ROADMAP}
      />
    </APIProvider>
  );
}

export default GoogleMapWrapper;
