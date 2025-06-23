console.log("js/main.js script loading (Casio-Style Overhaul)...");

import { updateClock, formatClockDate, getDayOfWeek } from './clock.js';
import { applyGrayscaleTheme } from './theme.js';
import { initWeather } from './weather.js';
import * as UIModeManager from './uiModes.js';
// WorldClock module is used by uiModes.js, so no direct import needed here unless for specific calls

// --- DOM Elements (New Layout) ---
const body = document.body;
const timeElement = document.getElementById('time');
const amPmElement = document.getElementById('ampm');
const dateElement = document.getElementById('date');
const dayOfWeekElement = document.getElementById('day-of-week');

const modeIndicatorElement = document.getElementById('mode-indicator');
const primaryContentElement = document.getElementById('primary-content');
const secondaryContentElement = document.getElementById('secondary-content');
const modeButton = document.getElementById('mode-button');

const weatherTempCompactElement = document.getElementById('weather-temp-compact');
const weatherIconCompactElement = document.getElementById('weather-icon-compact');

// --- Main Update Function (Called every second) ---
function refreshDisplayOnInterval() {
    const currentMode = UIModeManager.getCurrentMode();

    // Always update day of week as it's in the top info bar
    const now = new Date();
    if (dayOfWeekElement) dayOfWeekElement.textContent = getDayOfWeek(now);

    if (currentMode === UIModeManager.MODES.TIME) {
        refreshLocalTimeDisplay();
    } else if (currentMode === UIModeManager.MODES.WORLD_CLOCK) {
        // Re-render world clock data using the function in uiModes.js
        // This ensures it uses the latest time.
        UIModeManager.updateDisplayForMode(UIModeManager.MODES.WORLD_CLOCK, {
            primaryContent: primaryContentElement,
            secondaryContent: secondaryContentElement,
            modeIndicator: modeIndicatorElement
            // No need to pass time/date elements here as they are not used by WORLD_CLOCK mode
        });
    }
    // Settings mode doesn't need per-second updates by default
}


// --- Specific Display Refresh Functions ---
function refreshLocalTimeDisplay() {
    const now = new Date();
    const is24Hour = UIModeManager.getHourFormat();
    const timeParts = updateClock(now, null, null, true, is24Hour);

    if (timeElement) {
        if (timeElement.parentElement !== primaryContentElement) {
            primaryContentElement.innerHTML = '';
            primaryContentElement.appendChild(timeElement);
        }
        timeElement.childNodes[0].nodeValue = `${timeParts.hours}:${timeParts.minutes}:${timeParts.seconds} `;
    }
    if (amPmElement) {
        amPmElement.textContent = timeParts.ampm;
        amPmElement.style.display = timeParts.ampm ? 'inline' : 'none';
    }
    if (dateElement) {
        if (dateElement.parentElement !== secondaryContentElement) {
            secondaryContentElement.innerHTML = '';
            secondaryContentElement.appendChild(dateElement);
        }
        dateElement.textContent = formatClockDate(now, true);
    }
}


// --- Mode Management ---
let hourFormatToggleElement = null;

function handleHourFormatToggle() {
    UIModeManager.toggleHourFormat();
    if (UIModeManager.getCurrentMode() === UIModeManager.MODES.SETTINGS) {
        UIModeManager.updateDisplayForMode(UIModeManager.MODES.SETTINGS, {
             primaryContent: primaryContentElement,
             secondaryContent: secondaryContentElement,
             modeIndicator: modeIndicatorElement
        });
        attachSettingsListeners();
    }
    // If in TIME or WORLD_CLOCK mode, the next interval tick will pick up the new format.
    // Or, force an immediate refresh if desired:
    refreshDisplayOnInterval();
}

function attachSettingsListeners() {
    hourFormatToggleElement = document.getElementById('hour-format-toggle');
    if (hourFormatToggleElement) {
        hourFormatToggleElement.removeEventListener('click', handleHourFormatToggle);
        hourFormatToggleElement.addEventListener('click', handleHourFormatToggle);

        hourFormatToggleElement.removeEventListener('keydown', handleHourFormatKeyboardToggle);
        hourFormatToggleElement.addEventListener('keydown', handleHourFormatKeyboardToggle);
    }
}

function handleHourFormatKeyboardToggle(event) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault(); // Prevent scrolling if space is pressed
        handleHourFormatToggle();
    }
}

function handleModeChange() {
    const newMode = UIModeManager.cycleMode();
    applyModeToUI(newMode);
}

function applyModeToUI(mode) {
    UIModeManager.updateDisplayForMode(mode, {
        primaryContent: primaryContentElement,
        secondaryContent: secondaryContentElement,
        modeIndicator: modeIndicatorElement,
        timeElement: timeElement,
        dateElement: dateElement
    });

    // Trigger immediate refresh of content for the new mode
    refreshDisplayOnInterval();

    if (mode === UIModeManager.MODES.SETTINGS) {
        attachSettingsListeners();
    }
}

// --- Main Initialization ---
function init() {
    console.log("Initializing Bat Clock (Casio-Style Overhaul)...");

    if (!body || !timeElement || !dateElement || !modeButton || !primaryContentElement || !secondaryContentElement || !modeIndicatorElement || !amPmElement || !dayOfWeekElement) {
        console.error("One or more critical UI elements for the new layout are missing. Initialization aborted.");
        return;
    }

    applyGrayscaleTheme(body);
    const initialMode = UIModeManager.loadInitialMode();
    applyModeToUI(initialMode); // This will also call refreshDisplayOnInterval once

    modeButton.addEventListener('click', handleModeChange);

    setInterval(refreshDisplayOnInterval, 1000); // Main interval updates based on current mode

    console.log("Initializing Compact Weather widget...");
    if (weatherTempCompactElement && weatherIconCompactElement) {
        initWeather({
            tempDisplay: weatherTempCompactElement,
            iconDisplay: weatherIconCompactElement,
            locationDisplay: null,
            descriptionDisplay: null,
            isCompact: true
        });
    } else {
        console.warn("Compact weather display elements not found. Weather widget not fully initialized for compact view.");
    }
    
    console.log("Bat Clock (Casio-Style Overhaul) initialized successfully.");
}

document.addEventListener('DOMContentLoaded', init);
