import React from "react";
import "./styles.css";
import GoogleMapWrapper from "../google/GoogleMapWrapper.tsx";
import { SiGo, SiGooglemaps } from "react-icons/si";
import { useState } from "react";

function Schedule() {
  const [origin, setOrigin] = useState();
  const [destination, setDestination] = useState();

  const handleDestinations = (e) => {
    e.preventDefault(); //prevents page from reloading everytime search button is pressed
    setOrigin(document.getElementById("from")?.value);
    setDestination(document.getElementById("to")?.value);
    //console.log(origin);
    //console.log(destination);
    //console.log(e.destination);
  };

  return (
    <div className="main-map">
      <form className="form-location">
        <div className="scheduler-schedule">
          <div className="scheduler-edit">
            <label className="start-logo" htmlFor="from">
              <SiGooglemaps></SiGooglemaps>
              <input
                className="f form-for"
                id="from"
                type="search"
                placeholder="Search Start Location Here"
                required
              ></input>
            </label>
            <label className="end-logo" htmlFor="to">
              <SiGooglemaps></SiGooglemaps>
              <input
                className="f form-to"
                id="to"
                type="search"
                placeholder="Search End-Location here"
                required
              ></input>
            </label>
            <br></br>
            <button className="btn btn-location" onClick={handleDestinations}>
              Search
            </button>
            <label>
              testing origin and location
              {origin}
            </label>
          </div>
        </div>
      </form>
      <div className="container-fluid">
        <div className="google-map" id="googleMap">
          <GoogleMapWrapper
            origins={origin}
            destinations={destination}
          ></GoogleMapWrapper>
          <h1>Map</h1>
        </div>
        <div id="output">.</div>
      </div>
    </div>
  );
}

export default Schedule;
