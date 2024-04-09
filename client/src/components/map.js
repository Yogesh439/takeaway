import React, { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import L from 'leaflet';
import 'leaflet-routing-machine';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const Map = () => {
  useEffect(() => {
    // Initialize Leaflet map
    const map = L.map('map').setView([27.679692, 85.330051], 13);
    
    // Specify the path to the default icon images
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconUrl: icon,
      shadowUrl: iconShadow
    });

    // Add tile layer
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    // Add marker
    // L.marker([27.679692, 85.330051]).addTo(map);

    // Add routing control
    L.Routing.control({
      waypoints: [
        L.latLng(27.679692, 85.330051),
        L.latLng(27.683083, 85.323265)
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
      <div id="map" style={{ height: '500px', width: '1000px', margin: 'auto', display: 'flex' }}></div>
    </div>
  );
};

export default Map;
