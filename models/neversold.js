const mongoose = require('mongoose');
const Transaction = require('./transaction');
const NFTBAYC = require('./nfts')
const NFTSchema = new mongoose.Schema({

  nfts: 
    {
      type: [mongoose.Schema.ObjectId],
      ref: NFTBAYC,
    },
});

module.exports = mongoose.models.NeverSold || mongoose.model('NeverSold', NFTSchema);


// 1 - I will be creating a document
// 2 - I will be appending transactions