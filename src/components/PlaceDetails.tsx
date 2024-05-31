import React from 'react';
import { Place } from '../types/Place';

interface PlaceDetailsProps {
  place: Place;
}

const PlaceDetails: React.FC<PlaceDetailsProps> = ({ place }) => {
  return (
    <div className="p-4 border rounded shadow my-4">
      <h2 className="text-xl font-bold">{place.name}</h2>
      <p>{place.country}</p>
      <p>Visited Count: {place.visitedCount}</p>
      {/* Additional place details can be rendered here */}
    </div>
  );
};

export default PlaceDetails;
