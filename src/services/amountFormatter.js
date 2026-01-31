/**
 * Amount Formatter
 * Formats numbers according to Moroccan/French banking standards
 * 
 * Format rules:
 * - Space as thousands separator (not comma or period)
 * - Comma as decimal separator
 * - Always 2 decimal places
 * 
 * Example: 10500.50 → "10 500,50"
 */

/**
 * Format a number as currency string
 * @param {number|string} amount - The amount to format
 * @returns {string} Formatted amount string
 */
export function formatAmount(amount) {
    // Parse the amount
    let numAmount = amount;

    if (typeof amount === 'string') {
        // Handle both dot and comma as decimal separator
        numAmount = parseFloat(amount.replace(/\s/g, '').replace(',', '.'));
    }

    if (isNaN(numAmount)) {
        return '';
    }

    // Round to 2 decimal places
    numAmount = Math.round(numAmount * 100) / 100;

    // Split into integer and decimal parts
    const parts = numAmount.toFixed(2).split('.');
    const integerPart = parts[0];
    const decimalPart = parts[1];

    // Add space as thousands separator
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

    return formattedInteger + ',' + decimalPart;
}

/**
 * Parse a formatted amount string back to a number
 * @param {string} formattedAmount - The formatted amount string
 * @returns {number} The numeric value
 */
export function parseAmount(formattedAmount) {
    if (!formattedAmount) return 0;

    // Remove spaces and replace comma with dot
    const cleaned = formattedAmount.replace(/\s/g, '').replace(',', '.');
    const num = parseFloat(cleaned);

    return isNaN(num) ? 0 : num;
}

/**
 * Format amount as user types (live formatting)
 * @param {string} input - Raw input from user
 * @returns {string} Partially formatted string
 */
export function formatAmountLive(input) {
    // Remove all non-numeric characters except comma and dot
    let cleaned = input.replace(/[^\d,.]/g, '');

    // Replace dot with comma (French format)
    cleaned = cleaned.replace('.', ',');

    // Ensure only one comma
    const commaCount = (cleaned.match(/,/g) || []).length;
    if (commaCount > 1) {
        const parts = cleaned.split(',');
        cleaned = parts[0] + ',' + parts.slice(1).join('');
    }

    // Limit decimal places to 2
    const parts = cleaned.split(',');
    if (parts[1] && parts[1].length > 2) {
        parts[1] = parts[1].substring(0, 2);
        cleaned = parts.join(',');
    }

    // Add thousands separators to integer part
    if (parts[0]) {
        const intPart = parts[0].replace(/\s/g, '');
        const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
        cleaned = formattedInt + (parts[1] !== undefined ? ',' + parts[1] : '');
    }

    return cleaned;
}

export default { formatAmount, parseAmount, formatAmountLive };
