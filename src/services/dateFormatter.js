/**
 * Date Formatter
 * Formats dates according to French banking standards
 * 
 * Format: DD-MM-YYYY or DD/MM/YYYY (configurable)
 */

/**
 * Format a date object or string to French format
 * @param {Date|string} date - The date to format
 * @param {string} separator - The separator to use ('-' or '/')
 * @returns {string} Formatted date string
 */
export function formatDate(date, separator = '-') {
    if (!date) return '';

    let dateObj = date;

    if (typeof date === 'string') {
        // Try parsing various formats
        if (date.includes('/')) {
            const parts = date.split('/');
            if (parts[2]?.length === 4) {
                // Already in DD/MM/YYYY format
                dateObj = new Date(parts[2], parts[1] - 1, parts[0]);
            } else {
                dateObj = new Date(date);
            }
        } else if (date.includes('-')) {
            const parts = date.split('-');
            if (parts[0].length === 4) {
                // ISO format YYYY-MM-DD
                dateObj = new Date(date);
            } else {
                // DD-MM-YYYY format
                dateObj = new Date(parts[2], parts[1] - 1, parts[0]);
            }
        } else {
            dateObj = new Date(date);
        }
    }

    if (!(dateObj instanceof Date) || isNaN(dateObj)) {
        return '';
    }

    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();

    return `${day}${separator}${month}${separator}${year}`;
}

/**
 * Format date for input (YYYY-MM-DD for HTML date input)
 * @param {Date|string} date - The date to format
 * @returns {string} ISO format date string
 */
export function formatDateForInput(date) {
    if (!date) return '';

    let dateObj = date instanceof Date ? date : new Date(date);

    if (isNaN(dateObj)) {
        return '';
    }

    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

/**
 * Parse a French format date string to Date object
 * @param {string} dateStr - Date string in DD-MM-YYYY or DD/MM/YYYY format
 * @returns {Date|null} Date object or null if invalid
 */
export function parseFrenchDate(dateStr) {
    if (!dateStr) return null;

    const separatorMatch = dateStr.match(/[-/]/);
    if (!separatorMatch) return null;

    const separator = separatorMatch[0];
    const parts = dateStr.split(separator);

    if (parts.length !== 3) return null;

    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);

    const date = new Date(year, month, day);

    // Validate the date
    if (date.getDate() !== day || date.getMonth() !== month || date.getFullYear() !== year) {
        return null;
    }

    return date;
}

/**
 * Get today's date formatted
 * @param {string} separator - The separator to use
 * @returns {string} Today's date formatted
 */
export function getToday(separator = '-') {
    return formatDate(new Date(), separator);
}

export default { formatDate, formatDateForInput, parseFrenchDate, getToday };
