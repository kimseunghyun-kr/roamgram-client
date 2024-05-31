import React from 'react';
import {createRoot} from 'react-dom/client';
import {APIProvider, Map} from '@vis.gl/react-google-maps';

//Google Map Viewer using the API Key from .env

function GoogleMapWrapper(){
    
    return(
        <APIProvider apiKey={'AIzaSyAidzQlt_sF0jc_V_qGQ6sYS28ValgjEpY'}>
            <Map
            style={{width: '80vw', height: '80vh'}}
            defaultCenter={{lat: 22.54992, lng: 0}}
            defaultZoom={3}
            gestureHandling={'greedy'}
            disableDefaultUI={false}
            />
        </APIProvider>
);
}

export default GoogleMapWrapper