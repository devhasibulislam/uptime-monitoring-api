/**
 * Title: Catch user given informations
 * Description: Make confirm whatever info use given get to be corrected
 * Author: Hasibul Islam
 * Date: 14/07/2022
 */

/* user utility object - module scaffolding */
const userUtils = {};

// parse JSON string to object
userUtils.parseJSON = (stringifiedInfo) => {
    let output = {};

    // confirm correct validity
    try {
        output = JSON.parse(stringifiedInfo);
    } catch {
        output = {};
    }

    return output;
}

/* export module as external module */
module.exports = userUtils;
