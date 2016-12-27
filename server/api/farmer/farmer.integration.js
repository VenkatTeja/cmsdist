'use strict';

var app = require('../..');
import request from 'supertest';

var newFarmer;

describe('Farmer API:', function() {
  describe('GET /api/farmers', function() {
    var farmers;

    beforeEach(function(done) {
      request(app)
        .get('/api/farmers')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          farmers = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(farmers).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/farmers', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/farmers')
        .send({
          name: 'New Farmer',
          info: 'This is the brand new farmer!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newFarmer = res.body;
          done();
        });
    });

    it('should respond with the newly created farmer', function() {
      expect(newFarmer.name).to.equal('New Farmer');
      expect(newFarmer.info).to.equal('This is the brand new farmer!!!');
    });
  });

  describe('GET /api/farmers/:id', function() {
    var farmer;

    beforeEach(function(done) {
      request(app)
        .get(`/api/farmers/${newFarmer._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          farmer = res.body;
          done();
        });
    });

    afterEach(function() {
      farmer = {};
    });

    it('should respond with the requested farmer', function() {
      expect(farmer.name).to.equal('New Farmer');
      expect(farmer.info).to.equal('This is the brand new farmer!!!');
    });
  });

  describe('PUT /api/farmers/:id', function() {
    var updatedFarmer;

    beforeEach(function(done) {
      request(app)
        .put(`/api/farmers/${newFarmer._id}`)
        .send({
          name: 'Updated Farmer',
          info: 'This is the updated farmer!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedFarmer = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedFarmer = {};
    });

    it('should respond with the original farmer', function() {
      expect(updatedFarmer.name).to.equal('New Farmer');
      expect(updatedFarmer.info).to.equal('This is the brand new farmer!!!');
    });

    it('should respond with the updated farmer on a subsequent GET', function(done) {
      request(app)
        .get(`/api/farmers/${newFarmer._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let farmer = res.body;

          expect(farmer.name).to.equal('Updated Farmer');
          expect(farmer.info).to.equal('This is the updated farmer!!!');

          done();
        });
    });
  });

  describe('PATCH /api/farmers/:id', function() {
    var patchedFarmer;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/farmers/${newFarmer._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Farmer' },
          { op: 'replace', path: '/info', value: 'This is the patched farmer!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedFarmer = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedFarmer = {};
    });

    it('should respond with the patched farmer', function() {
      expect(patchedFarmer.name).to.equal('Patched Farmer');
      expect(patchedFarmer.info).to.equal('This is the patched farmer!!!');
    });
  });

  describe('DELETE /api/farmers/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/farmers/${newFarmer._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when farmer does not exist', function(done) {
      request(app)
        .delete(`/api/farmers/${newFarmer._id}`)
        .expect(404)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });
  });
});
