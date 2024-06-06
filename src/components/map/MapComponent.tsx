import React, { useState } from 'react';
import { Map, MapCameraChangedEvent, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import SearchBar from './LocationSearchBar';
import PoiMarkers from './PoiMarkers';

type Poi = { key: string, location: google.maps.LatLngLiteral };

const MapComponent: React.FC = () => {
  const [locations, setLocations] = useState<Poi[]>([]);
  const map = useMap();
  const placesLib = useMapsLibrary('places');

  const handleSearch = (query: string) => {
    if (!placesLib || !map) return;

    const svc = new placesLib.PlacesService(map);

    const request = {
      query: query,
      fields: ['name', 'geometry'],
    };

    
    svc.textSearch(request, (results, status) => {
      if (status === placesLib.PlacesServiceStatus.OK && results) {
        console.log(results)
        const newLocations = results.map((place) => (
          {
          key: place.place_id!,
          location: { lat: place.geometry!.location!.lat(), lng: place.geometry!.location!.lng() }
        }
    ));

        if (newLocations.length > 0) {
          map.setCenter(newLocations[0].location);
        }

        setLocations(newLocations);
      }
    });
  };

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <SearchBar onSearch={handleSearch} />
      <Map
        defaultZoom={13}
        defaultCenter={{ lat: -33.860664, lng: 151.208138 }}
        mapId='PLACE_SEARCH_MAP'
        onCameraChanged={(ev: MapCameraChangedEvent) =>
          console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom)
        }
        style={{ height: '100%', width: '100%' }}
      >
        <PoiMarkers pois={locations} />
      </Map>
    </div>
  );
};

export default MapComponent;
