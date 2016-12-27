/**
 * Cashflow model events
 */

'use strict';

import {EventEmitter} from 'events';
import Cashflow from './cashflow.model';
var CashflowEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
CashflowEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for(var e in events) {
  let event = events[e];
  Cashflow.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    CashflowEvents.emit(event + ':' + doc._id, doc);
    CashflowEvents.emit(event, doc);
  };
}

export default CashflowEvents;
