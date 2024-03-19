import React, { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import L from 'leaflet';
import 'leaflet-routing-machine';

const Map = () => {
  useEffect(() => {
    // Initialize Leaflet map
    const map = L.map('map').setView([51.505, -0.09], 13);

    // Add tile layer
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    // Add marker
    L.marker([51.5, -0.09]).addTo(map);

    // Add routing control
    L.Routing.control({
      waypoints: [
        L.latLng(57.74, 11.94),
        L.latLng(57.6792, 11.949)
      ]
    }).addTo(map);

    // Cleanup function
    return () => {
      map.remove();
    };
  }, []);

  return (
    <div>
      <h1>Map</h1>
      <div id="map" style={{ height: '500px', width: '100%', margin: 'auto', display: 'flex' }}></div>
    </div>
  );
};

export default Map;
