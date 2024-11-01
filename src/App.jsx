import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  // Fetch all countries on component mount
  useEffect(() => {
    axios.get('https://crio-location-selector.onrender.com/countries')
      .then(response => setCountries(response.data))
      .catch(error => console.error("Error fetching countries:", error));
  }, []);

  // Fetch states when a country is selected
  useEffect(() => {
    if (selectedCountry) {
      axios.get(`https://crio-location-selector.onrender.com/country=${selectedCountry}/states`)
        .then(response => setStates(response.data))
        .catch(error => console.error("Error fetching states:", error));
      setCities([]);  // Reset cities
      setSelectedState('');  // Reset selected state
      setSelectedCity('');  // Reset selected city
    }
  }, [selectedCountry]);

  // Fetch cities when a state is selected
  useEffect(() => {
    if (selectedState) {
      axios.get(`https://crio-location-selector.onrender.com/country=${selectedCountry}/state=${selectedState}/cities`)
        .then(response => setCities(response.data))
        .catch(error => console.error("Error fetching cities:", error));
      setSelectedCity('');  // Reset selected city
    }
  }, [selectedState]);

  // Handle dropdown selections
  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value);
  };

  const handleStateChange = (event) => {
    setSelectedState(event.target.value);
  };

  const handleCityChange = (event) => {
    const city = event.target.value;
    setSelectedCity(city);
    setSelectedLocation(`You selected ${city}, ${selectedState}, ${selectedCountry}`);
  };

  return (
    <div>
      <h1>Select Location</h1>

      <label>Select Country:</label>
      <select onChange={handleCountryChange} value={selectedCountry}>
        <option value="">--Select Country--</option>
        {countries.map(country => (
          <option key={country} value={country}>{country}</option>
        ))}
      </select>

      <label>Select State:</label>
      <select onChange={handleStateChange} value={selectedState} disabled={!selectedCountry}>
        <option value="">--Select State--</option>
        {states.map(state => (
          <option key={state} value={state}>{state}</option>
        ))}
      </select>

      <label>Select City:</label>
      <select onChange={handleCityChange} value={selectedCity} disabled={!selectedState}>
        <option value="">--Select City--</option>
        {cities.map(city => (
          <option key={city} value={city}>{city}</option>
        ))}
      </select>

      {selectedLocation && <p>{selectedLocation}</p>}
    </div>
  );
}

export default App;
