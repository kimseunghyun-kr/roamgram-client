// src/pages/MapPage.tsx
import React from 'react';
import MapComponent from '../components/map/MapComponent';

const SelectPlacePage: React.FC = () => {
    console.log(import.meta.env.VITE_APP_GOOGLE_KEY)
  return (
    <div>
      <h1>Map Page</h1>
      <MapComponent />
    </div>
  );
};

export default SelectPlacePage;
