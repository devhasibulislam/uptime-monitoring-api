/**
 * Title: Setting up environment
 * Description: Set up environment variable corresponding to staging or production purpose
 * Author: Hasibul Islam
 * Date: 14/07/2022
 */

/* environment object - module scaffolding */
const environment = {};

/* set up environment for staging or development purpose */
environment.staging = {
    port: 3000,
    envName: 'staging'
}

/* set up environment for production purpose */
environment.production = {
    port: 5000,
    envName: 'production'
}

/* determined which environment was passed */
const currentEnvironment = typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV : 'staging';

/* export corresponding environment object */
const environmentToExport =
    typeof environment[currentEnvironment] === 'object'
        ? environment[currentEnvironment]
        : environment.staging;

/* export module as external module */
module.exports = environmentToExport;

/* problem fix reference: */
// https://stackoverflow.com/questions/11928013/node-env-is-not-recognized-as-an-internal-or-external-command-operable-comman