/**
 * Updates the display of an analog clock.
 * @param {Date} now - The current date and time.
 * @param {HTMLElement} hourHandElement - The DOM element for the hour hand.
 * @param {HTMLElement} minuteHandElement - The DOM element for the minute hand.
 * @param {HTMLElement} secondHandElement - The DOM element for the second hand.
 */
export function updateAnalogClock(now, hourHandElement, minuteHandElement, secondHandElement) {
    if (!hourHandElement || !minuteHandElement || !secondHandElement) {
        // console.error("One or more analog clock hand elements are missing.");
        return; // Do nothing if hands aren't there
    }

    const degrees = calculateAnalogHandDegrees(now);

    // The initial CSS transform for .hand is `translateY(-50%) rotate(90deg)` to make it point "up" (12 o'clock).
    // The calculated degrees are absolute from 12 o'clock.
    // So, we add 90 to the calculated degrees to align with the CSS transform-origin and initial rotation.
    secondHandElement.style.transform = `translateY(-50%) rotate(${degrees.second + 90}deg)`;
    minuteHandElement.style.transform = `translateY(-50%) rotate(${degrees.minute + 90}deg)`;
    hourHandElement.style.transform = `translateY(-50%) rotate(${degrees.hour + 90}deg)`;
}

/**
 * Calculates the rotation degrees for analog clock hands.
 * 0 degrees is considered to be at the 12 o'clock position.
 * @param {Date} date - The current date and time.
 * @returns {{hour: number, minute: number, second: number}} - Object with degree values for each hand.
 */
export function calculateAnalogHandDegrees(date) {
    const seconds = date.getSeconds();
    const minutes = date.getMinutes();
    const hours = date.getHours();

    const secondsDeg = (seconds / 60) * 360;
    const minutesDeg = ((minutes + seconds / 60) / 60) * 360;
    // Use hours % 12 for 12-hour format; 0 hour (midnight) should be 12.
    const hourForCalc = hours % 12;
    const hoursDeg = (((hourForCalc === 0 ? 12 : hourForCalc) + minutes / 60 + seconds / 3600) / 12) * 360;
    // Special case: 12 o'clock (hour 0 or 12) should result in 0 degrees for the hour hand if it's exactly on the hour.
    // The formula above handles this: (12/12)*360 = 360, which is 0 degrees. (0/12)*360 = 0.
    // However, for hoursDeg, 12 AM (hour 0) and 12 PM (hour 12) should both map to the '12' position on the clock face for calculation.
    // The formula needs to correctly map hour 0 (midnight) and hour 12 (noon) to the 0-degree mark for the hour hand calculation,
    // relative to the 12-hour clock cycle.
    // Let's refine hoursDeg:
    // Corrected calculation for hoursDeg:
    // ( (hours % 12) + minutes/60 + seconds/3600 ) / 12 * 360
    // If hours is 0 (midnight), (0 % 12) = 0.  (0 / 12) * 360 = 0 degrees. Correct.
    // If hours is 12 (noon), (12 % 12) = 0. This is the issue. (0 / 12) * 360 = 0 degrees. Correct.
    // The previous formula was: (((hours % 12) + minutes / 60 + seconds / 3600) / 12) * 360;
    // For hour 12 (noon), (12%12) is 0. This makes it 0 degrees.
    // For hour 0 (midnight), (0%12) is 0. This makes it 0 degrees.
    // This is actually correct as 0 degrees points to 12.

    return {
        hour: hoursDeg,
        minute: minutesDeg,
        second: secondsDeg
    };
}
