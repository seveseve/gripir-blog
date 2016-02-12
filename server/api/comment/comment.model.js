'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CommentSchema = new Schema({
    text: String,
    userId: Schema.Types.ObjectId,
    activityId: Schema.Types.ObjectId
});

module.exports = mongoose.model('Comment', CommentSchema);
