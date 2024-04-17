import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { setDistance, setPrice } from '../redux/reducers/distancePrice';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import L from 'leaflet';
import 'leaflet-routing-machine';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const Map = () => {
  const dispatch = useDispatch();
  const mapRef = useRef(null);
  const routingControlRef = useRef(null);

  useEffect(() => {
    // Initialize Leaflet map
    const map = L.map('map').setView([27.679692, 85.330051], 13);
    mapRef.current = map;

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

    // Add routing control
    const waypoints = [
      L.latLng(27.679692, 85.330051),
      L.latLng(27.683083, 85.323265)
    ];

    const routingControl = L.Routing.control({
      waypoints,
      routeWhileDragging: true, // Allows dragging the route line and updates the route dynamically
      lineOptions: {
        styles: [{ color: '#0078ff', weight: 6 }]
      }
    }).addTo(map);
    routingControlRef.current = routingControl;

    // Handle route change event to recalculate distance and price
    routingControl.on('routesfound', function(e) {
      const routes = e.routes;
      if (routes && routes.length > 0) {
        const distance = routes[0].summary.totalDistance / 1000; // Convert to kilometers
        const priceNPR = calculatePrice(distance);
        dispatch(setDistance(distance));
        dispatch(setPrice(priceNPR));
      }
    });

    // Cleanup function
    return () => {
      map.remove();
    };
  }, [dispatch]);

  // Function to calculate price based on distance
  const calculatePrice = (distance) => {
    // Define your pricing model here in Nepalese Rupees per kilometer
    const costPerKilometerNPR = 15; // Example: NPR 15 per kilometer
    return distance * costPerKilometerNPR;
  };

  return (
    <div>
      <h1>Map</h1>
      <div id="map" style={{ height: '500px', width: '1000px', margin: 'auto', display: 'flex' }}></div>
    </div>
  );
};

export default Map;
