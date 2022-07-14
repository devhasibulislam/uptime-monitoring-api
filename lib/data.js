/**
 * Title: Setting up data library
 * Description: All read and write operation in data execute here
 * Author: Hasibul Islam
 * Date: 14/07/2022
 */

// dependency
const fs = require('fs');
const path = require('path');

// lib object - module scaffolding
const lib = {};

// setting up base directory that is .data
lib.basedir = path.join(__dirname, '/../data/');