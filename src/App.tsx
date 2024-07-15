import "@bitnoi.se/react-scheduler/dist/style.css";
import "@mantine/carousel/styles.css";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import { useJsApiLoader } from "@react-google-maps/api";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import LoginPage from "./components/Login/LoginPage.tsx";
import SchedulePageMap from "./components/schedulePage/SchedulePageMap.tsx";
import TravelPlans from "./components/travelPage/TravelPlans.tsx";
import MapPage from "./pages/MapPage.tsx";
import GoogleLogin from "./components/Login/GoogleLogin.tsx";
import HomePage from "./pages/HomePage.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import ReviewsPage from "./components/ReviewsPage/ReviewsPage.tsx";
import { AuthProvider } from "./components/Login/AuthContext.tsx";
import DetailedReview from "./components/ReviewsPage/DetailedReview.tsx";
import TravelPlansNewUI from "./components/travelPage/TravelPlansNewUI.tsx";
import ConfirmEmail from "./components/Login/ConfirmEmail.tsx";
import { AnimatePresence, motion as m } from "framer-motion";
import SignUpPage from "./components/Login/SignUpPage.tsx";
import { Center, Container, Flex, Loader, Stack, Text } from "@mantine/core";
import YourReviews from "./components/ReviewsPage/YourReviews.tsx";

//reactQuery
const queryClient = new QueryClient();
const RoutesComponent = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/travelPage" element={<TravelPlansNewUI />} />
    <Route path="/schedulePage/travelID" element={<SchedulePageMap />} />
    <Route path="/planner" element={<MapPage />} />
    <Route path="/authSuccess" element={<GoogleLogin />} />
    <Route path="/loginSuccess" element={<ConfirmEmail />} />
    <Route path="/reviews" element={<ReviewsPage />} />
    <Route path="/reviews/id" element={<DetailedReview />} />
    <Route path="/signup" element={<SignUpPage />}></Route>
    <Route path="/your-reviews" element={<YourReviews />}></Route>
  </Routes>
);

function App() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_NEXT_PUBLIC_GOOGLE_MAPS_API_KEY, //rmb to remove
    libraries: ["places", "maps", "core", "marker", "routes"],
    version: "weekly",
  });
  //remember to change this!

  const location = useLocation();
  return isLoaded ? (
    <>
      <QueryClientProvider client={queryClient}>
        <div>
          <AnimatePresence key={location.pathname}>
            <AuthProvider>
              <RoutesComponent />
            </AuthProvider>
          </AnimatePresence>
        </div>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </>
  ) : (
    <>
      <Center mt={450}>
        <Stack>
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
          >
            <Text>Loading...</Text>
          </m.div>
          <Loader size={65}></Loader>
        </Stack>
      </Center>
    </>
  );
}

export default App;
