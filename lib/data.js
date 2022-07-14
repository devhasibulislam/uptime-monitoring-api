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

/* read data from file */
lib.read = (dir, file, callBack) => {
    // open file and read out
    fs.readFile(`${lib.basedir + dir}/${file}.json`, 'utf-8', (error, data) => {
        callBack(error, data);
    })
}

/* update data from file */
lib.update = (dir, file, data, callBack) => {
    // open file for writing
    fs.open(`${lib.basedir + dir}/${file}.json`, 'r+', (error, fileDescriptor) => {
        if (!error && fileDescriptor) {
            // convert data to a string object
            const stringifiedData = JSON.stringify(data);

            // truncate the file
            fs.ftruncate(fileDescriptor, err => {
                if (!err) {
                    // let the file closed after updating
                    fs.writeFile(fileDescriptor, stringifiedData, er => {
                        if (!er) {
                            // confirm file close
                            fs.close(fileDescriptor, e => {
                                if (!e) {
                                    callBack(false);
                                } else {
                                    callBack('Error closing existing file!');
                                }
                            });
                        } else {
                            callBack('Error writing on existing file!');
                        }
                    });
                } else {
                    callBack('Error occurs in truncating an existing file!')
                }
            });
        } else {
            callBack(`Error updating an existing file as:: ${file} ::may or not exists!`);
        }
    });
};

/* delete an existing file */
lib.delete = (dir, file, callBack) => {
    // unlink mentioned file
    fs.unlink(`${lib.basedir + dir}/${file}.json`, err => {
        if (!err) {
            callBack(false);
        } else {
            callBack('Error occurs in deleting file!')
        }
    })
};

/* export module as external module */
module.exports = lib;
