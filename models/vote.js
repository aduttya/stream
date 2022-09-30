const mongoose = require('mongoose');
const NFTBAYC = require('./nfts');
const User = require('./user');

var votes = new mongoose.Schema({
  address: {
    type: String,
    unique: true,
    index: true,
  },
  voteByHolders: [{ type: Date }],
  voteByNonHolders: [{ type: Date }],
  totalVotes: { type: Number, default: 0 },
  voters: [
    {
      type: [mongoose.Schema.ObjectId],
      ref: User,
    },
  ],
  signatures: {
    type: Array,
  },
});
module.exports = mongoose.models.Vote || mongoose.model('Vote', votes);