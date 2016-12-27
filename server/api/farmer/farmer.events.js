/**
 * Farmer model events
 */

'use strict';

import {EventEmitter} from 'events';
import Farmer from './farmer.model';
var FarmerEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
FarmerEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for(var e in events) {
  let event = events[e];
  Farmer.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    FarmerEvents.emit(event + ':' + doc._id, doc);
    FarmerEvents.emit(event, doc);
  };
}

export default FarmerEvents;
