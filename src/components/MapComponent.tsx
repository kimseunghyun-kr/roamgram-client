import React, { useEffect, useState } from 'react';
import { AdvancedMarker, Map, MapCameraChangedEvent, Pin, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';

type Poi = { key: string, location: google.maps.LatLngLiteral };

const MapComponent: React.FC = () => {
  const initLocation: Poi[] = [
    { key: 'operaHouse', location: { lat: -33.8567844, lng: 151.213108 } },
  ];

  const [locations, setLocations] = useState(initLocation);

  const PoiMarkers = (props: { pois: Poi[] }) => {
    return (
      <>
        {props.pois.map((poi: Poi) => (
          <AdvancedMarker
            key={poi.key}
            position={poi.location}
          >
            <Pin background={'#FBBC04'} glyphColor={'#000'} borderColor={'#000'} />
          </AdvancedMarker>
        ))}
      </>
    );
  };

  const map = useMap();
  const placesLib = useMapsLibrary('places');

  useEffect(() => {
    if (!placesLib || !map) return;

    const svc = new placesLib.PlacesService(map);

    // Example of searching for places
    const request = {
      query: 'Museum of Contemporary Art Australia',
      fields: ['name', 'geometry'],
    };

    svc.findPlaceFromQuery(request, (results, status) => {
      if (status === placesLib.PlacesServiceStatus.OK && results) {
        for (let i = 0; i < results.length; i++) {
          const place = results[i];
          if (place.geometry && place.geometry.location) {
            console.log(place);
            console.log(place.name)
          }
        }

        const firstLocale = results[0];
        const firstLocation = firstLocale?.geometry?.location;

        if (firstLocation) {
          map.setCenter(firstLocation);
          setLocations(prevLocations => {
            return [...prevLocations, { key: firstLocale.name!, location: { lat: firstLocation.lat(), lng: firstLocation.lng() } }];
          });
        }
      }
    });
  }, [placesLib, map]);

  console.log(locations);

  return (
    <Map
      defaultZoom={13}
      defaultCenter={{ lat: -33.860664, lng: 151.208138 }}
      mapId='PLACE_SEARCH_MAP'
      onCameraChanged={(ev: MapCameraChangedEvent) =>
        console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom)
      }
      style={{ height: '100vh', width: '100%' }} // Adjust the style as needed
    >
      <PoiMarkers pois={locations} />
    </Map>
  );
};

export default MapComponent;
