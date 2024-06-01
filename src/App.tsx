import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import GoogleMapWrapper from "./components/google/GoogleMapWrapper.tsx";
import Header from "./components/Header/Header.tsx";
import Home from "./components/Home/Home.tsx";
import Schedule from "./components/Schedule/Schedule.tsx";
import Place from "./components/Place/Place.tsx";

function App() {
  return (
    <>
      <Header></Header>
      <Schedule></Schedule>
    </>
  );
}

export default App;
