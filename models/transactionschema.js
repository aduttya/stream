const mongoose = require('mongoose')

const transaction_schema = new mongoose.Schema({
    transactionHash: {
        type: String,
        required: true,
      },
      timestamp: {
        type: Date,
        required: true,
      },
      from_account: {
        type: String,
        required: true,
      },
      to_account: {
        type: String,
        required: true,
      },
      payment_token: {
        type: String,
      },
      total_price: {
        type: String,
        required: true,
    },
})

module.exports = mongoose.models.TransactionSchema ||  mongoose.model('TransactionSchema', transaction_schema);
