// src/pages/MapPage.tsx
import React from 'react';
import MapComponent from '../components/MapComponent';

const MapPage: React.FC = () => {
    console.log(process.env.REACT_APP_GOOGLE_KEY)
  return (
    <div>
      <h1>Map Page</h1>
      <MapComponent />
    </div>
  );
};

export default MapPage;
