const mongoose = require('mongoose');
const { OpenSeaStreamClient, Network } = require('@opensea/stream-js');
const { WebSocket } = require('ws');
// const nftSchema = require('./model/nftModel');
// const url = "mongodb+srv://Aduttya:iNmA33zkb7eMOkmP@cluster0.esdgm.mongodb.net/nightwing?authSource=admin&replicaSet=atlas-vri7gd-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true"
// mongoose.connect(url, { useNewUrlParser: true }).then(console.log("connection successful"))


const client = new OpenSeaStreamClient({
  network: Network.MAINNET,
  token: 'a0672943ce854d16a94e4509aa388ef1',
  connectOptions: {
    transport: WebSocket,
  },
});

async function main() {
  let list = ["simpl3r-bounty-hunters-1","bvdcats","cynova-legacy"];

  // try {
  //   const data = await nftSchema.find({});
  //   for (let i = 0; i < data.length; ++i) {
  //     list.push(data[i].opensea_slug);
  //   }
  // } catch (err) {
  //   console.log(err);
  // }

  client.connect();

  // Method :-
  // Get list of collections which need to be listen
  // listen to the selected collection events
  // When event is fired update the status for the collection in the database

  for (let i = 0; i < list.length; ++i) {
    client.onItemSold(list[i], async (events) => {
      
        console.log(events);

      // let query = {
      //   // Will be removed when we remove first set of data
      //   slug: events.payload.collection.slug,
      //   opensea_slug: events.payload.collection.slug,
      // };

      // try {
      //   // update the status of collection in database

      //   await nftSchema.findOneAndUpdate({ finacial_status: false, params: query });
      // } catch (err) {
      //   console.log(err);
      // }
    });
  }
}

main();

