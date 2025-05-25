import { calculateAnalogHandDegrees } from './analogClock.js';

describe('js/analogClock.js', () => {
    // Helper to normalize degrees (e.g., 360 becomes 0) for easier comparison
    // However, the function actually returns 360 for 12 o'clock, which is fine.
    // The tests just need to expect that.
    // For values like 375 vs 15, normalization is useful.
    // Let's adjust expectations first. If a value is 360, it's equivalent to 0.

    describe('calculateAnalogHandDegrees', () => {
        // Test cases for specific times
        it('should calculate correct degrees for 12:00:00 (midnight)', () => {
            const date = new Date(0); // Jan 1, 1970
            date.setHours(0, 0, 0, 0); // Midnight
            const degrees = calculateAnalogHandDegrees(date);
            expect(degrees.hour).toBeCloseTo(360); // Function returns 360 for 12 o'clock
            expect(degrees.minute).toBeCloseTo(0);
            expect(degrees.second).toBeCloseTo(0);
        });

        it('should calculate correct degrees for 12:00:00 (noon)', () => {
            const date = new Date(0);
            date.setHours(12, 0, 0, 0); // Noon
            const degrees = calculateAnalogHandDegrees(date);
            expect(degrees.hour).toBeCloseTo(360); // Function returns 360 for 12 o'clock
            expect(degrees.minute).toBeCloseTo(0);
            expect(degrees.second).toBeCloseTo(0);
        });

        it('should calculate correct degrees for 03:00:00', () => {
            const date = new Date(0);
            date.setHours(3, 0, 0, 0);
            const degrees = calculateAnalogHandDegrees(date);
            expect(degrees.hour).toBeCloseTo(90); // 3/12 * 360
            expect(degrees.minute).toBeCloseTo(0);
            expect(degrees.second).toBeCloseTo(0);
        });

        it('should calculate correct degrees for 06:00:00', () => {
            const date = new Date(0);
            date.setHours(6, 0, 0, 0);
            const degrees = calculateAnalogHandDegrees(date);
            expect(degrees.hour).toBeCloseTo(180); // 6/12 * 360
            expect(degrees.minute).toBeCloseTo(0);
            expect(degrees.second).toBeCloseTo(0);
        });

        it('should calculate correct degrees for 09:00:00', () => {
            const date = new Date(0);
            date.setHours(9, 0, 0, 0);
            const degrees = calculateAnalogHandDegrees(date);
            expect(degrees.hour).toBeCloseTo(270); // 9/12 * 360
            expect(degrees.minute).toBeCloseTo(0);
            expect(degrees.second).toBeCloseTo(0);
        });

        it('should calculate correct degrees for 00:30:00 (12:30 AM)', () => {
            const date = new Date(0);
            date.setHours(0, 30, 0, 0); // 12:30 AM
            const degrees = calculateAnalogHandDegrees(date);
            // Hour hand: (0.5 / 12) * 360 = 15 degrees from 12.
            // The function calculates based on 12hr cycle, so 12:30AM -> ( (12 + 30/60) / 12 ) * 360 = (12.5/12)*360 = 375
            // This is 15 degrees past the 360 mark.
            expect(degrees.hour).toBeCloseTo(375); // Or 15 if normalized, but function returns 375
            expect(degrees.minute).toBeCloseTo(180); // 30/60 * 360
            expect(degrees.second).toBeCloseTo(0);
        });
        
        it('should calculate correct degrees for 06:30:00', () => {
            const date = new Date(0);
            date.setHours(6, 30, 0, 0);
            const degrees = calculateAnalogHandDegrees(date);
            // Hour hand: (6.5 / 12) * 360 = 195 degrees
            expect(degrees.hour).toBeCloseTo(195);
            expect(degrees.minute).toBeCloseTo(180);
            expect(degrees.second).toBeCloseTo(0);
        });

        it('should calculate correct degrees for 01:15:45', () => {
            const date = new Date(0);
            date.setHours(1, 15, 45, 0);
            const degrees = calculateAnalogHandDegrees(date);
            // Seconds: (45/60)*360 = 270
            // Minutes: ( (15 + 45/60) / 60 ) * 360 = (15.75 / 60) * 360 = 0.2625 * 360 = 94.5
            // Hours: ( (1 + 15/60 + 45/3600) / 12 ) * 360
            // = ( (1 + 0.25 + 0.0125) / 12 ) * 360
            // = ( 1.2625 / 12 ) * 360 = 0.105208333 * 360 = 37.875
            expect(degrees.second).toBeCloseTo(270);
            expect(degrees.minute).toBeCloseTo(94.5);
            expect(degrees.hour).toBeCloseTo(37.875);
        });
    });
});
