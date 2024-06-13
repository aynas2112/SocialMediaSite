import React, { useState, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1Ijoic2FueWFjaGF3bGEiLCJhIjoiY2x4Y2gyMWF1MmoweTJtc2NjZmRyMnY3ciJ9.kkaZbhKwYFQGe0f74Vt4HA'; // Replace with your Mapbox access token

const PlacesAutocomplete = ({ setLocation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const geocoderRef = useRef();

  const handleSearch = () => {
    // Example: Use Mapbox Geocoding API directly
    fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?access_token=${mapboxgl.accessToken}`)
      .then(response => response.json())
      .then(data => {
        if (data.features && data.features.length > 0) {
          setSuggestions(data.features.map(feature => ({
            place_name: feature.place_name,
            center: feature.center,
          })));
        } else {
          setSuggestions([]);
          console.error('No results found');
        }
      })
      .catch(error => {
        console.error('Error fetching search results:', error);
      });
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.length > 0) {
      handleSearch();
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (place_name, lng, lat) => {
    setLocation({ place_name, lng, lat });
    setSearchQuery(place_name);
    setSuggestions([]);
  };

  const renderSuggestions = () => {
    return (
      <ul className="mt-1 border border-gray-300 rounded bg-[#1B1B1B] absolute z-10 w-full max-h-60 overflow-y-auto">
        {suggestions.map((suggestion, index) => (
          <li
            key={index}
            className="px-4 py-2 cursor-pointer hover:bg-gray-100"
            onClick={() => handleSuggestionClick(suggestion.place_name, suggestion.center[0], suggestion.center[1])}
          >
            {suggestion.place_name}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="relative mt-4">
      <input
        type="text"
        value={searchQuery}
        onChange={handleInputChange}
        placeholder="Search Location"
        className="w-full p-2 border rounded bg-[#1B1B1B] text-white border-[#F1C40F] placeholder-custom"
      />
      {suggestions.length > 0 && renderSuggestions()}
    </div>
  );
};

export default PlacesAutocomplete;
