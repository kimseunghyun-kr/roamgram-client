import { useJsApiLoader } from "@react-google-maps/api";
import SchedulePageMap from "../components/schedulePage/SchedulePageMap";

function SchedulePageMapDebug() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_NEXT_PUBLIC_GOOGLE_MAPS_API_KEY, //rmb to remove
    libraries: ["places", "maps", "core", "marker", "routes"],
    version: "weekly",
  });
  return isLoaded ? <SchedulePageMap></SchedulePageMap> : null;
}

export default SchedulePageMapDebug;
