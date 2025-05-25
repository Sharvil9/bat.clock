// --- Constants & State Variables ---
const WORK_SESSION = 'Work';
const SHORT_BREAK_SESSION = 'Short Break';
const LONG_BREAK_SESSION = 'Long Break';

const WORK_DURATION = 25 * 60;       // 25 minutes in seconds
const SHORT_BREAK_DURATION = 5 * 60;  // 5 minutes
const LONG_BREAK_DURATION = 15 * 60; // 15 minutes
const POMODOROS_UNTIL_LONG_BREAK = 4;

let currentTimeLeft = WORK_DURATION;
let currentSessionType = WORK_SESSION;
let pomodoroCycleCount = 0; // Number of WORK sessions completed
let isRunning = false;
let timerIntervalId = null;

// DOM Elements (will be set by init)
let displayElement = null;
let sessionTypeElement = null;
let cycleCountElement = null;
let startButton = null;
let pauseButton = null;
let resetButton = null;

// --- Helper Functions ---
function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function updateDisplay() {
    if (displayElement) displayElement.textContent = formatTime(currentTimeLeft);
    if (sessionTypeElement) sessionTypeElement.textContent = currentSessionType;
    if (cycleCountElement) cycleCountElement.textContent = `Cycles: ${pomodoroCycleCount}`; // Ensure this uses the current state
}

function updateButtonStates() {
    if (startButton) startButton.disabled = isRunning;
    if (pauseButton) pauseButton.disabled = !isRunning;
}

function switchToSession(sessionType) {
    currentSessionType = sessionType;
    switch (sessionType) {
        case WORK_SESSION:
            currentTimeLeft = WORK_DURATION;
            break;
        case SHORT_BREAK_SESSION:
            currentTimeLeft = SHORT_BREAK_DURATION;
            break;
        case LONG_BREAK_SESSION:
            currentTimeLeft = LONG_BREAK_DURATION;
            break;
        default:
            currentTimeLeft = WORK_DURATION; 
    }
    updateDisplay();
}

function handleSessionEnd() {
    isRunning = false;
    clearInterval(timerIntervalId);
    timerIntervalId = null;

    if (currentSessionType === WORK_SESSION) {
        pomodoroCycleCount++;
        localStorage.setItem('pomodoroCycleCount', pomodoroCycleCount.toString()); // Save cycle count
    }
    
    const nextSession = determineNextSession(currentSessionType, pomodoroCycleCount);
    switchToSession(nextSession);
    
    updateButtonStates();
    // Consider adding a more subtle notification or allowing user to configure.
    // For now, an alert is simple.
    // Note: `currentSessionType` in the alert will now reflect the *next* session due to switchToSession call.
    alert(`Session ended. Next up: ${currentSessionType}`); 
}


/**
 * Determines the next session type based on the current session and cycle count.
 * This is a pure function and can be exported for testing if needed, or kept internal.
 * @param {string} currentSession - The type of the session that just ended.
 * @param {number} completedCycles - The number of WORK cycles completed.
 * @returns {string} - The type of the next session.
 */
export function determineNextSession(currentSession, completedCycles) {
    if (currentSession === WORK_SESSION) {
        if (completedCycles > 0 && completedCycles % POMODOROS_UNTIL_LONG_BREAK === 0) {
            return LONG_BREAK_SESSION;
        } else {
            return SHORT_BREAK_SESSION;
        }
    } else { // End of a Short or Long Break session
        return WORK_SESSION;
    }
}

// --- Core Functions ---
function updateTimer() {
    if (!isRunning) return;

    currentTimeLeft--;
    updateDisplay();

    if (currentTimeLeft < 0) {
        handleSessionEnd();
    }
}

export function startTimer() {
    if (isRunning) return;
    isRunning = true;
    if (currentTimeLeft < 0) { // Ensure time is reset if starting from a completed session
        switchToSession(currentSessionType);
    }
    timerIntervalId = setInterval(updateTimer, 1000);
    updateButtonStates();
}

export function pauseTimer() {
    if (!isRunning) return;
    isRunning = false;
    clearInterval(timerIntervalId);
    timerIntervalId = null;
    updateButtonStates();
}

export function resetTimer() {
    pauseTimer(); 
    // Reset to the current session type's default duration
    switchToSession(currentSessionType); 
    // Or, to always reset to the very first Work session and clear cycles:
    // pomodoroCycleCount = 0; 
    // switchToSession(WORK_SESSION);
    updateButtonStates(); 
}

export function initPomodoro(config) {
    displayElement = config.displayElement;
    sessionTypeElement = config.sessionTypeElement;
    cycleCountElement = config.cycleCountElement;
    startButton = config.startButton;
    pauseButton = config.pauseButton;
    resetButton = config.resetButton;

    if (!displayElement || !sessionTypeElement || !startButton || !pauseButton || !resetButton || !cycleCountElement) {
        console.error("Pomodoro DOM elements not correctly provided to initPomodoro.");
        return;
    }

    // Load persisted cycle count
    const savedCycleCount = localStorage.getItem('pomodoroCycleCount');
    if (savedCycleCount !== null) {
        const parsedCount = parseInt(savedCycleCount, 10);
        if (!isNaN(parsedCount)) {
            pomodoroCycleCount = parsedCount;
        }
    }
    // Initial display update for cycle count is handled by updateDisplay() called within switchToSession/init.
    
    if (startButton) startButton.addEventListener('click', startTimer);
    if (pauseButton) pauseButton.addEventListener('click', pauseTimer);
    if (resetButton) resetButton.addEventListener('click', resetTimer);

    switchToSession(WORK_SESSION); // Sets initial time and session type display
    updateDisplay(); // Explicitly call to ensure cycle count is displayed with loaded value
    updateButtonStates(); 
}
