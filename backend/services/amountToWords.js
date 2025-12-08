const { toWords } = require('number-to-words');

/**
 * Convert amount to words (Indian Rupees format)
 * @param {Number} amount - The amount to convert
 * @returns {String} - Amount in words
 */
function amountToWords(amount) {
    if (!amount || amount === 0) {
        return 'Zero Rupees Only';
    }

    const rupees = Math.floor(amount);
    const paise = Math.round((amount - rupees) * 100);

    let words = toWords(rupees).replace(/-/g, ' ');
    // Capitalize first letter of each word
    words = words.split(' ').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');

    words += ' Rupees';

    if (paise > 0) {
        let paiseWords = toWords(paise).replace(/-/g, ' ');
        paiseWords = paiseWords.split(' ').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
        words += ' and ' + paiseWords + ' Paise';
    }

    return words + ' Only';
}

module.exports = { amountToWords };
