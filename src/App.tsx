import { useJsApiLoader } from "@react-google-maps/api";
import "./App.css";
import GoogleMaps from "./components/GoogleMaps/GoogleMaps.tsx";
import { Loader } from "@googlemaps/js-api-loader";

function App() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_NEXT_PUBLIC_GOOGLE_MAPS_API_KEY, //rmb to remove
    libraries: ["places", "maps", "core", "marker", "routes"],
    version: "weekly",
  });
  return isLoaded ? <GoogleMaps></GoogleMaps> : <></>;
}

export default App;
