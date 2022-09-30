// const mongoose = require('mongoose');
// const NFT = require('./nfts');
// const CollectionSchema = new mongoose.Schema({

//   name: {
//     type: String,
//     required: true,
//   },
//   address: {
//     type: String,
//     required: true,
//   },
//   total_supply:{
//     type:String,
//   },
//   description: {
//     type: String,
//     required: true,
//   },
//   opensea_slug: {
//     type: String,
//     required: true,
//   },
//   images: {
//     type: [String],
//   },
//   banner_image: {
//     type: [String],
//   },

//   nfts: [
//     {
//       type: [mongoose.Schema.ObjectId],
//       ref: NFT,
//       default: null,
//     },
//   ],
// });

// module.exports = mongoose.models.Collection || mongoose.model('Collection', CollectionSchema);

const mongoose = require("mongoose");
const NFTBAYC = require("./nfts");

const ProjectSchema = new mongoose.Schema({

  metadata:{
    
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  
  images: {
    type: [String],
  },
  banner_image: {
    type: [String],
  },
 symbol: {
      type: String,
      unique: true,
    },
    
  external_links: {
  website_url: String,
  discord_url: String,
  twitter_username: String,
  other_url: String,
  },
  },
  address: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: [true, "Each Nft must have a unique slug"],
    unique: true,
  },
  opensea_slug: {
    type: String,
    required: true,
  },

    blockchain: String,
  dox: {
    project_type: String,
    project_status: String,
    release_date: Date,
  },
  verification: {
    fullname: String,
    email: String,
    role: String,
  },

  financial_data: {
    total_supply: {
      type: String,
      default: "0",
    },
    total_sales: {
      type: String,
      default: "0",
    },
    num_owners: {
      type: String,
      default: "0",
    },
    average_price: {
      type: String,
      default: "0",
    },
    market_cap: {
      type: String,
      default: "0",
    },
    total_volume: {
      type: String,
      default: "0",
    },
  },
  nfts: [
    {
      type: [mongoose.Schema.ObjectId],
      ref: NFT,
      default: null,
    },
  ],
  votes: {
    type: mongoose.Schema.ObjectId,
    ref: "Vote",
  },
  addedOn: Date,
  approvedOn: Date,
  financial_status: {
    type: Boolean,
    default: false,
  },
  addedBy: { type: String, required: [true, "A project must have an owner"] },
  status: {
    type: String,
    enum: ["approved", "pending", "disapproved", "deleted"],
    default: "pending",
  },
});
module.exports = mongoose.models.Project || mongoose.model("Project", ProjectSchema);















