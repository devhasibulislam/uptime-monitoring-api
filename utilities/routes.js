/**
 * Title: Trigger all routes
 * Description: Get all routes from user or system defined
 * Author: Hasibul Islam
 * Date: 14/07/2022
 */

/* dependency */
const { sampleHandler } = require('../routes/sampleHandler');
const { userHandler } = require('../routes/userHandler');
const { tokenHandler } = require('../routes/tokenHandler');

/* routes object */
const routes = {
    sample: sampleHandler,
    user: userHandler,
    token: tokenHandler
};

/* export module as external module */
module.exports = routes;
