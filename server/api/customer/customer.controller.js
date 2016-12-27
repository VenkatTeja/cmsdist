/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/customers              ->  index
 * POST    /api/customers              ->  create
 * GET     /api/customers/:id          ->  show
 * PUT     /api/customers/:id          ->  upsert
 * PATCH   /api/customers/:id          ->  patch
 * DELETE  /api/customers/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Customer from './customer.model';

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

// Gets a list of Customers
export function index(req, res) {
  return Customer.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Customer from the DB
export function show(req, res) {
  return Customer.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

export function search(req, res){
  var name = req.params.name;
 Customer.find({$and:[{ "name": { "$regex": name, "$options": "i" } }, {'_id': { $in: req.user.customers}}]})
    .exec()
    .then(customers=>{
      return res.json(customers);
    })
    .catch(handleError(res));
}
// Creates a new Customer in the DB
export function create(req, res) {
   return Customer.create(req.body.data)
    .then(customer=>{
      req.user.customers.push(customer._id);
      return req.user.save()
        .then(respondWithResult(res))
    })
    .catch(handleError(res));
}

// Upserts the given Customer in the DB at the specified ID
export function upsert(req, res) {
  req.body = req.body.data;
  if(req.body._id) {
    delete req.body._id;
  }
  return Customer.findOneAndUpdate(req.params.id, req.body, {upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Customer in the DB
export function patch(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Customer.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Customer from the DB
export function destroy(req, res) {
  return Customer.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
