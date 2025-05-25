console.log("js/main.js script loading..."); // Top-level diagnostic log

import { updateClock } from './clock.js'; 
// import { updateAnalogClock } from './analogClock.js'; // PHASE 1: Commented out
import { applyGrayscaleTheme } from './theme.js'; // PHASE 1: Changed to applyGrayscaleTheme
// import { initPomodoro } from './pomodoro.js'; // PHASE 1: Commented out
import { initWeather } from './weather.js';   

// DOM Elements
const timeDisplay = document.getElementById('time'); 
const dateDisplay = document.getElementById('date'); 
const digitalClockWrapper = document.getElementById('digital-clock-wrapper'); 

// PHASE 1: Comment out Analog Clock DOM Elements
// const analogClockContainer = document.getElementById('analog-clock-container');
// const hourHand = document.getElementById('hour-hand');
// const minuteHand = document.getElementById('minute-hand');
// const secondHand = document.getElementById('second-hand');

// PHASE 1: Comment out Theme Controls (buttons/selectors are removed from HTML)
// const themeToggleButton = document.getElementById('theme-toggle'); 
// const themeSelector = document.getElementById('theme-selector');   
// const viewToggleButton = document.getElementById('view-toggle'); 

const body = document.body;
// PHASE 1: knownThemes and currentView are no longer needed for simplified theme/view
// const knownThemes = themeModuleKnownThemes; 
// let currentView = 'digital'; 

// PHASE 1: setView function is commented out as analog clock and view toggle are hidden
// function setView(viewName) { ... }

// Main Initialization
function init() {
    console.log("Entering init() function (UI Overhaul Phase 1)..."); // Message updated

    if (timeDisplay) {
        timeDisplay.style.fontSize = ""; // Reset any diagnostic styling
    }
    if (dateDisplay) { 
        dateDisplay.style.display = 'block'; 
    }
    
    // PHASE 1: Ensure Pomodoro, Analog Clock, View Toggle button are hidden (already done in HTML for some, JS ensures for others)
    const pomodoroContainer = document.getElementById('pomodoro-section-container');
    if (pomodoroContainer) {
        pomodoroContainer.style.display = 'none'; 
    }
    const analogClockContainer = document.getElementById('analog-clock-container');
    if (analogClockContainer) {
        analogClockContainer.style.display = 'none';
    }
    const viewToggleButton = document.getElementById('view-toggle');
    if(viewToggleButton) {
        viewToggleButton.style.display = 'none'; 
    }
    // Make Weather section visible (it should be by default if not explicitly hidden by CSS)
    const weatherContainer = document.getElementById('weather-widget-container');
    if (weatherContainer) {
        weatherContainer.style.display = 'block'; 
    }


    if (!body) {
        console.error("Error: Document body not found.");
        return;
    }

    // PHASE 1: Simplified Theme initialization
    applyGrayscaleTheme(body); // Apply the single grayscale theme

    // PHASE 1: View initialization commented out
    // const savedView = localStorage.getItem('clockView');
    // if (savedView === 'analog' || savedView === 'digital') {
    //     setView(savedView); 
    // } else {
    //     setView('digital'); 
    // }

    // PHASE 1: Theme control event listeners and callbacks removed/commented out
    // function handleThemeSelection(event) { ... }
    // function cycleTheme() { ... }
    // function toggleView() { ... }

    // if (themeSelector) { ... }
    // if (themeToggleButton) { ... }
    // if (viewToggleButton) { ... }
    
    // Global clock update interval (Digital Clock only for Phase 1)
    if (timeDisplay && dateDisplay && digitalClockWrapper) { 
        // Ensure digital clock wrapper is visible (it should be default)
        digitalClockWrapper.style.display = 'block'; 
        updateClock(timeDisplay, dateDisplay); // Initial call
        setInterval(() => {
            // No need to check currentView, only digital clock is active
            if (digitalClockWrapper.style.display !== 'none') { 
                updateClock(timeDisplay, dateDisplay);
            }
        }, 1000);
    } else {
        console.error("Digital clock display elements not found for init or interval.");
    }


    // PHASE 1: Pomodoro Timer Initialization commented out
    // console.log("Initializing Pomodoro timer..."); 
    // const pomodoroTimerDisplayElement = ...
    // if (pomodoroTimerDisplayElement && ...) { initPomodoro({...}); } 
    // else { console.warn("Pomodoro DOM elements not found..."); }

    // Weather Widget Initialization (KEEP)
    console.log("Initializing Weather widget..."); 
    const weatherLocationDisplay = document.getElementById('weather-location');
    const weatherTempDisplay = document.getElementById('weather-temp');
    const weatherDescriptionDisplay = document.getElementById('weather-description');
    const weatherIconDisplay = document.getElementById('weather-icon');

    if (weatherLocationDisplay && weatherTempDisplay && weatherDescriptionDisplay && weatherIconDisplay) {
        initWeather({
            locationDisplay: weatherLocationDisplay,
            tempDisplay: weatherTempDisplay,
            descriptionDisplay: weatherDescriptionDisplay,
            iconDisplay: weatherIconDisplay
        });
    } else {
        console.warn("One or more Weather Widget display DOM elements were not found. Weather widget not initialized.");
    }
    
    console.log("Main init() function completed successfully (UI Overhaul Phase 1)."); 
}

document.addEventListener('DOMContentLoaded', init);
