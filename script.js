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
async function testing(){

    console.log("in testing")

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

    let event = {
        event_type: 'item_sold',
         payload: { 
            closing_date: '2022-09-19T06:06:59.000000+00:00',
            collection: { slug: 'posersnft' },
            event_timestamp: '2022-09-19T06:06:59.000000+00:00',
            is_private: false,
            item: {
                chain: [Object],
                metadata: {
                    "name": "Doodle #222",
                    "description": "A community-driven collectibles project featuring art by Burnt Toast. Doodles come...",
                    "image_url": "https://lh3.googleusercontent.com/R7wtoDNdmM7GhTvVjr4JGA6q60z44Hn2nIymPjAEXcjnD8oBPxQYPA1GkrCnvepPM1Sc8DlIHZql4Yucj4ger1jnWmxmuRFwIC_JRw",
                    "animation_url": null,
                    "metadata_url": "https://opensea.mypinata.cloud/ipfs/QmPMc4tcBsMqLRuCQtPmPe84bpSjrC3Ky7t3JWuHXYB4aS/222",
                },
                nft_id: 'ethereum/0x02beed1404c69e62b76af6dbdae41bd98bca2eab/45',
                permalink: 'https://opensea.io/assets/ethereum/0x02beed1404c69e62b76af6dbdae41bd98bca2eab/45'  
            },
            listing_type: null, 
            maker: { address: '0x7c9519f7ad1a92d4df8d5d580157b6d191e53247' },
            order_hash: '0xb7a08f22d60c99143c35f32b4b214e02a46c4c0062fc1a1e53dbb1071e08d68f',
            payment_token: {
                address: '0x0000000000000000000000000000000000000000',
                decimals: 18, 
                eth_price: '1.000000000000000',
                name: 'Ether',
                symbol: 'ETH',
                usd_price: '1308.039999999999964000'},
            quantity: 1,
            sale_price: '250000000000000000',
            taker: { address: '0x464e3b767494b788b39f632a219cde5266a6e8b3' },
            transaction: { 
                hash: '0x6eb845f8184aa8c102db3f5e6b1d96db9aed8dfc5f60c53e429f1b12708701a5',
                timestamp: '2022-09-19T06:06:59.000000+00:00'}
            },
    }
    await build_object(event,schema)

    console.log("this is : ",schema)
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
            console.log("event saved successfully")
      } catch (err) {
        console.log(err);
      }
    });
  }
}

main();

// testing()

