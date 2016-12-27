/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/cashflows              ->  index
 * POST    /api/cashflows              ->  create
 * GET     /api/cashflows/:id          ->  show
 * PUT     /api/cashflows/:id          ->  upsert
 * PATCH   /api/cashflows/:id          ->  patch
 * DELETE  /api/cashflows/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Cashflow from './cashflow.model';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if(entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function patchUpdates(patches) {
  return function(entity) {
    try {
      jsonpatch.apply(entity, patches, /*validate*/ true);
    } catch(err) {
      return Promise.reject(err);
    }

    return entity.save();
  };
}

function removeEntity(res) {
  return function(entity) {
    if(entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if(!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Cashflows
export function index(req, res) {
  return Cashflow.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Cashflow from the DB
export function show(req, res) {
  return Cashflow.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Cashflow in the DB
export function create(req, res) {
  return Cashflow.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given Cashflow in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Cashflow.findOneAndUpdate(req.params.id, req.body, {upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Cashflow in the DB
export function patch(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Cashflow.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Cashflow from the DB
export function destroy(req, res) {
  return Cashflow.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
