const mongoose = require('mongoose');
const NFTBAYC = require('./nfts');
const userSchema = new mongoose.Schema(
  {
    address: {
      type: String,
      required: [true, 'User Contract Address is required'],
      unique: true,
    },
    bio: {
      trim: true,
      type: String,
    },
    username: {
      type: String,
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
    addedOn: Date,
    votingHistory: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Nft',
        // required: [true, 'An Nft must belong to a user'],
      },
    ],
    nfts: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Nft',
        required: [true, 'An Nft must belong to a user'],
      },
    ],
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
userSchema.pre('save', function (next) {
  this.addedOn = Date.now();
  next();
});
userSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'nfts',
    select: 'address metadata',
  });
  this.populate({
    path: 'votingHistory',
    select: 'address metadata',
  });
  next();
});
const User = mongoose.model('User', userSchema);
module.exports = User;







