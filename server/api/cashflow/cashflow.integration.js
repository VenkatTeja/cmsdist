'use strict';

var app = require('../..');
import request from 'supertest';

var newCashflow;

describe('Cashflow API:', function() {
  describe('GET /api/cashflows', function() {
    var cashflows;

    beforeEach(function(done) {
      request(app)
        .get('/api/cashflows')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          cashflows = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(cashflows).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/cashflows', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/cashflows')
        .send({
          name: 'New Cashflow',
          info: 'This is the brand new cashflow!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newCashflow = res.body;
          done();
        });
    });

    it('should respond with the newly created cashflow', function() {
      expect(newCashflow.name).to.equal('New Cashflow');
      expect(newCashflow.info).to.equal('This is the brand new cashflow!!!');
    });
  });

  describe('GET /api/cashflows/:id', function() {
    var cashflow;

    beforeEach(function(done) {
      request(app)
        .get(`/api/cashflows/${newCashflow._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          cashflow = res.body;
          done();
        });
    });

    afterEach(function() {
      cashflow = {};
    });

    it('should respond with the requested cashflow', function() {
      expect(cashflow.name).to.equal('New Cashflow');
      expect(cashflow.info).to.equal('This is the brand new cashflow!!!');
    });
  });

  describe('PUT /api/cashflows/:id', function() {
    var updatedCashflow;

    beforeEach(function(done) {
      request(app)
        .put(`/api/cashflows/${newCashflow._id}`)
        .send({
          name: 'Updated Cashflow',
          info: 'This is the updated cashflow!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedCashflow = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedCashflow = {};
    });

    it('should respond with the original cashflow', function() {
      expect(updatedCashflow.name).to.equal('New Cashflow');
      expect(updatedCashflow.info).to.equal('This is the brand new cashflow!!!');
    });

    it('should respond with the updated cashflow on a subsequent GET', function(done) {
      request(app)
        .get(`/api/cashflows/${newCashflow._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let cashflow = res.body;

          expect(cashflow.name).to.equal('Updated Cashflow');
          expect(cashflow.info).to.equal('This is the updated cashflow!!!');

          done();
        });
    });
  });

  describe('PATCH /api/cashflows/:id', function() {
    var patchedCashflow;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/cashflows/${newCashflow._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Cashflow' },
          { op: 'replace', path: '/info', value: 'This is the patched cashflow!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedCashflow = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedCashflow = {};
    });

    it('should respond with the patched cashflow', function() {
      expect(patchedCashflow.name).to.equal('Patched Cashflow');
      expect(patchedCashflow.info).to.equal('This is the patched cashflow!!!');
    });
  });

  describe('DELETE /api/cashflows/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/cashflows/${newCashflow._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when cashflow does not exist', function(done) {
      request(app)
        .delete(`/api/cashflows/${newCashflow._id}`)
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
