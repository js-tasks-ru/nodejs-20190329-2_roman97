const mongoose = require('mongoose');
const {Types: {ObjectId}} = mongoose;

// eslint-disable-next-line require-jsdoc
function isValidObjectId(id) {
  return ObjectId.isValid(id);
}

module.exports = isValidObjectId;
