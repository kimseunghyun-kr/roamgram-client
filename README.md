# React + TypeScript + Vite

To run, clone this project and go to terminal and run the following commands
cd roamgram-client
npm install
npm run dev
To load scripts, create .env file at the root directory. .env file should consist of the following

VITE_NEXT_PUBLIC_GOOGLE_MAPS_API_KEY = ....
VITE_NEXT_PUBLIC_MAP_ID = ...
VITE_APP_API_URL = ...
VITE_APP_GOOGLE_LOGIN_URL = ...
Creating GOOGLE_MAPS_API_KEY & MAP_ID access:

https://console.cloud.google.com/project/_/google/maps-apis/credentials?utm_source=Docs_CreateAPIKey&utm_content=Docs_places-backend

click on CREATE CREDENTIALS => API_KEY and copy it into 1.
