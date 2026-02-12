/**
 * French Number to Text Converter
 * Converts numeric amounts to French text following Moroccan/French banking rules
 * 
 * Rules:
 * - "vingt" takes "s" only when multiplied and not followed by another number
 * - "cent" takes "s" only when multiplied and not followed by another number  
 * - "mille" NEVER takes "s" in French
 * - Currency: "dirhams" (plural) and "centimes"
 */

const units = [
    '', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf',
    'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf'
];

const tens = [
    '', '', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante', 'quatre-vingt', 'quatre-vingt'
];

/**
 * Convert a number from 0 to 99 to French text
 */
function convertTens(n) {
    if (n < 20) {
        return units[n];
    }

    const ten = Math.floor(n / 10);
    const unit = n % 10;

    // Special cases for French numbers
    if (ten === 7 || ten === 9) {
        // 70-79 uses soixante-dix, 90-99 uses quatre-vingt-dix
        const base = ten === 7 ? 'soixante' : 'quatre-vingt';
        const remainder = 10 + unit;

        if (remainder === 11 && ten === 7) {
            return 'soixante et onze';
        }
        return base + '-' + units[remainder];
    }

    if (ten === 8) {
        // quatre-vingts (with s) only when alone
        if (unit === 0) {
            return 'quatre-vingts';
        }
        return 'quatre-vingt-' + units[unit];
    }

    if (unit === 0) {
        return tens[ten];
    }

    if (unit === 1 && ten !== 8) {
        return tens[ten] + ' et un';
    }

    return tens[ten] + '-' + units[unit];
}

/**
 * Convert a number from 0 to 999 to French text
 */
function convertHundreds(n) {
    if (n < 100) {
        return convertTens(n);
    }

    const hundred = Math.floor(n / 100);
    const remainder = n % 100;

    let result = '';

    if (hundred === 1) {
        result = 'cent';
    } else {
        result = units[hundred] + ' cent';
        // "cents" takes s only when multiplied and not followed by another number
        if (remainder === 0) {
            result += 's';
        }
    }

    if (remainder > 0) {
        result += ' ' + convertTens(remainder);
    }

    return result;
}

/**
 * Convert a number to French text (up to 999,999,999,999)
 */
function numberToFrench(n) {
    if (n === 0) return 'zéro';
    if (n < 0) return 'moins ' + numberToFrench(-n);

    let result = '';

    // Billions
    const billions = Math.floor(n / 1000000000);
    if (billions > 0) {
        if (billions === 1) {
            result += 'un milliard';
        } else {
            result += convertHundreds(billions) + ' milliards';
        }
        n %= 1000000000;
        if (n > 0) result += ' ';
    }

    // Millions
    const millions = Math.floor(n / 1000000);
    if (millions > 0) {
        if (millions === 1) {
            result += 'un million';
        } else {
            result += convertHundreds(millions) + ' millions';
        }
        n %= 1000000;
        if (n > 0) result += ' ';
    }

    // Thousands - "mille" never takes "s"
    const thousands = Math.floor(n / 1000);
    if (thousands > 0) {
        if (thousands === 1) {
            result += 'mille';
        } else {
            result += convertHundreds(thousands) + ' mille';
        }
        n %= 1000;
        if (n > 0) result += ' ';
    }

    // Hundreds, tens, units
    if (n > 0) {
        result += convertHundreds(n);
    }

    return result;
}

/**
 * Convert an amount to French text with currency
 * @param {number|string} amount - The amount (e.g., 1234.56 or "1234,56")
 * @returns {string} French text representation with dirhams and centimes
 */
export function convertAmountToFrench(amount) {
    // Parse the amount
    let numAmount = amount;

    if (typeof amount === 'string') {
        // Handle French format with comma as decimal separator
        numAmount = parseFloat(amount.replace(/\s/g, '').replace(',', '.'));
    }

    if (isNaN(numAmount) || numAmount < 0) {
        return '';
    }

    // Split into dirhams and centimes
    const dirhams = Math.floor(numAmount);
    const centimes = Math.round((numAmount - dirhams) * 100);

    let result = '';

    // Dirhams part
    if (dirhams === 0) {
        result = 'Zéro dirham';
    } else if (dirhams === 1) {
        result = 'Un dirham';
    } else {
        const text = numberToFrench(dirhams);
        // En français, "million(s)" et "milliard(s)" sont suivis de "de" devant un nom
        const needsDe = /millions?$|milliards?$/.test(text);
        result = capitalizeFirst(text) + (needsDe ? ' de dirhams' : ' dirhams');
    }

    // Centimes part
    if (centimes > 0) {
        result += ' et ';
        if (centimes === 1) {
            result += 'un centime';
        } else {
            result += numberToFrench(centimes) + ' centimes';
        }
    }

    return result;
}

/**
 * Capitalize the first letter of a string
 */
function capitalizeFirst(str) {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export default convertAmountToFrench;
