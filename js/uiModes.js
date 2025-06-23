// js/uiModes.js

import * as WorldClock from './worldClock.js';

export const MODES = {
    TIME: 'TIME', // Default mode
    WORLD_CLOCK: 'WORLD_CLOCK',
    SETTINGS: 'SETTINGS',
};

const AVAILABLE_MODES = [MODES.TIME, MODES.WORLD_CLOCK, MODES.SETTINGS];
let currentModeIndex = 0;

// --- Storage Keys ---
const STORAGE_KEY_LAST_MODE = 'batClockLastActiveMode';
const STORAGE_KEY_HOUR_FORMAT = 'batClockHourFormatIs24';

// --- Hour Format Setting ---
let is24HourFormat = false;

export function loadHourFormatSetting() {
    try {
        const savedFormat = localStorage.getItem(STORAGE_KEY_HOUR_FORMAT);
        is24HourFormat = savedFormat === 'true';
        console.log(`Hour format loaded: ${is24HourFormat ? '24-hour' : '12-hour'}`);
    } catch (e) {
        console.warn("Could not load hour format setting from localStorage, defaulting to 12-hour.", e);
        is24HourFormat = false;
    }
}

export function toggleHourFormat() {
    is24HourFormat = !is24HourFormat;
    try {
        localStorage.setItem(STORAGE_KEY_HOUR_FORMAT, is24HourFormat.toString());
        console.log(`Hour format toggled and saved: ${is24HourFormat ? '24-hour' : '12-hour'}`);
    } catch (e) {
        console.warn("Could not save hour format setting to localStorage.", e);
    }
    return is24HourFormat;
}

export function getHourFormat() {
    return is24HourFormat;
}

// --- Mode Management ---
export function getCurrentMode() {
    return AVAILABLE_MODES[currentModeIndex];
}

export function getModeIndicatorText() {
    return getCurrentMode().replace('_', ' ');
}

export function cycleMode() {
    currentModeIndex = (currentModeIndex + 1) % AVAILABLE_MODES.length;
    saveCurrentMode();
    console.log(`Mode changed to: ${getCurrentMode()}`);
    return getCurrentMode();
}

export function saveCurrentMode() {
    try {
        localStorage.setItem(STORAGE_KEY_LAST_MODE, getCurrentMode());
    } catch (e) {
        console.warn("Could not save current mode to localStorage:", e);
    }
}

export function loadInitialMode() {
    try {
        const savedMode = localStorage.getItem(STORAGE_KEY_LAST_MODE);
        if (savedMode && AVAILABLE_MODES.includes(savedMode)) {
            currentModeIndex = AVAILABLE_MODES.indexOf(savedMode);
            console.log(`Initial mode loaded from localStorage: ${savedMode}`);
        } else {
            currentModeIndex = 0;
            console.log(`No valid saved mode found, defaulting to: ${getCurrentMode()}`);
        }
    } catch (e) {
        console.warn("Could not load mode from localStorage, defaulting:", e);
        currentModeIndex = 0;
    }
    loadHourFormatSetting();
    return getCurrentMode();
}


// --- UI Update Logic for Modes ---
export function updateDisplayForMode(mode, elements) {
    if (elements.modeIndicator) {
        elements.modeIndicator.textContent = getModeIndicatorText();
    }

    if (elements.primaryContent) elements.primaryContent.innerHTML = '';
    if (elements.secondaryContent) elements.secondaryContent.innerHTML = '';

    switch (mode) {
        case MODES.TIME:
            if (elements.primaryContent && elements.timeElement) {
                elements.primaryContent.appendChild(elements.timeElement);
            }
            if (elements.secondaryContent && elements.dateElement) {
                elements.secondaryContent.appendChild(elements.dateElement);
            }
            break;
        case MODES.WORLD_CLOCK:
            renderWorldClock(elements.primaryContent, elements.secondaryContent);
            break;
        case MODES.SETTINGS:
            renderSettings(elements.primaryContent, elements.secondaryContent);
            break;
        default:
            if (elements.primaryContent) {
                elements.primaryContent.textContent = 'Unknown Mode';
            }
    }
}

function renderSettings(primaryContent, secondaryContent) {
    if (!primaryContent || !secondaryContent) return;
    const currentFormat = getHourFormat() ? '24-Hour' : '12-Hour';
    primaryContent.innerHTML = `
        <div class="setting-item" id="hour-format-toggle" role="button" tabindex="0" aria-pressed="${getHourFormat()}" aria-label="Toggle time format. Current format: ${currentFormat}">
            Format: <span class="setting-value">${currentFormat}</span>
        </div>
    `;
    secondaryContent.textContent = 'Tap or press Enter/Space to toggle format.';
}

function renderWorldClock(primaryContent, secondaryContent) {
    if (!primaryContent || !secondaryContent) return;

    const clockData = WorldClock.getDefaultWorldClockTimes();

    // Display first clock (e.g., New York) in primary, second (e.g., London) in secondary.
    // This is a simple layout; could be improved for more clocks.
    if (clockData.length > 0) {
        primaryContent.textContent = WorldClock.formatWorldClockEntry(clockData[0]);
        primaryContent.classList.add('world-clock-entry'); // Add class for styling
    } else {
        primaryContent.textContent = 'No World Clocks';
    }

    if (clockData.length > 1) {
        secondaryContent.textContent = WorldClock.formatWorldClockEntry(clockData[1]);
        secondaryContent.classList.add('world-clock-entry'); // Add class for styling
    } else {
        secondaryContent.textContent = ''; // Clear if no second clock
    }
    // If more clocks, they could be appended to secondaryContent or a different layout used.
}
