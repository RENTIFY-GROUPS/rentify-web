import React, { useEffect, useRef } from 'react';
import { MarkerClusterer } from '@googlemaps/markerclusterer';

const MapComponent = ({ properties }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerClusterer = useRef(null);

  useEffect(() => {
    const loadGoogleMapsScript = () => {
      if (window.google && window.google.maps) {
        initMap();
        return;
      }
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&libraries=marker`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      document.head.appendChild(script);
    };

    const initMap = () => {
      if (!mapRef.current) return;

      const defaultCenter = { lat: 9.0820, lng: 8.6753 };
      mapInstance.current = new window.google.maps.Map(mapRef.current, {
        center: defaultCenter,
        zoom: 6,
      });

      markerClusterer.current = new MarkerClusterer({ map: mapInstance.current, markers: [] });
      updateMarkers(properties);
    };

    loadGoogleMapsScript();

    return () => {
      if (markerClusterer.current) {
        markerClusterer.current.clearMarkers();
      }
    };
  }, []);

  useEffect(() => {
    if (mapInstance.current && markerClusterer.current) {
      updateMarkers(properties);
    }
  }, [properties]);

  const updateMarkers = (props) => {
    const newMarkers = [];
    props.forEach(property => {
      if (property.latitude && property.longitude) {
        const marker = new window.google.maps.marker.AdvancedMarkerElement({
          position: { lat: property.latitude, lng: property.longitude },
          title: property.title,
        });
        newMarkers.push(marker);
      }
    });
    markerClusterer.current.clearMarkers();
    markerClusterer.current.addMarkers(newMarkers);
  };

  return <div ref={mapRef} style={{ height: '500px', width: '100%' }} className="rounded-lg shadow-md"></div>;
}; 

export default MapComponent;
