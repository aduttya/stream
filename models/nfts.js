const mongoose = require('mongoose');
const Transaction = require('./transaction');

const NFTSchema = new mongoose.Schema({

  token_id: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },

  images: {
    type: [String],
  },
  traits: [
    {
      trait_type: {
        type:String
      },
      value: {
        type : String
      },
      display_type: {
        type : String
      },
      max_value: {
        type : String
      },
      trait_count:{
        type : String
      },
      order: {
        type : String
      }
    }
  ],
  transactions: 
    {
      type: [mongoose.Schema.ObjectId],
      ref: Transaction,
    },
});

module.exports = mongoose.models.NFTBAYC || mongoose.model('NFTBAYC', NFTSchema);


// 1 - I will be creating a document
// 2 - I will be appending transactions