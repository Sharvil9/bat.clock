import { updateClock } from './clock.js'; // Digital clock logic
import { updateAnalogClock } from './analogClock.js'; // Analog clock logic
import { applyTheme } from './theme.js';
import { initPomodoro } from './pomodoro.js'; // Pomodoro Timer Logic
import { initWeather } from './weather.js';   // Weather Widget Logic

// DOM Elements - Digital Clock
const timeDisplay = document.getElementById('time');
const dateDisplay = document.getElementById('date');
const digitalClockWrapper = document.getElementById('digital-clock-wrapper');

// DOM Elements - Analog Clock
const analogClockContainer = document.getElementById('analog-clock-container');
const hourHand = document.getElementById('hour-hand');
const minuteHand = document.getElementById('minute-hand');
const secondHand = document.getElementById('second-hand');

// DOM Elements - Controls
const themeToggleButton = document.getElementById('theme-toggle'); // For cycling themes
const themeSelector = document.getElementById('theme-selector');   // For selecting themes
const viewToggleButton = document.getElementById('view-toggle');     // For switching views

const body = document.body;

// Theme definitions (consistent with theme.js, consider importing if possible in future)
const knownThemes = [
    "theme-minimal-light", "theme-minimal-dark", "theme-forest",
    "theme-ocean", "theme-sunrise"
];

let currentView = 'digital'; // Default view

// Function to set the clock view (digital or analog)
function setView(viewName) {
    currentView = viewName;
    localStorage.setItem('clockView', viewName);

    if (viewName === 'analog') {
        if (digitalClockWrapper) digitalClockWrapper.style.display = 'none';
        if (analogClockContainer) analogClockContainer.style.display = 'block'; // Or 'flex' if it uses flex for centering
        if (viewToggleButton) viewToggleButton.textContent = 'Switch to Digital';
    } else { // Default to digital
        if (digitalClockWrapper) digitalClockWrapper.style.display = 'block';
        if (analogClockContainer) analogClockContainer.style.display = 'none';
        if (viewToggleButton) viewToggleButton.textContent = 'Switch to Analog';
    }
    // Immediately update the newly shown clock
    const now = new Date();
    if (currentView === 'analog') {
        updateAnalogClock(now, hourHand, minuteHand, secondHand);
    } else {
        updateClock(now, timeDisplay, dateDisplay);
    }
}

// Main Initialization
function init() {
    // Validate crucial elements for basic operation
    if (!body) {
        console.error("Error: Document body not found.");
        return;
    }

    // Theme initialization
    let savedTheme = localStorage.getItem('theme');
    if (!savedTheme || !knownThemes.includes(savedTheme)) {
        savedTheme = knownThemes[0]; // Default theme
    }
    applyTheme(savedTheme, body, themeToggleButton, themeSelector);

    // View initialization
    const savedView = localStorage.getItem('clockView');
    if (savedView === 'analog' || savedView === 'digital') {
        setView(savedView);
    } else {
        setView('digital'); // Default view
    }

    // Event listener for theme selector dropdown
    if (themeSelector) {
        themeSelector.addEventListener('change', (event) => {
            applyTheme(event.target.value, body, themeToggleButton, themeSelector);
        });
    } else {
        console.warn("Theme selector dropdown ('theme-selector') not found.");
    }

    // Event listener for theme cycle button
    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', () => {
            let currentTheme = localStorage.getItem('theme') || knownThemes[0];
            let currentIndex = knownThemes.indexOf(currentTheme);
            let nextIndex = (currentIndex + 1) % knownThemes.length;
            applyTheme(knownThemes[nextIndex], body, themeToggleButton, themeSelector);
        });
    } else {
        console.warn("Theme toggle button ('theme-toggle') not found.");
    }

    // Event listener for view toggle button
    if (viewToggleButton) {
        viewToggleButton.addEventListener('click', () => {
            setView(currentView === 'digital' ? 'analog' : 'digital');
        });
    } else {
        console.warn("View toggle button ('view-toggle') not found.");
    }
    
    // Check if essential clock display elements are present based on the current view
    if (currentView === 'digital' && (!timeDisplay || !dateDisplay)) {
        console.error("Error: Digital clock display elements ('time' or 'date') not found.");
    } else if (currentView === 'analog' && (!hourHand || !minuteHand || !secondHand)) {
        console.error("Error: Analog clock hand elements not found.");
    }


    // Global clock update interval
    setInterval(() => {
        const now = new Date();
        if (currentView === 'analog') {
            if (analogClockContainer && analogClockContainer.style.display !== 'none') {
                 updateAnalogClock(now, hourHand, minuteHand, secondHand);
            }
        } else { 
            if (digitalClockWrapper && digitalClockWrapper.style.display !== 'none') {
                updateClock(now, timeDisplay, dateDisplay);
            }
        }
    }, 1000);

    // Pomodoro Timer Initialization
    const pomodoroDisplay = document.getElementById('pomodoro-timer-display');
    const pomodoroSessionType = document.getElementById('pomodoro-session-type');
    const pomodoroCycleCount = document.getElementById('pomodoro-cycle-count-display');
    const pomodoroStartButton = document.getElementById('pomodoro-start');
    const pomodoroPauseButton = document.getElementById('pomodoro-pause');
    const pomodoroResetButton = document.getElementById('pomodoro-reset');

    if (pomodoroDisplay && pomodoroSessionType && pomodoroStartButton && pomodoroPauseButton && pomodoroResetButton && pomodoroCycleCount) {
        initPomodoro({
            displayElement: pomodoroDisplay,
            sessionTypeElement: pomodoroSessionType,
            cycleCountElement: pomodoroCycleCount,
            startButton: pomodoroStartButton,
            pauseButton: pomodoroPauseButton,
            resetButton: pomodoroResetButton
        });
    } else {
        console.warn("One or more Pomodoro DOM elements were not found. Pomodoro timer not initialized.");
    }

    // Weather Widget Initialization
    const weatherLocationDisplay = document.getElementById('weather-location');
    const weatherTempDisplay = document.getElementById('weather-temp');
    const weatherDescriptionDisplay = document.getElementById('weather-description');
    const weatherIconDisplay = document.getElementById('weather-icon');
    const weatherCityInput = document.getElementById('city-input');
    const weatherCitySubmit = document.getElementById('city-submit');

    if (weatherLocationDisplay && weatherTempDisplay && weatherDescriptionDisplay && weatherIconDisplay && weatherCityInput && weatherCitySubmit) {
        initWeather({
            locationDisplay: weatherLocationDisplay,
            tempDisplay: weatherTempDisplay,
            descriptionDisplay: weatherDescriptionDisplay,
            iconDisplay: weatherIconDisplay,
            cityInput: weatherCityInput,
            citySubmit: weatherCitySubmit
        });
    } else {
        console.warn("One or more Weather Widget DOM elements were not found. Weather widget not initialized.");
    }
}

// Wait for DOM to load before initializing
document.addEventListener('DOMContentLoaded', init);
