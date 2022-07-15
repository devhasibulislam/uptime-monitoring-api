/**
 * Title: Worker library
 * Description: Worker credentials containing file
 * Author: Hasibul Islam
 * Date: 15/07/2022
 */

/* dependencies */
const url = require('url');
const http = require('http');
const https = require('https');
const data = require('../lib/data');
const { parseJSON } = require('../utilities/userUtils');
const { sendTwilioSMS } = require('../utilities/notifications');

/* worker object - module scaffolding */
const worker = {};

/* lookup all the checks from db */
worker.gatherAllChecks = () => {
    // get all the checks
    data.readAll('checks', (error, checks) => {
        if (!error && checks && checks.length > 0) {
            checks.forEach(check => {
                // read check data
                data.read('checks', check, (err, data) => {
                    if (!err && data) {
                        // check validity
                        worker.validateCheckData(parseJSON(data));
                    } else {
                        console.log('error in reading check data');
                    }
                })
            })
        } else {
            console.log('could not locate any check');
        }
    })
}

/* validate individual check data */
worker.validateCheckData = (data) => {
    if (data && data.id) {
        const checkData = data;
        checkData.state = typeof checkData.state === 'string'
            && ['up', 'down'].indexOf(checkData.state) > -1
            ? checkData.state
            : 'down';

        checkData.lastChecked = typeof checkData.lastChecked === 'number'
            && checkData.lastChecked > 0
            ? checkData.lastChecked
            : null;

        // pass check data for further process
        worker.performCheck(checkData);
    } else {
        console.log('interrupt check data');
    }
}

/* perform check */
worker.performCheck = (checkData) => {
    // prepare initial check outcome
    let checkOutcome = {
        'error': false,
        'responseCode': null
    };
    let outcomeSent = false;

    // parse host name and url data
    const parsedURL = url.parse(`${checkData.protocol}://${checkData.url}`, true);
    const hostName = parsedURL.hostname;
    const { path } = parsedURL;

    // construct the url
    const requestDetails = {
        protocol: `${checkData.protocol}:`,
        hostname: hostName,
        method: checkData.method.toUpperCase(),
        path,
        timeout: checkData.timeOutSeconds * 1000
    };

    const protocolToUse = checkData.protocol === 'http' ? http : https;

    const req = protocolToUse.request(requestDetails, res => {
        // grab the status code of response
        const status = res.statusCode;

        // update the check result outcome to db
        checkOutcome.responseCode = status;
        if (!outcomeSent) {
            worker.processCheckOutcome(checkData, checkOutcome);
            outcomeSent = true;
        }
    });

    req.on('error', e => {
        checkOutcome = {
            error: true,
            value: e
        }

        // update the check result outcome to db
        if (!outcomeSent) {
            worker.processCheckOutcome(checkData, checkOutcome);
            outcomeSent = true;
        }
    });

    req.on('timeout', e => {
        checkOutcome = {
            error: true,
            value: 'timeout'
        }

        // update the check result outcome to db
        if (!outcomeSent) {
            worker.processCheckOutcome(checkData, checkOutcome);
            outcomeSent = true;
        }
    });
}

/* check outcome weather conduct with db or not */
worker.processCheckOutcome = (checkData, checkOutcome) => {
    // check if outcome up or down
    const state = !checkOutcome.error
        && checkOutcome.responseCode
        && checkData.successCode.indexOf(checkOutcome.responseCode) > -1
        ? 'up'
        : 'down';

    // alert sent to user or not
    const alertWanted = !!(checkData.lastChecked && checkData.state !== state);

    // update check data
    const newCheckData = checkData;
    newCheckData.state = state;
    newCheckData.lastChecked = Date.now();

    // update check to db
    data.update('checks', newCheckData.id, newCheckData, err => {
        if (!err) {
            if (alertWanted) {
                worker.alertUserToStatusChange(newCheckData);
            } else {
                console.log('no need alert for no change');
            }
        } else {
            console.log('error in update data to db');
        }
    })
}

/* save check outcome to db and sent alert to user */
worker.alertUserToStatusChange = (checkData) => {
    const message = `Alert you check for ${checkData.method.toUpperCase()} ${checkData.protocol}://${checkData.url} is currently ${checkData.state}`;

    sendTwilioSMS(checkData.phoneNumber, message, err => {
        if (!err) {
            console.log(`alerted ${message}  via status change`);
        } else {
            console.log(`${err}  in sending error`);
        }
    });
}

/* execute worker process per minute */
worker.loopAllChecks = () => {
    setInterval(() => {
        worker.gatherAllChecks();
    }, 6000);
}

/* start the worker */
worker.init = () => {
    // execute all the checks
    worker.gatherAllChecks();

    // call the loop to execute checks
    worker.loopAllChecks();
}

/* export module */
module.exports = worker;
