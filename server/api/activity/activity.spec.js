'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var server = request.agent(app);
var mongoose = require('mongoose');
var Activity = require('./activity.model');
var User = require('../user/user.model');

var currentToken;

describe('GET /api/activities', function () {
    
    before(function (done) {
        Activity.remove().exec().then(function () {
            done();
        });
    });

    afterEach(function (done) {
        Activity.remove().exec().then(function () {
            done();
        });
    });
    
    it('should respond with empty JSON array', function(done) {
        request(app)
            .get('/api/activities')
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function(err, res) {
                if (err) return done(err);
        
                res.body.should.be.instanceof(Array);
                res.body.should.have.length(0);
                done();
        });
    });
    
    it('should respond with JSON array containing two activities', function (done) {
        Activity.create({ 
                title: 't1',
                author: 'a1',
                text: 'x1' 
            }, { 
                title: 't2',
                author: 'a2',
                text: 'x2'
            }, function () {
                request(app)
                    .get('/api/activities')
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end(function(err, res) {
                        if (err) return done(err);
                
                        res.body.should.be.instanceof(Array);
                        res.body.should.have.length(2);
                        
                        var a1 = res.body[0];
                        a1.should.have.properties(['title', 'author', 'text']);
                        a1.title.should.be.equal('t1');
                        a1.author.should.be.equal('a1');
                        a1.text.should.be.equal('x1');
                        var a2 = res.body[1];
                        a2.should.have.properties(['title', 'author', 'text']);
                        a2.title.should.be.equal('t2');
                        a2.author.should.be.equal('a2');
                        a2.text.should.be.equal('x2');
                        
                        done();
                    });   
            });
    });
});

describe('PUT /api/activities', function () {
    
    before(function (done) {
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
            }, done);
        });
    });
    
    before(function (done) {
        Activity.remove().exec().then(function () {
            done();
        });
    });

    afterEach(function (done) {
        Activity.remove().exec().then(function () {
            done();
        });
    });
    
    it('should fail because of no authorization', function (done) {
    
        var id = mongoose.Types.ObjectId();
        
        server
            .put('/api/activities/' + id)
            .expect(401)
            .end(function (err, res) {
                if (err) return done(err);
                done();
            });
    });
    it('login', loginUser());    
    it('should update an existing activity and return 200', function (done) {
        Activity.create({ 
                title: 't1',
                author: 'a1',
                text: 'x1' 
            }, function (err, activity) {
                server
                    .put('/api/activities/' + activity._id)
                    .query({access_token: currentToken})
                    .send({ title: 't2', author: 'a2', text: 'x2' })
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .end(function (err, res) {
                        
                        if (err) return done(err);
                        
                        var a1 = res.body;
                        a1.should.have.properties(['title', 'author', 'text']);
                        a1.title.should.be.equal('t2');
                        a1.author.should.be.equal('a2');
                        a1.text.should.be.equal('x2');
                        
                        res.headers.should.have.property('location');
                        res.headers.location.should.be.equal('/api/activities/' + a1._id);
                        
                        done();
                });
        });
    });
});

describe('POST /api/activities', function () {
    
    before(function (done) {
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
            }, done);
        });
    });
    
    before(function (done) {
        Activity.remove().exec().then(function () {
            done();
        });
    });

    afterEach(function (done) {
        Activity.remove().exec().then(function () {
            done();
        });
    });
    
    it('should fail because of no authorization', function (done) {
        server
            .post('/api/activities')
            .expect(401)
            .end(function (err, res) {
                if (err) return done(err);
                done();
            });
    });
    it('login', loginUser());    
    it('should create a new activity and return 201', function (done) {
        server
            .post('/api/activities')
            .query({access_token: currentToken})
            .send({ title: 't1', author: 'a1', text: 'x1' })
            .set('Content-Type', 'application/json')
            .expect(201)
            .end(function (err, res) {
                
                if (err) return done(err);
                
                var a1 = res.body;
                a1.should.have.properties(['title', 'author', 'text']);
                a1.title.should.be.equal('t1');
                a1.author.should.be.equal('a1');
                a1.text.should.be.equal('x1');
                
                res.headers.should.have.property('location');
                res.headers.location.should.be.equal('/api/activities/' + a1._id);
                
                done();
        });
    });
});

describe('GET /api/activities/:id', function() {
    
    before(function (done) {
        Activity.remove().exec().then(function () {
            done();
        });
    });

    afterEach(function (done) {
        Activity.remove().exec().then(function () {
            done();
        });
    });
    
    var id = mongoose.Types.ObjectId();
    
    it('should find no activity and return 404', function(done) {
        request(app)
            .get('/api/activities/' + id)
            .expect(404)
            .end(function(err, res) {
                if (err) return done(err);
                done();
        });
    });
    
    it('should fail with internal server error and return 500', function(done) {
        request(app)
            .get('/api/activities/abc')
            .expect(500)
            .end(function(err, res) {
                if (err) return done(err);
                done();
        });
    });
    
    it('should find exactly one activity and return 200', function (done) {
        Activity.create({ 
                title: 't1',
                author: 'a1',
                text: 'x1' 
            }, function (err, activity) {
                if (err) return done(err);
                
                request(app)
                    .get('/api/activities/' + activity._id)
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end(function (err, res) {
                        if (err) return done(err);
                        
                        var a1 = res.body;
                        a1.should.have.properties(['title', 'author', 'text']);
                        a1.title.should.be.equal('t1');
                        a1.author.should.be.equal('a1');
                        a1.text.should.be.equal('x1');
                        
                        done();        
                });
        });
    });
});

describe('DELETE /api/activities/:id', function () {
    
    before(function (done) {
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
            }, done);
        });
    });
    
    before(function (done) {
        Activity.remove().exec().then(function () {
            done();
        });
    });

    afterEach(function (done) {
        Activity.remove().exec().then(function () {
            done();
        });
    });
    
    it('should fail because of no authorization', function (done) {
    
        var id = mongoose.Types.ObjectId();
        
        server
            .delete('/api/activities/' + id)
            .expect(401)
            .end(function (err, res) {
                if (err) return done(err);
                done();
            });
    });
    it('login', loginUser());    
    it('should delete activity and return 200', function (done) {
        Activity.create({ 
                title: 't1',
                author: 'a1',
                text: 'x1' 
            }, function (err, activity) {
                if (err) return done(err);
                
                request(app)
                    .delete('/api/activities/' + activity._id)
                    .query({access_token: currentToken})
                    .expect(204)
                    .end(function (err, res) {
                        if (err) return done(err);
                        
                        Activity.find(function(err, activities) {
                           if (err) return done(err);
                           
                           activities.should.have.length(0);
                           done(); 
                        });     
                });
        });
    });
});

function loginUser() {
    return function(done) {
        server
            .post('/auth/local')
            .send({ email: 'admin@admin.com', password: 'admin' })
            .expect(200)
            .end(onResponse);

        function onResponse(err, res) {
            if (err) return done(err);
            
            res.body.should.have.property('token');
            currentToken = res.body.token;
            
            return done();
        }
    }
}