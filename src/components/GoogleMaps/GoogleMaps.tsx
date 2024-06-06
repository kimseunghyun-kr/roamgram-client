import React, { useEffect, useRef, useState } from "react";
import { Grid } from "@mantine/core";

function GoogleMaps() {
  /*
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: "", //rmb to remove
    libraries: ["places", "maps", "core", "marker", "routes"],
    version: "weekly",
  });
  */
  console.log("run loaded");
  //for origin textbox
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [autoComplete, setAutoComplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<String | null>(null);

  //for destination textbox
  const [autoCompleteDest, setAutoCompleteDest] =
    useState<google.maps.places.Autocomplete | null>(null);
  const [selectedPlaceDest, setSelectedPlaceDest] = useState<String | null>(
    null
  );

  //so it doesnt keep rerendering if we search two nearby locations
  const [searchedFilled, setSearchFilled] = useState<boolean>(false);

  const [originPositionID, setOriginPositionID] = useState<string>();
  const [destPositionID, setDestPositionID] = useState<string>();

  const [directionsService, setDirectionsService] =
    useState<google.maps.DirectionsService | null>();
  const [directionsRenderer, setDirectionsRenderer] =
    useState<google.maps.DirectionsRenderer | null>();

  //
  const [routes, setRoutes] = useState<google.maps.DirectionsRoute[]>([]);
  const [routeIndex, setRouteIndex] = useState(0);
  const selected = routes[routeIndex];
  const leg = selected?.legs[0]; //could be null

  //
  const [travelMethod, setTravelMethod] = useState("DRIVING");

  //check if loaded

  //so can just directly reference to our component
  const mapRef = useRef<HTMLDivElement>(null);
  //
  const placeAutoCompleteRef = useRef<HTMLInputElement>();
  const placeAutoCompleteRefDest = useRef<HTMLInputElement>();
  //

  useEffect(() => {
    //mounts only if isLoaded is true
    const mapOptions = {
      //default map options
      //change to currentLocation in the future
      center: {
        lat: 25,
        lng: 30,
      },
      zoom: 8,
      mapId: import.meta.env.VITE_NEXT_PUBLIC_MAP_ID,
    };
    const mapContainer = new google.maps.Map( //save this reference using setMap
      mapRef.current as HTMLDivElement,
      mapOptions
    ); //sets new map instance

    //autocomplete
    const googleAutoComplete = new google.maps.places.Autocomplete( //new instance
      placeAutoCompleteRef.current as HTMLInputElement,
      { fields: ["formatted_address", "geometry", "name", "place_id"] } //Edit here to change setSelectedPlace properties
    );
    const googleAutoCompleteDest = new google.maps.places.Autocomplete(
      placeAutoCompleteRefDest.current as HTMLInputElement,
      {
        fields: ["formatted_address", "geometry", "name", "place_id"],
      }
    );
    ///////////////////////////////
    //ADD VARIABLES HERE THAT ARE AFTER LOADED SCRIPT
    ///////////////////////////////
    const directionsServices = new google.maps.DirectionsService();
    const directionsRenderers = new google.maps.DirectionsRenderer();
    setAutoComplete(googleAutoComplete);
    setAutoCompleteDest(googleAutoCompleteDest);
    setMap(mapContainer);
    directionsRenderers.setMap(mapContainer);
    setDirectionsService(directionsServices);
    setDirectionsRenderer(directionsRenderers);
    setTravelMethod("DRIVING"); //initialize with driving travel mode as our default

    //
    //setDirectionsService(new google.maps.DirectionsService());
    //setDirectionsRenderer(new google.maps.DirectionsRenderer());
    //setDirectionsRenderer.setMap(mapContainer); //sets our directionRenderer to our map container instance
  }, []);

  //runs after every rerender
  const locations = { lat: 25, lng: 30 }; //change this eventually lol

  useEffect(() => {
    const originMarker = new google.maps.Marker({
      map: map,
      position: locations, //change ty
      title: "Origin",
    });
    if (autoComplete) {
      //autocomplete not null(our search bar)
      autoComplete.addListener("place_changed", () => {
        //from documentation
        const place = autoComplete.getPlace();
        setSelectedPlace(place.formatted_address as string); //here you can select the address phone number revieews etc
        //replace place. with whatever we need and check console

        const position = place.geometry?.location;

        if (position) {
          //add marker is non-empty position
          originMarker.setPosition(position);
          setOriginPositionID(place.place_id);
        }

        if (!searchedFilled) {
          map.setCenter(position); //location given to center
          map.setZoom(16);
          setSearchFilled(!searchedFilled);
        }
      });
    }
  });

  useEffect(() => {
    const destMarker = new google.maps.Marker({
      map: map,
      position: locations,
      title: "Destination",
    });
    if (autoCompleteDest) {
      autoCompleteDest.addListener("place_changed", () => {
        //remember its place_changed
        const dest = autoCompleteDest.getPlace();

        console.log("this is our dest");
        console.log({ dest });
        setSelectedPlaceDest(dest.formatted_address as string);

        const positionDest = dest.geometry?.location;
        if (positionDest) {
          //setMarkerDest(positionDest, dest.name!); //if dest.name is not null, we set a marker
          destMarker.setPosition(positionDest);
          setDestPositionID(dest.place_id);
          console.log("check here for placesID");
          console.log(autoCompleteDest?.getPlace().place_id);
          console.log(autoComplete?.getPlace().place_id);
        }
        /*
        if (!searchedFilled) {
          console.log("CHECKER SEARCHED FILLED");
          map.setCenter(positionDest); //location given to center
          map.setZoom(16);
          setSearchFilled(true);
        }
        */
        //make some edits here
      });
    }
  });

  function calculateRoute(
    directionsService: google.maps.DirectionsService,
    directionsRenderer: google.maps.DirectionsRenderer
  ) {
    const originID = autoComplete?.getPlace().place_id;
    const destID = autoCompleteDest?.getPlace().place_id;
    const selectedMode = (document.getElementById("mode") as HTMLInputElement)
      .value;
    console.log(originID);
    var request = {
      origin: { placeId: originID },
      destination: { placeId: destID },
      travelMode: google.maps.TravelMode[selectedMode],
      provideRouteAlternatives: true, //always set to TRUE
    };
    directionsService.route(request, function (result, status) {
      if (status == "OK") {
        directionsRenderer.setDirections(result);
        console.log("routes");
        console.log(result?.routes);
        setRoutes(result?.routes);
        console.log({ routes });
      }
    });
  }

  useEffect(() => {
    if (!originPositionID || !destPositionID) {
      console.log("Directions services not initialized yet if this runs.");
      return;
    }

    // Assuming the IDs are fetched or defined correctly outside of this block
    console.log("Directions Service running now!");
    const travelMethodString = (
      document.getElementById("mode") as HTMLInputElement
    ).value;
    if (originPositionID && destPositionID) {
      console.log(travelMethodString);
      console.log("Complete locations");
      calculateRoute(directionsService, directionsRenderer);
    }
  }, [
    travelMethod,
    originPositionID,
    destPositionID,
    directionsService,
    directionsRenderer,
  ]);

  useEffect(() => {
    if (!directionsRenderer) return; //early return

    directionsRenderer.setRouteIndex(routeIndex);
  }, [routeIndex, directionsRenderer]);

  /*
  useEffect(() => {
    if (autoComplete !== null && autoCompleteDest !== null) {
      directionsService?.route(
        {
          origin: { placeId: autoComplete.getPlace().place_id },
          destination: { placeId: autoCompleteDest.getPlace().place_id },
          travelMode: google.maps.TravelMode.DRIVING,
        },
        function (result, status) {
          if (status == "OK") {
            directionsRenderer?.setDirections(result);
          }
        }
      );
    }
  }, [autoComplete, autoCompleteDest]);
  */
  /*
  
      if (autoComplete == null) {
        directionsService?.route(
          {
            origin: { placeId: autoComplete.getPlace().place_id },
            destination: { placeId: autoCompleteDest.getPlace().place_id },
            travelMode: google.maps.TravelMode.DRIVING,
          },
          function (result, status) {
            if (status == "OK") {
              directionsRenderer?.setDirections(result);
            }
          }
        );
      }
  */
  /*
  function setMarker(location: google.maps.LatLng, name: string) {
    if (!map) return; //if map not initialized
    //else we set to center

    map.setCenter(location); //location given to center
    map.setZoom(16); //sets zoom Level
    console.log({ location });
    const marker = new google.maps.Marker({
      map: map,
      position: location,
      title: "Origin",
    });
  }

  function setMarkerDest(location: google.maps.LatLng, name: string) {
    if (!map) return;
    const markerDest = new google.maps.Marker({
      map: map,
      position: location,
      title: "Destination",
    });
  }
  */
  return (
    <>
      <Grid.Col span="auto">
        <div>
          <label>From: </label>
        </div>
        <input ref={placeAutoCompleteRef} placeholder="From"></input>
        <br></br>
        <div>
          <label>To:</label>
        </div>
        <input ref={placeAutoCompleteRefDest} placeholder="To" required></input>
        <br></br>
        <div id="floating-panel">
          <b>Mode of Travel: </b>
          <select id="mode" onChange={(e) => setTravelMethod(e.target.value)}>
            <option value="DRIVING">Driving</option>
            <option value="WALKING">Walking</option>
            <option value="BICYCLING">Bicycling</option>
            <option value="TRANSIT">Transit</option>
          </select>
        </div>
        <label>Origin: {selectedPlace}</label>
        <br></br>
        <label>Destination: {selectedPlaceDest} </label>
        {leg ? (
          <>
            <p>Distance: {leg.distance?.text}</p>
            <p> Duration: {leg.duration?.text}</p>
          </>
        ) : (
          ""
        )}
        <h3>Alternative Routes to Choose</h3>
        <ul>
          {routes.map((route, index) => (
            <li key={route.summary}>
              <button onClick={() => setRouteIndex(index)}>
                {route.summary}
              </button>
            </li>
          ))}
        </ul>
      </Grid.Col>
      <Grid.Col span={7}>
        <div style={{ height: "100vh" }} ref={mapRef}></div>
      </Grid.Col>
    </>
  );
}

export default GoogleMaps;
