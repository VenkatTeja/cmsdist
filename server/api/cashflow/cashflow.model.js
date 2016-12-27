'use strict';

import mongoose from 'mongoose';

var CashflowSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean
});

export default mongoose.model('Cashflow', CashflowSchema);
