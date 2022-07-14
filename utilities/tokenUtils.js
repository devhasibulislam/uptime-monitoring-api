/**
 * Title: Setting up random strings
 * Description: Set up on a variable corresponding to random strings as token
 * Author: Hasibul Islam
 * Date: 14/07/2022
 */

/* environment object - module scaffolding */
const tokenUtils = {};

/* getting random string as far as token id style */
tokenUtils.createRandomStrings = (len) => {
    // store the length in a temporary variable and validate it
    let length = len;
    length = typeof length === 'number' && len > 0 ? len : null;

    // achieving random string
    if (length) {
        // characters selection with respect to ASCII
        const lowerCases = 'abcdefghijklmnopqrstuvwxyz';
        const upperCases = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numbers = '1234567890';
        const symbols = '_-';
        const tokenCharacters = lowerCases + upperCases + numbers + symbols;

        // random stored variable
        let output = '';

        // generating random token id
        for (let i = 0; i < length; ++i) {
            const randomCharacters = tokenCharacters.charAt(Math.floor(Math.random() * tokenCharacters.length));
            output += randomCharacters;
        }

        return output;
    }
}

/* export module as external module */
module.exports = tokenUtils;
