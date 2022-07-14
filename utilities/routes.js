/**
 * Title: Trigger all routes
 * Description: Get all routes from user or system defined
 * Author: Hasibul Islam
 * Date: 14/07/2022
 */

/* dependency */
const { sampleHandler } = require('../routes/sampleHandler');

/* routes object */
const routes = {
    sample: sampleHandler,
};

/* export module as external module */
module.exports = routes;
