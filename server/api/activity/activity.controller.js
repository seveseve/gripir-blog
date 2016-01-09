'use strict';

var _ = require('lodash');
var marked = require('marked');
var cheerio = require('cheerio');
var hljs = require('highlight.js');
var Activity = require('./activity.model');

// Get list of activitys
exports.index = function(req, res) {
  Activity.find(function (err, activitys) {
    if(err) { return handleError(res, err); }

    if(req.query.marked) {
      for (var i = 0; i < activitys.length; i++) {
        activitys[i].text = marked(activitys[i].text);
      };
    }

    if(req.query.hljs) {
      for (var i = 0; i < activitys.length; i++) {
        activitys[i].text = highlightPreCodeElements(activitys[i].text);
      }
    }
    
    return res.status(200).json(activitys);
  });
};

var highlightPreCodeElements = function (htmlText) {
  var $ = cheerio.load(htmlText);

   $('pre code').each(function(i, block) {
    if ($(this).attr('class') && $(this).attr('class').slice(0, 4) === 'lang') {
      var indexOfMinus = $(this).attr('class').indexOf('-');
      var language = $(this).attr('class').substr(indexOfMinus + 1);
      $(this).html(hljs.highlight(language, $(this).text()).value);
    }
  });

  return $.html();
};

// Get a single activity
exports.show = function(req, res) {
  Activity.findById(req.params.id, function (err, activity) {
    if(err) { return handleError(res, err); }
    if(!activity) { return res.status(404).send('Not Found'); }
    
    if(req.query.marked) { activity.text = marked(activity.text); }

    if(req.query.hljs) { activity.text = highlightPreCodeElements(activity.text); }

    return res.json(activity);
  });
};

// Creates a new activity in the DB.
exports.create = function(req, res) {
  Activity.create(req.body, function(err, activity) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(activity);
  });
};

// Updates an existing activity in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Activity.findById(req.params.id, function (err, activity) {
    if (err) { return handleError(res, err); }
    if(!activity) { return res.status(404).send('Not Found'); }
    var updated = _.merge(activity, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(activity);
    });
  });
};

// Deletes a activity from the DB.
exports.destroy = function(req, res) {
  Activity.findById(req.params.id, function (err, activity) {
    if(err) { return handleError(res, err); }
    if(!activity) { return res.status(404).send('Not Found'); }
    activity.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}