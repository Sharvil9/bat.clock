// js/weather.js

// --- Constants & Configuration ---
const API_KEY = 'e40951f785b14f5880361537252505'; // User-provided API key
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';
const ICON_URL_PREFIX = 'https://openweathermap.org/img/wn/';
const IP_GEOLOCATION_URL = 'https://ipapi.co/json/';

// --- DOM Elements (passed via config) ---
// These will hold the elements passed in the config object for the current instance.
let currentConfig = {};

// --- Helper Functions ---
function displayWeatherError(message) {
    console.warn("Weather display error:", message);
    if (currentConfig.tempDisplay) {
        currentConfig.tempDisplay.textContent = currentConfig.isCompact ? 'ERR' : '--°C';
    }
    if (currentConfig.iconDisplay) {
        currentConfig.iconDisplay.src = '';
        currentConfig.iconDisplay.alt = currentConfig.isCompact ? '' : 'Error';
    }
    // For non-compact mode, more detailed errors can be shown
    if (!currentConfig.isCompact) {
        if (currentConfig.locationDisplay) currentConfig.locationDisplay.textContent = 'Weather Error';
        if (currentConfig.descriptionDisplay) currentConfig.descriptionDisplay.textContent = message;
    }
}

function updateWeatherDisplay(data) {
    console.log("Weather Widget: Updating display with data:", data);
    if (!data || !data.weather || !data.weather[0] || !data.main) {
        displayWeatherError(currentConfig.isCompact ? 'Data?' : 'Weather data unavailable.');
        return;
    }

    if (currentConfig.tempDisplay) {
        currentConfig.tempDisplay.textContent = `${Math.round(data.main.temp)}°C`;
    }
    if (currentConfig.iconDisplay) {
        currentConfig.iconDisplay.alt = data.weather[0].description; // Alt text is good for accessibility
        currentConfig.iconDisplay.src = `${ICON_URL_PREFIX}${data.weather[0].icon}.png`; // Use smaller icon for compact
    }

    // Non-compact elements (only update if they exist in config)
    if (!currentConfig.isCompact) {
        if (currentConfig.locationDisplay) {
            currentConfig.locationDisplay.textContent = data.name || 'Current Location';
        }
        if (currentConfig.descriptionDisplay) {
            currentConfig.descriptionDisplay.textContent = data.weather[0].description;
        }
    }
}

async function fetchWeatherData(url, isGeoLookup = false) {
    // Initial text for compact display (very minimal)
    if (currentConfig.isCompact && currentConfig.tempDisplay) {
        currentConfig.tempDisplay.textContent = '...';
    }
    if (currentConfig.iconDisplay) currentConfig.iconDisplay.src = '';


    try {
        const response = await fetch(url);
        if (!response.ok) {
            if (response.status === 401) throw new Error("API Key Invalid"); // Compact error message
            if (response.status === 404 && !isGeoLookup) throw new Error("City Not Found");
            throw new Error(`API Err ${response.status}`); // Generic compact error
        }
        const data = await response.json();

        if (isGeoLookup) { // This was a geolocation call
            console.log("Weather Widget: Successfully received geolocation data:", data);
            if (data && data.city) {
                const weatherFetchUrl = `${WEATHER_API_URL}?q=${encodeURIComponent(data.city)}&appid=${API_KEY}&units=metric`;
                fetchWeatherData(weatherFetchUrl, false); // Now fetch weather for this city
            } else if (data && data.latitude && data.longitude) {
                const weatherFetchUrl = `${WEATHER_API_URL}?lat=${data.latitude}&lon=${data.longitude}&appid=${API_KEY}&units=metric`;
                fetchWeatherData(weatherFetchUrl, false); // Fetch weather by coords
            } else {
                throw new Error("No City/Coords");
            }
        } else { // This was a weather data call
            updateWeatherDisplay(data);
        }
    } catch (error) {
        console.error("Error in fetchWeatherData:", error.message);
        displayWeatherError(error.message || (currentConfig.isCompact ? 'ERR' : 'Fetch Failed'));
    }
}

// --- Public API ---
export function initWeather(config) {
    console.log("Weather Widget: Initializing with config:", config);
    currentConfig = config; // Store the passed config

    // Validate essential elements based on mode (compact or full)
    if (!currentConfig.tempDisplay || !currentConfig.iconDisplay) {
        console.error("Weather widget critical display elements (temp or icon) not correctly provided to initWeather. Aborting.");
        return;
    }
    if (!currentConfig.isCompact && (!currentConfig.locationDisplay || !currentConfig.descriptionDisplay)) {
         console.warn("Weather widget running in non-compact mode, but location or description display elements are missing.");
    }
    
    if (API_KEY === 'YOUR_API_KEY' || !API_KEY) {
         console.error("Weather Widget: CRITICAL - API_KEY is a placeholder or missing.");
         displayWeatherError(currentConfig.isCompact ? 'No Key' : "API Key Error: Setup Required");
         return;
    }

    // Fetch weather: Start with IP Geolocation
    fetchWeatherData(IP_GEOLOCATION_URL, true);
}
