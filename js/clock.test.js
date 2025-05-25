import { formatDate, formatDigitalTime } from './clock.js';

describe('js/clock.js', () => {
    describe('formatDate', () => {
        it('should format a specific date correctly', () => {
            // Note: toLocaleDateString can vary by environment/locale.
            // For consistency in tests, mock it or test specific parts if needed.
            // Here, we'll assume a US-English-like default for the test environment.
            const date = new Date(2024, 0, 15); // Month is 0-indexed, so 0 is January
            // Expected format: "Monday, January 15, 2024" or similar based on locale
            // This test might be fragile due to locale differences.
            // A more robust test might check if the year, month, day are present.
            const formatted = formatDate(date);
            expect(formatted).toContain('January'); 
            expect(formatted).toContain('15');
            expect(formatted).toContain('2024');
            expect(formatted).toContain('Monday'); // This part is highly locale-dependent
        });

        it('should format another specific date correctly', () => {
            const date = new Date(2023, 5, 1); // June 1, 2023
            const formatted = formatDate(date);
            expect(formatted).toContain('June');
            expect(formatted).toContain('1');
            expect(formatted).toContain('2023');
            expect(formatted).toContain('Thursday');
        });
    });

    describe('formatDigitalTime', () => {
        it('should format time as HH:MM:SS AM for morning', () => {
            const date = new Date(2024, 0, 15, 9, 5, 3); // 09:05:03 AM
            expect(formatDigitalTime(date)).toBe('09:05:03 AM');
        });

        it('should format time as HH:MM:SS PM for afternoon', () => {
            const date = new Date(2024, 0, 15, 14, 30, 15); // 02:30:15 PM
            expect(formatDigitalTime(date)).toBe('02:30:15 PM');
        });

        it('should format midnight correctly (12:XX:XX AM)', () => {
            const date = new Date(2024, 0, 15, 0, 0, 0); // 12:00:00 AM
            expect(formatDigitalTime(date)).toBe('12:00:00 AM');
        });

        it('should format noon correctly (12:XX:XX PM)', () => {
            const date = new Date(2024, 0, 15, 12, 0, 0); // 12:00:00 PM
            expect(formatDigitalTime(date)).toBe('12:00:00 PM');
        });

        it('should format time just before midnight correctly', () => {
            const date = new Date(2024, 0, 15, 23, 59, 59); // 11:59:59 PM
            expect(formatDigitalTime(date)).toBe('11:59:59 PM');
        });

        it('should format time just before noon correctly', () => {
            const date = new Date(2024, 0, 15, 11, 59, 59); // 11:59:59 AM
            expect(formatDigitalTime(date)).toBe('11:59:59 AM');
        });
    });
});
