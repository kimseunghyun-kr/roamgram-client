import React from "react";
import "./styles.css";
import GoogleMapWrapper from "../google/GoogleMapWrapper.tsx";
import { SiGo, SiGooglemaps } from "react-icons/si";

function Schedule() {
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
                type="text"
                placeholder="Search Start Location Here"
              ></input>
            </label>
            <label className="end-logo" htmlFor="to">
              <SiGooglemaps></SiGooglemaps>
              <input
                className="f form-to"
                id="to"
                type="text"
                placeholder="Search End-Location here"
              ></input>
            </label>
            <br></br>
            <button className="btn btn-location">Search</button>
          </div>
        </div>
      </form>
      <div className="container-fluid">
        <div className="google-map" id="googleMap">
          <GoogleMapWrapper></GoogleMapWrapper>
          <h1>Map</h1>
        </div>
        <div id="output">testing here</div>
      </div>
    </div>
  );
}

export default Schedule;
