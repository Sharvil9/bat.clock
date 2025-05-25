// --- Date Formatting Utility ---
export function formatDate(date) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
}

// --- Clock Logic ---
// Pure function for formatting digital time
export function formatDigitalTime(date) {
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const hoursStr = hours.toString().padStart(2, '0');

    return `${hoursStr}:${minutes}:${seconds} ${ampm}`;
}

// Original updateClock now uses formatDigitalTime and handles DOM updates
export function updateClock(timeDisplay, dateDisplay) {
    const now = new Date();
    if (timeDisplay) {
        timeDisplay.textContent = formatDigitalTime(now);
    }
    if (dateDisplay) {
        dateDisplay.textContent = formatDate(now);
    }
}
