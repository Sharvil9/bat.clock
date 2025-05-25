// --- Constants & Configuration ---
const API_KEY = 'YOUR_API_KEY'; // IMPORTANT: Replace with your actual OpenWeatherMap API key
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';
const ICON_URL_PREFIX = 'https://openweathermap.org/img/wn/';

// --- DOM Elements (to be set by initWeather) ---
let locationDisplayElem = null;
let tempDisplayElem = null;
let descriptionDisplayElem = null;
let iconDisplayElem = null;
let cityInputElement = null;
let citySubmitButton = null;

// --- Helper Functions ---
function updateWeatherDisplay(data) {
    if (!data) {
        // Potentially clear fields or show default error
        if (locationDisplayElem) locationDisplayElem.textContent = 'Weather data unavailable.';
        if (tempDisplayElem) tempDisplayElem.textContent = '--°C';
        if (descriptionDisplayElem) descriptionDisplayElem.textContent = 'Could not fetch data.';
        if (iconDisplayElem) {
            iconDisplayElem.src = '';
            iconDisplayElem.alt = 'Weather icon';
            iconDisplayElem.style.display = 'none';
        }
        return;
    }

    if (locationDisplayElem) locationDisplayElem.textContent = data.name;
    if (tempDisplayElem) tempDisplayElem.textContent = `${Math.round(data.main.temp)}°C`;
    if (descriptionDisplayElem) descriptionDisplayElem.textContent = data.weather[0].description;
    if (iconDisplayElem) {
        iconDisplayElem.src = `${ICON_URL_PREFIX}${data.weather[0].icon}@2x.png`;
        iconDisplayElem.alt = data.weather[0].description;
        iconDisplayElem.style.display = 'block';
    }
}

async function fetchWeatherData(cityName) {
    if (API_KEY === 'YOUR_API_KEY') {
        console.warn("Weather Widget: API_KEY is a placeholder. Please replace it with your actual OpenWeatherMap API key.");
        if (locationDisplayElem) locationDisplayElem.textContent = 'API Key Missing';
        if (tempDisplayElem) tempDisplayElem.textContent = '--°C';
        if (descriptionDisplayElem) descriptionDisplayElem.textContent = 'Setup required';
        if (iconDisplayElem) iconDisplayElem.style.display = 'none';
        // Use placeholder data for UI demonstration if API key is missing
        updateWeatherDisplay({
            name: cityName || "Test City",
            main: { temp: 20 }, // Celsius
            weather: [{ description: "clear sky (demo)", icon: "01d" }]
        });
        return; // Stop if API key is placeholder
    }

    if (locationDisplayElem) locationDisplayElem.textContent = 'Loading...';
    if (iconDisplayElem) iconDisplayElem.style.display = 'none';


    const url = `${WEATHER_API_URL}?q=${encodeURIComponent(cityName)}&appid=${API_KEY}&units=metric`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error(`City "${cityName}" not found.`);
            } else if (response.status === 401) {
                throw new Error("Invalid API key or unauthorized.");
            } else {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }
        }
        const data = await response.json();
        updateWeatherDisplay(data);
    } catch (error) {
        console.error("Error fetching weather data:", error);
        if (locationDisplayElem) locationDisplayElem.textContent = 'Error';
        if (tempDisplayElem) tempDisplayElem.textContent = '--°C';
        if (descriptionDisplayElem) descriptionDisplayElem.textContent = error.message || 'Could not fetch data.';
        if (iconDisplayElem) {
            iconDisplayElem.src = '';
            iconDisplayElem.style.display = 'none';
        }
    }
}

function saveCity(cityName) {
    localStorage.setItem('weatherCity', cityName);
}

function loadSavedCity() {
    const savedCity = localStorage.getItem('weatherCity');
    if (savedCity) {
        if (cityInputElement) cityInputElement.value = savedCity; // Pre-fill input
        fetchWeatherData(savedCity);
    } else {
        if (locationDisplayElem) locationDisplayElem.textContent = 'Enter a city to see the weather.';
    }
}

function handleCitySubmit() {
    if (cityInputElement) {
        const cityName = cityInputElement.value.trim();
        if (cityName) {
            fetchWeatherData(cityName);
            saveCity(cityName);
        } else {
            alert("Please enter a city name.");
        }
    }
}

// --- Public API ---
export function initWeather(config) {
    // Store DOM elements from config
    locationDisplayElem = config.locationDisplay;
    tempDisplayElem = config.tempDisplay;
    descriptionDisplayElem = config.descriptionDisplay;
    iconDisplayElem = config.iconDisplay;
    cityInputElement = config.cityInput;
    citySubmitButton = config.citySubmit;

    if (!locationDisplayElem || !tempDisplayElem || !descriptionDisplayElem || !iconDisplayElem || !cityInputElement || !citySubmitButton) {
        console.error("Weather widget DOM elements not correctly provided to initWeather.");
        return;
    }
    
    if (API_KEY === 'YOUR_API_KEY') {
         console.warn("Weather Widget: Using placeholder data because API_KEY is not set. Functionality will be limited.");
         if (locationDisplayElem) locationDisplayElem.textContent = "API Key Needed";
    }

    // Add event listener
    if (citySubmitButton) {
        citySubmitButton.addEventListener('click', handleCitySubmit);
    }
    if (cityInputElement) { // Allow Enter key submission
        cityInputElement.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                handleCitySubmit();
            }
        });
    }


    // Load weather for a saved city, if any
    loadSavedCity();
}
