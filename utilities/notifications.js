/**
 * Title: Notification library
 * Description: A library that notify user through phone number
 * Author: Hasibul Islam
 * Date: 15/07/2022
 */

/* dependency */
const https = require('https');
const querystring = require('querystring');
const { twilio } = require('./environment');

/* module scaffolding */
const notifications = {};

/* send sms to user using twilio api */
notifications.sendTwilioSMS = (phoneNumber, messageBody, callBack) => {
    // input validation
    const phone = typeof phoneNumber === 'string'
        && phoneNumber.trim().length === 11
        ? phoneNumber.trim()
        : null;

    const message = typeof messageBody === 'string'
        && messageBody.trim().length > 0 && messageBody.trim().length < 1600
        ? messageBody
        : null;

    if (phone && message) {
        // configure the request payload
        const payload = {
            From: twilio.phoneNumber,
            To: `+88${phone}`,
            Body: message,
        };

        // stringify payload
        const stringifiedPayload = querystring.stringify(payload);

        // configure request details
        const requestDetails = {
            hostname: 'api.twilio.com',
            method: 'POST',
            path: `/2010-04-01/Accounts/${twilio.accountSID}/Messages.json`,
            auth: `${twilio.accountSID}:${twilio.authToken}`,
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
            },
        }

        // instantiate request
        const req = https.request(requestDetails, res => {
            // get status code from sent request
            const status = res.statusCode;

            // check weather request went through
            if (status === 200 || status === 201) {
                callBack(false);
            } else {
                callBack(`status code ${status}`);
            }
        })

        req.on('error', err => {
            callBack(err);
        })

        req.write(stringifiedPayload);
        req.end();
    } else {
        callBack('invalid parameters');
    }
}

/* export module */
module.exports = notifications;
