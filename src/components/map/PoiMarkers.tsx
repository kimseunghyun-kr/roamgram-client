import React from 'react';
import { AdvancedMarker, Pin } from '@vis.gl/react-google-maps';

type Poi = { key: string, location: google.maps.LatLngLiteral };

interface PoiMarkersProps {
  pois: Poi[];
}

const PoiMarkers: React.FC<PoiMarkersProps> = ({ pois }) => {
  return (
    <>
      {pois.map((poi) => (
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

export default PoiMarkers;
