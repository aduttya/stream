const mongoose = require('mongoose');
const { OpenSeaStreamClient, Network } = require('@opensea/stream-js');
const { WebSocket } = require('ws');
const EventModel = require('./models/event');
const url = "mongodb+srv://Aduttya:iNmA33zkb7eMOkmP@cluster0.esdgm.mongodb.net/Testings?authSource=admin&replicaSet=atlas-vri7gd-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true"
mongoose.connect(url, { useNewUrlParser: true }).then(console.log("connection successful"))


const client = new OpenSeaStreamClient({
  network: Network.MAINNET,
  token: 'a0672943ce854d16a94e4509aa388ef1',
  connectOptions: {
    transport: WebSocket,
  },
});


async function build_object(event,schema){

    schema.name = event.payload.item.metadata.name
    schema.image_url = event.payload.item.metadata.image_url

    schema.slug = event.payload.collection.slug
    schema.transaction.transactionHash = event.payload.transaction.hash
    schema.transaction.timestamp = event.payload.transaction.timestamp
    schema.transaction.from_account = event.payload.maker.address
    schema.transaction.to_account = event.payload.taker.address
    schema.transaction.total_price = event.payload.sale_price


}

async function main() {

  let list = ["kumaleon-nft","8pes-dvnci","posersnft","emoheads","akyllersden"];

  client.connect();

  // Method :-
  // Get list of collections which need to be listen
  // listen to the selected collection events
  // When event is fired update the status for the collection in the database

  for (let i = 0; i < list.length; ++i) {

    client.onItemSold(list[i], async (events) => {
        let schema = {
            name: "",
            image_url : "",
            slug :"",
            transaction : {
                transactionHash:"",
                timestamp:"",
                from_account:"",
                to_account:"",
                payment_token:"",
                total_price:""
            }
        }
        await build_object(events,schema) 
        
      // let query = {
      //   // Will be removed when we remove first set of data
      //   slug: events.payload.collection.slug,
      //   opensea_slug: events.payload.collection.slug,
      // };

      try {
        // update the status of collection in database
            await EventModel.create(schema)
            // console.log(schema)
            console.log("event saved successfully")
      } catch (err) {
        console.log(err);
      }
    });
  }
}

main();


