/**
 * Title: Catch user given password
 * Description: Make confirm password is secured
 * Author: Hasibul Islam
 * Date: 14/07/2022
 */

/* dependency */
const crypto = require('crypto');
const environment = require('../utilities/environment');

/* user utility object - module scaffolding */
const hashUtils = {};

// parse JSON string to object
hashUtils.hash = (userPassword) => {
    if (typeof userPassword === 'string' && userPassword.length > 0) {
        const hash = crypto.createHmac('sha256', environment.secretKey)
            .update(userPassword).digest('hex');

        return hash;
    } else {
        return null;
    }
}

/* export module as external module */
module.exports = hashUtils;
