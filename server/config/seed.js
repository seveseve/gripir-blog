/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Activity = require('../api/activity/activity.model');
var Comment  = require('../api/comment/comment.model');
var User = require('../api/user/user.model');

module.exports = { 
    seed: function() {

        Activity.find({}).remove(function() {
            Activity.create({
                title : 'Development Tools',
                author : 'Severin Friede',
                text : 'Integration with popular tools such as Bower, Grunt, Karma, Mocha, JSHint, Node Inspector, Livereload, Protractor, Jade, Stylus, Sass, CoffeeScript, and Less.'
            }, {
                title : 'Server and Client integration',
                author : 'Severin Friede',
                text : 'Built with a powerful and fun stack: MongoDB, Express, AngularJS, and Node.'
            }, {
                title : 'Smart Build System',
                author : 'Severin Friede',
                text : 'Build system ignores `spec` files, allowing you to keep tests alongside code. Automatic injection of scripts and styles into your index.html'
            }, {
                title : 'Modular Structure',
                author : 'Severin Friede',
                text : 'Best practice client and server structures allow for more code reusability and maximum scalability'
            }, {
                title : 'Optimized Build',
                author : 'Severin Friede',
                text : 'Build process packs up your templates as a single JavaScript payload, minifies your scripts/css/images, and rewrites asset names for caching.'
            }, {
                title : 'Deployment Ready',
                author : 'Severin Friede',
                text : 'Easily deploy your app to Heroku or Openshift with the heroku and openshift subgenerators'
            }, function() {
                console.log('finished populating activities');
            });
        });
    
        User.find({}).remove(function() {
            User.create({
                provider: 'local',
                name: 'Test User',
                email: 'test@test.com',
                password: 'test'
            }, {
                provider: 'local',
                role: 'admin',
                name: 'Admin',
                email: 'admin@admin.com',
                password: 'admin'
            }, function() {
                console.log('finished populating users');
            });
        });
    }
}