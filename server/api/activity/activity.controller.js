'use strict';

var _ = require('lodash');
var marked = require('marked');
var cheerio = require('cheerio');
var hljs = require('highlight.js');
var Activity = require('./activity.model');
var Comment = require('../comment/comment.model');

// Get list of activitys
exports.index = function (req, res) {
    Activity.find(function (err, activitys) {
        if (err) { return handleError(res, err); }

        // add markdown
        if (req.query.marked) {
            for (var i = 0; i < activitys.length; i++) {
                activitys[i].text = marked(activitys[i].text);
            }
        }

        // add syntax highlighting
        if (req.query.hljs) {
            for (var j = 0; j < activitys.length; j++) {
                activitys[j].text = highlightPreCodeElements(activitys[j].text);
            }
        }
    
        // add links to comments and self
        for (var k = 0; k < activitys.length; k++) {
            activitys[k].links = addLinksTo(activitys[k]._id, req.baseUrl, activitys[k].comments.length > 0);
        }
    
        return res.status(200).json(activitys);
    });
}

// Get a single activity
exports.show = function(req, res) {
    Activity.findById(req.params.id, function (err, activity) {
        if(err) { return handleError(res, err); }
        if(!activity) { return res.status(404).send('Not Found'); }
        
        // add markdown
        if(req.query.marked) { activity.text = marked(activity.text); }
        
        // add syntax highlighting
        if(req.query.hljs) { activity.text = highlightPreCodeElements(activity.text); }

        // add links to comments and self
        activity.links = addLinksTo(activity._id, req.baseUrl, activity.comments.length > 0);

        return res.json(activity);
    });
}

// Creates a new activity in the DB.
exports.create = function (req, res) {
    Activity.create(req.body, function (err, activity) {
        if (err) { return handleError(res, err); }
    
        // add link to self but not to comments because
        // there are none yet
        activity.links = addLinksTo(activity._id, req.baseUrl, false);
    
        return res.status(201)
                  .location(req.baseUrl + '/' + activity._id)
                  .json(activity);
    });
}

// Updates an existing activity in the DB.
exports.update = function (req, res) {
    if (req.body._id) { delete req.body._id; }
  
    Activity.findById(req.params.id, function (err, activity) {
        if (err) { return handleError(res, err); }
        if (!activity) { return res.status(404).send('Not Found'); }
        
        var updated = _.merge(activity, req.body);
        updated.save(function (err) {  
            if (err) { return handleError(res, err); }
            
            updated.links = addLinksTo(updated._id, req.baseUrl, updated.comments.length > 0);
      
            return res.status(200)
                      .location(req.baseUrl + '/' + updated._id)
                      .json(activity);
        });
    });
}

// Deletes an activity from the DB.
exports.destroy = function (req, res) {
    Activity.findById(req.params.id, function (err, activity) {
        if (err) { return handleError(res, err); }
        if (!activity) { return res.status(404).send('Not Found'); }
    
        activity.remove(function (err) {
            if (err) { return handleError(res, err); }     
      
            // find comments and remove them also
            Comment.find({ activityId: activity._id }).remove(function (err) {
                if (err) { return handleError(res, err); }
                return res.status(204).send('No Content'); 
            });
        });
    });
}

function handleError(res, err) {
    console.log(err);
    return res.status(500).send(err);
}

function highlightPreCodeElements(htmlText) {
    var $ = cheerio.load(htmlText);

    $('pre code').each(function (i, block) {
        if ($(this).attr('class') && $(this).attr('class').slice(0, 4) === 'lang') {
            var indexOfMinus = $(this).attr('class').indexOf('-');
            var language = $(this).attr('class').substr(indexOfMinus + 1);
            $(this).html(hljs.highlight(language, $(this).text()).value);
        }
    });

    return $.html();
}

function addLinksTo(activityId, baseUrl, hasComments) {  
    var links = []; 
    links.push({ ref: 'self', href: baseUrl + '/' + activityId });
    
    if (hasComments) {
        links.push({ ref: 'comments', href: baseUrl + '/'  + activityId + '/comments' });
    }
    
    return links;
}