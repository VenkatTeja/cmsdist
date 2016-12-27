'use strict';

import mongoose from 'mongoose';

var FarmerSchema = new mongoose.Schema({
	userCode: String,
  	name: String,
  	phone: Number,
  	address: String,
  	email: String
});

export default mongoose.model('Farmer', FarmerSchema);
