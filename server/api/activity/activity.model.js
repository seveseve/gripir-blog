'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ActivitySchema = new Schema({
  title: String,
  author: String,
  createdAt: { type: Date, default: Date.now },
  text: String,
  active: Boolean
});

module.exports = mongoose.model('Activity', ActivitySchema);