import { useJsApiLoader } from "@react-google-maps/api";
import ReviewsPage from "../components/ReviewsPage/ReviewsPage";

function LoadGoogleMapsDebug(googleMapsId) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: googleMapsId, //rmb to remove
    libraries: ["places", "maps", "core", "marker", "routes"],
    version: "weekly",
  });

  return isLoaded;
}

export default LoadGoogleMapsDebug;
