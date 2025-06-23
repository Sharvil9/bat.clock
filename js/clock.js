// js/clock.js

// --- Date Formatting Utilities ---
/**
 * Formats the date for display.
 * @param {Date} date - The date object to format.
 * @param {boolean} [shortFormat=false] - Whether to use a short format (e.g., "JAN 1 2024").
 * @returns {string} The formatted date string.
 */
export function formatClockDate(date, shortFormat = false) {
    if (shortFormat) {
        const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
        return `${monthNames[date.getMonth()]} ${date.getDate()} ${date.getFullYear()}`;
    }
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
}

/**
 * Gets the abbreviated day of the week (e.g., "MON").
 * @param {Date} date - The date object.
 * @returns {string} The abbreviated day of the week.
 */
export function getDayOfWeek(date) {
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    return days[date.getDay()];
}


// --- Clock Logic ---
/**
 * Formats the time into hours, minutes, seconds, and AM/PM based on format preference.
 * Handles 12/24 hour format based on user preference.
 * @param {Date} date - The date object.
 * @param {boolean} [is24HourFormat=false] - Whether to use 24-hour format.
 * @returns {{hours: string, minutes: string, seconds: string, ampm: string}}
 */
export function formatDigitalTimeParts(date, is24HourFormat = false) {
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    let ampm = ''; // AM/PM is empty if in 24-hour format

    if (is24HourFormat) {
        // Hours are already 0-23
    } else {
        ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // The hour '0' should be '12' for 12-hour format
    }

    const hoursStr = hours.toString().padStart(2, '0');
    return { hours: hoursStr, minutes, seconds, ampm };
}


/**
 * Updates clock display elements or returns time parts.
 * @param {Date} now - The current date object.
 * @param {HTMLElement} [timeDisplayElement=null] - The DOM element for time.
 * @param {HTMLElement} [dateDisplayElement=null] - The DOM element for date.
 * @param {boolean} [returnPartsOnly=false] - If true, returns parts instead of updating DOM.
 * @param {boolean} [is24HourFormat=false] - Format preference.
 * @returns {object|undefined} Time parts if returnPartsOnly is true.
 */
export function updateClock(now, timeDisplayElement = null, dateDisplayElement = null, returnPartsOnly = false, is24HourFormat = false) {
    const timeParts = formatDigitalTimeParts(now, is24HourFormat);

    if (returnPartsOnly) {
        return timeParts;
    }

    // Legacy DOM update, will be mostly handled by main.js for new layout
    if (timeDisplayElement) {
        let timeString = `${timeParts.hours}:${timeParts.minutes}:${timeParts.seconds}`;
        if (timeParts.ampm) { // Add AM/PM if it exists (i.e., not 24-hour format)
            timeString += ` ${timeParts.ampm}`;
        }
        timeDisplayElement.textContent = timeString;
    }
    if (dateDisplayElement) {
        // Defaulting to long format here if directly updating DOM
        dateDisplayElement.textContent = formatClockDate(now, false);
    }
    // No return value needed if directly updating DOM
}
