import {
  Button,
  Checkbox,
  Chip,
  Container,
  Input,
  Overlay,
  Textarea,
} from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { FloatingIndicator, UnstyledButton } from "@mantine/core";

function GoogleTesting() {
  ///Explore Nearby Locations///
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  const infowindow = new google.maps.InfoWindow();

  const [markerArray, setMarkerArray] = useState<google.maps.Marker[]>([]);

  function createMarker(place: google.maps.places.PlaceResult) {
    const marker = new google.maps.Marker({
      map,
      position: place.geometry?.location,
    });

    google.maps.event.addListener(marker, "click", () => {
      console.log("is Info Window set?");
      infowindow.setContent(
        `<img src = ${place.icon}></img> <text>${place.name}</text>`
      );

      infowindow.open(map, marker);
    });
    setMarkerArray((p) => [...p, marker]);
  }

  //console.log("new marker array", markerArray);
  //map initialization
  useEffect(() => {
    const mapOptions = {
      center: { lat: -33.8665433, lng: 151.1956316 },
      zoom: 15,
      mapId: import.meta.env.VITE_NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    };

    const mapContainer = new google.maps.Map(
      mapRef.current as HTMLDivElement,
      mapOptions
    );
    //console.log(map?.controls);
    setMap(mapContainer);
  }, []);

  const [type, setType] = useState<string>();
  const [serviceOn, setServiceOn] =
    useState<google.maps.places.PlacesService>();

  const pyrmont = new google.maps.LatLng(-33.8665433, 151.1956316);

  useEffect(() => {
    if (type) {
      apiRequest(type);
      console.log("type is", type);
    }
  }, [setType, type]);

  useEffect(() => {
    if (map) {
      const service = new google.maps.places.PlacesService(map);
      setServiceOn(service);

      /*
      service.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          console.log(results);
          results?.map((item) => {
            createMarker(item);
          });
        } else {
          console.log("nearby search is not working as expected");
        }
      });
      */
    }
  }, [map]);

  function apiRequest(type_to_find: string) {
    deleteMarker();
    const request = {
      location: pyrmont,
      radius: "400",
      type: [type_to_find],
    };
    return serviceOn.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        //console.log("Results below");
        //console.log(results);
        results?.map((item) => {
          createMarker(item);
        });
      } else {
        console.log("nearby search is not working as expected");
      }
    });
  }

  function deleteMarker() {
    markerArray.forEach((item) => {
      item.setMap(null);
    });
    console.log(markerArray);
    setMarkerArray([]);
  }

  return (
    <div>
      <Container h={500} ref={mapRef}></Container>
      <Chip.Group
        onChange={(e) => {
          setType(e as string);
          //deleteMarker();
          //apiRequest(e as string);
        }}
      >
        <Chip value="food"> food </Chip>
        <Chip value="shopping_mall">mall</Chip>
        <Chip value="tourist_attraction">tourist attractions</Chip>
        <Chip value="library">library</Chip>
      </Chip.Group>
    </div>
  );
}

export default GoogleTesting;
