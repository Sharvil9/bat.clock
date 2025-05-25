// --- Constants & Configuration ---
const API_KEY = 'e40951f785b14f5880361537252505'; // User-provided API key
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';
const ICON_URL_PREFIX = 'https://openweathermap.org/img/wn/';
const IP_GEOLOCATION_URL = 'https://ipapi.co/json/';

// --- DOM Elements (to be set by initWeather) ---
let locationDisplayElem = null;
let tempDisplayElem = null;
let descriptionDisplayElem = null;
let iconDisplayElem = null;
// cityInputElement and citySubmitButton are no longer needed

// --- Helper Functions ---
function updateWeatherDisplay(data) {
    console.log("Weather Widget: Updating display with data:", data);
    if (!data || !data.weather || !data.weather[0]) {
        if (locationDisplayElem) locationDisplayElem.textContent = 'Weather data unavailable.';
        if (tempDisplayElem) tempDisplayElem.textContent = '--°C';
        if (descriptionDisplayElem) descriptionDisplayElem.textContent = 'Could not fetch data.';
        if (iconDisplayElem) {
            iconDisplayElem.src = ''; // Clear src to trigger opacity: 0 via CSS
            iconDisplayElem.alt = 'Weather icon';
            // No longer setting display: none; CSS handles visibility via opacity based on [src=""]
        }
        return;
    }

    if (locationDisplayElem) locationDisplayElem.textContent = data.name || 'Current Location'; // data.name comes from OpenWeatherMap
    if (tempDisplayElem) tempDisplayElem.textContent = `${Math.round(data.main.temp)}°C`;
    if (descriptionDisplayElem) descriptionDisplayElem.textContent = data.weather[0].description;
    if (iconDisplayElem) {
        iconDisplayElem.alt = data.weather[0].description;
        iconDisplayElem.src = `${ICON_URL_PREFIX}${data.weather[0].icon}@2x.png`; // Setting src will trigger opacity transition via CSS
        // No longer setting display: block;
    }
}

async function fetchWeatherDataByCity(cityName) {
    console.log(`Weather Widget: Fetching weather data for city: ${cityName} using OpenWeatherMap.`);
    if (locationDisplayElem) locationDisplayElem.textContent = 'Loading weather...';
    if (iconDisplayElem) iconDisplayElem.src = ''; // Clear src to hide icon via opacity during loading

    const url = `${WEATHER_API_URL}?q=${encodeURIComponent(cityName)}&appid=${API_KEY}&units=metric`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            if (response.status === 401) throw new Error("Invalid OpenWeatherMap API key.");
            if (response.status === 404) throw new Error(`City "${cityName}" not found by OpenWeatherMap.`);
            throw new Error(`OpenWeatherMap API Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        updateWeatherDisplay(data);
    } catch (error) {
        console.error("Error fetching weather data from OpenWeatherMap:", error);
        if (locationDisplayElem) locationDisplayElem.textContent = 'Weather Error';
        if (tempDisplayElem) tempDisplayElem.textContent = '--°C';
        if (descriptionDisplayElem) descriptionDisplayElem.textContent = error.message || 'Could not fetch weather.';
        if (iconDisplayElem) iconDisplayElem.src = ''; // Clear src on error
    }
}

async function fetchWeatherByIP() {
    console.log("Weather Widget: Fetching IP geolocation data from ipapi.co...");
    if (locationDisplayElem) locationDisplayElem.textContent = 'Determining location...';
    if (iconDisplayElem) iconDisplayElem.src = ''; // Clear src to hide icon via opacity during loading

    try {
        const response = await fetch(IP_GEOLOCATION_URL);
        if (!response.ok) {
            throw new Error(`IP Geolocation API Error: ${response.status} ${response.statusText}`);
        }
        const geoData = await response.json();
        console.log("Weather Widget: Successfully received geolocation data:", geoData);

        if (geoData && geoData.city) {
            // Now fetch weather using the city from geolocation
            fetchWeatherDataByCity(geoData.city);
        } else if (geoData && geoData.latitude && geoData.longitude) {
            // Fallback to lat/lon if city is not available
            console.log(`Weather Widget: Geolocation found Lat: ${geoData.latitude}, Lon: ${geoData.longitude}. Fetching weather by coordinates.`);
            const lat = geoData.latitude;
            const lon = geoData.longitude;
            const url = `${WEATHER_API_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
            
            if (locationDisplayElem) locationDisplayElem.textContent = 'Loading weather...';
            const weatherResponse = await fetch(url);
            if (!weatherResponse.ok) {
                 if (weatherResponse.status === 401) throw new Error("Invalid OpenWeatherMap API key.");
                throw new Error(`OpenWeatherMap API Error (coords): ${weatherResponse.status} ${weatherResponse.statusText}`);
            }
            const weatherData = await weatherResponse.json();
            updateWeatherDisplay(weatherData);

        } else {
            throw new Error("Could not determine city or coordinates from IP geolocation data.");
        }
    } catch (error) {
        console.error("Error with IP geolocation or subsequent weather fetch:", error);
        if (locationDisplayElem) locationDisplayElem.textContent = 'Location Error';
        if (tempDisplayElem) tempDisplayElem.textContent = '--°C';
        if (descriptionDisplayElem) descriptionDisplayElem.textContent = error.message || 'Could not get weather.';
        if (iconDisplayElem) iconDisplayElem.src = ''; // Clear src on error
    }
}


// --- Public API ---
export function initWeather(config) {
    console.log("Weather Widget: Initializing with config:", config);
    // Store DOM elements from config
    locationDisplayElem = config.locationDisplay;
    tempDisplayElem = config.tempDisplay;
    descriptionDisplayElem = config.descriptionDisplay;
    iconDisplayElem = config.iconDisplay;
    // cityInputElement and citySubmitButton are no longer part of config

    if (!locationDisplayElem || !tempDisplayElem || !descriptionDisplayElem || !iconDisplayElem) {
        console.error("Weather widget display elements not correctly provided to initWeather.");
        return;
    }
    
    if (API_KEY === 'YOUR_API_KEY' || !API_KEY) { // Check if API key is still placeholder or empty
         console.error("Weather Widget: CRITICAL - API_KEY is a placeholder or missing. Please replace it with your actual OpenWeatherMap API key in js/weather.js.");
         if (locationDisplayElem) locationDisplayElem.textContent = "API Key Error";
         if (descriptionDisplayElem) descriptionDisplayElem.textContent = "Setup Required";
         if (tempDisplayElem) tempDisplayElem.textContent = "--°C";
         if (iconDisplayElem) iconDisplayElem.src = ''; // Clear src to hide
         return; // Stop initialization if API key is not set
    }

    // Fetch weather based on IP geolocation on load
    fetchWeatherByIP();
}
