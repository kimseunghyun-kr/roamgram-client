import React from "react";

function GoogleMapsDirection(): void {
  const map = new google.maps.Map(
    document.getElementById("googleMap") as HTMLElement,
    {
      zoom: 7,
      center: { lat: 41.85, lng: -87.65 },
    }
  );

  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer();

  directionsRenderer.setMap(map);

  function calculateAndDisplayRoute(
    directionsService: google.maps.DirectionsService,
    directionsRenderer: google.maps.DirectionsRenderer
  ) {
    directionsService
      .route({
        origin: {
          query: (document.getElementById("from") as HTMLInputElement).value,
        },
        destination: {
          query: (document.getElementById("to") as HTMLInputElement).value,
        },
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC,
      })
      .then((response) => {
        directionsRenderer.setDirections(response);
      })
      .catch((e) => window.alert("Directions request failed due to " + status));
  }
}

var options = {
  types: ["(cities)"],
};

export default GoogleMapsDirection;
