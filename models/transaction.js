const mongoose = require('mongoose');
const TransactionSchema = require('./transactionschema');

const transactionSchema = new mongoose.Schema({

  address: { type: 'string'},
  
  time:{
    type:String
  },

  transactions:[{
  token_id: {
    type: Number,
  }, 
    timestamp: {
      type: Number,
    },
    total_price: {
      type: String,
  },
}]
});
module.exports = mongoose.models.TransactionBAYC ||  mongoose.model('TransactionBAYC', transactionSchema);









