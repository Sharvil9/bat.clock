// js/worldClock.js

import { getHourFormat } from './uiModes.js'; // To respect 12/24h format

// Default time zones - IANA time zone names
// User should be able to configure these later.
const DEFAULT_TIMEZONES = [
    { name: "New York", iana: "America/New_York" },
    { name: "London", iana: "Europe/London" },
    // { name: "Tokyo", iana: "Asia/Tokyo" }, // Can add more
];

/**
 * Gets the current time parts for a given IANA time zone.
 * @param {string} ianaTimeZone - The IANA time zone name (e.g., "America/New_York").
 * @param {boolean} is24Hour - True for 24-hour format, false for 12-hour.
 * @returns {{hours: string, minutes: string, ampm: string, name: string, error?: string}}
 *          Object with time parts and name, or error message.
 */
export function getTimeForTimeZone(ianaTimeZone, is24Hour) {
    try {
        const now = new Date();
        const options = {
            timeZone: ianaTimeZone,
            hour12: !is24Hour,
            hour: '2-digit',
            minute: '2-digit',
            // Omitting seconds for world clock to save space initially
        };

        const formatter = new Intl.DateTimeFormat('en-US', options);
        const parts = formatter.formatToParts(now);

        let hours = '';
        let minutes = '';
        let ampm = '';

        parts.forEach(part => {
            switch (part.type) {
                case 'hour':
                    hours = part.value.padStart(2, '0');
                    break;
                case 'minute':
                    minutes = part.value.padStart(2, '0');
                    break;
                case 'dayPeriod': // AM/PM
                    ampm = part.value;
                    break;
            }
        });

        // Intl.DateTimeFormat with hour12:true might return "00" for 12 AM.
        // We prefer "12" for consistency with the main clock.
        if (!is24Hour && hours === "00") {
            hours = "12";
        }


        return { hours, minutes, ampm: ampm.toUpperCase(), name: '' }; // Name will be added by the caller
    } catch (error) {
        console.error(`Error getting time for time zone ${ianaTimeZone}:`, error);
        return { hours: '--', minutes: '--', ampm: '', name: '', error: 'Invalid Zone' };
    }
}

/**
 * Gets formatted times for all default time zones.
 * @returns {Array<object>} Array of time zone data objects.
 */
export function getDefaultWorldClockTimes() {
    const is24Hour = getHourFormat();
    return DEFAULT_TIMEZONES.map(tz => {
        const timeData = getTimeForTimeZone(tz.iana, is24Hour);
        return { ...timeData, name: tz.name, iana: tz.iana }; // Add original name and iana back
    });
}

/**
 * Formats a world clock entry for display.
 * Example: "NY: 10:30 AM"
 * @param {object} timeZoneData - Object from getTimeForTimeZone, with 'name' property.
 * @returns {string} Formatted string.
 */
export function formatWorldClockEntry(timeZoneData) {
    if (timeZoneData.error) {
        return `${timeZoneData.name.substring(0,3).toUpperCase()}: ERROR`;
    }
    const ampmStr = timeZoneData.ampm ? ` ${timeZoneData.ampm}` : "";
    // Using first 3 chars of name for brevity, e.g., New York -> NEW
    const displayName = timeZoneData.name.substring(0,3).toUpperCase();
    return `${displayName}: ${timeZoneData.hours}:${timeZoneData.minutes}${ampmStr}`;
}
