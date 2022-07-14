/**
 * Title: Setting up data library
 * Description: All read and write operation in data execute here
 * Author: Hasibul Islam
 * Date: 14/07/2022
 */

/* dependency */
const fs = require('fs');
const path = require('path');

/* lib object - module scaffolding */
const lib = {};

/* setting up base directory that is .data */
lib.basedir = path.join(__dirname, '/../.data/');

/* write data to file */
lib.create = (dir, file, data, callBack) => {
    // open file for writing
    fs.open(`${lib.basedir + dir}/${file}.json`, 'wx', (error, fileDescriptor) => {
        if (!error && fileDescriptor) {
            // convert data to string
            const stringifiedData = JSON.stringify(data);

            // write data to the file
            fs.writeFile(fileDescriptor, stringifiedData, err => {
                if (!err) {
                    fs.close(fileDescriptor, er => {
                        if (!er) {
                            callBack(false);
                        } else {
                            callBack("Error occurs, file close!");
                        }
                    })
                } else {
                    callBack("Facing interruption, closing new file!");
                }
            })
        } else {
            callBack(`Couldn't create new file as:: ${dir} ::directory may exists!`);
        }
    })
};

/* export module as external module */
module.exports = lib;