/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/farmers              ->  index
 * POST    /api/farmers              ->  create
 * GET     /api/farmers/:id          ->  show
 * PUT     /api/farmers/:id          ->  upsert
 * PATCH   /api/farmers/:id          ->  patch
 * DELETE  /api/farmers/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Farmer from './farmer.model';

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

// Gets a list of Farmers
export function index(req, res) {
  return Farmer.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Farmer from the DB
export function show(req, res) {
  return Farmer.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

export function search(req, res){
  var name = req.params.name;
 Farmer.find({$and:[{ "name": { "$regex": name, "$options": "i" } }, {'_id': { $in: req.user.farmers}}]})
    .exec()
    .then(farmers=>{
      return res.json(farmers);
    })
    .catch(handleError(res));
}

// Creates a new Farmer in the DB
export function create(req, res) {

  return Farmer.create(req.body.data)
    .then(farmer=>{
      req.user.farmers.push(farmer._id);
      return req.user.save()
        .then(respondWithResult(res))
    })
    .catch(handleError(res));
}

// Upserts the given Farmer in the DB at the specified ID
export function upsert(req, res) {
  req.body = req.body.data;

  if(req.body._id) {
    delete req.body._id;
  }
  return Farmer.findOneAndUpdate(req.params.id, req.body, {upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Farmer in the DB
export function patch(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Farmer.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Farmer from the DB
export function destroy(req, res) {
  return Farmer.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
