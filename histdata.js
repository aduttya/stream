var axios = require('axios');
const ethers = require('ethers')
const mongoose = require('mongoose')
const TransactionBAYC = require('./models/transaction');
const EventModel = require('./models/event');

const url = "mongodb+srv://Aduttya:iNmA33zkb7eMOkmP@cluster0.esdgm.mongodb.net/Testings?authSource=admin&replicaSet=atlas-vri7gd-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true"
mongoose.connect(url, { useNewUrlParser: true }).then(console.log("connection successful"))
// const network = "https://eth-mainnet.g.alchemy.com/v2/twhm3MA8oGbQ0J0vP3NOm9LplRlLjKOv";

async function getData(cursor){

    let data ;
    let prev = new Date()

    const timestamp = Math.round(prev.getTime()/1000);
    let options
    if(arguments.length === 0){
      options = {
        method: 'GET',
        url: 'https://api.opensea.io/api/v1/events',
        params: {
          only_opensea: 'false',
          collection_slug: 'doodles-official',
          event_type: 'successful'
        },
        headers: {accept: 'application/json', 'X-API-KEY': 'a0672943ce854d16a94e4509aa388ef1'}
      };
    }else{
      options = {
        method: 'GET',
        url: 'https://api.opensea.io/api/v1/events',
        params: {
          only_opensea: 'false',
          collection_slug: 'doodles-official',
          event_type: 'successful',
          cursor:cursor
        },
        headers: {accept: 'application/json', 'X-API-KEY': 'a0672943ce854d16a94e4509aa388ef1'}
      };
    }
    
      try{
          let response = await axios(options)
          data = response.data
          }catch(err){
              console.log("err is",err)
          }
    return data
}


async function set_data(transaction,data){

    // let img = []
    // img.push(data.asset.image_url)
    // img.push(data.asset.image_preview_url)
    // img.push(data.asset.image_thumbnail_url)
    let _time = new Date(data.transaction.timestamp)
    const timestamp = Math.round(_time.getTime()/1000);
    transaction.token_id = data.asset.token_id
    transaction.address = data.asset.asset_contract.address
    transaction.transactions.transactionHash = data.transaction.transaction_hash
    transaction.transactions.timestamp = timestamp
    transaction.transactions.from_account = data.transaction.from_account.address
    transaction.transactions.to_account = data.transaction.to_account.address
    transaction.transactions.total_price = data.total_price
    // nfts.images = img
    // nfts.transactions.push(transaction)
    // return nfts;
     
}


async function getDataNFT(tokenId,cursor){

    let data ;
    let prev = new Date()
    let id = String(tokenId) 
    const timestamp = Math.round(prev.getTime()/1000);
    let options
    if(arguments.length === 1){
      options = {
        method: 'GET',
        url: 'https://api.opensea.io/api/v1/events',
        params: {
          only_opensea: 'false',
          token_id: id,
          asset_contract_address: '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D',
          event_type: 'successful'
        },
        headers: {accept: 'application/json', 'X-API-KEY': 'a0672943ce854d16a94e4509aa388ef1'}
      };
      
    }else{
      console.log(options)
      options = {
        method: 'GET',
        url: 'https://api.opensea.io/api/v1/events',
        params: {
          only_opensea: 'false',
          token_id : id,
          asset_contract_address: '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D',
          event_type: 'successful',
          cursor:cursor
        },
        headers: {accept: 'application/json', 'X-API-KEY': 'a0672943ce854d16a94e4509aa388ef1'}
      };
    }
    
      try{
          let response = await axios(options)
          data = response.data
          }catch(err){
              console.log("err is",err)
          }
    return data
}





async function main(){

    // get data for a particular NFT

    let init_date = new Date('Apr-22-2021')
    

}
// main()


async function testing(){

    
  let init = new Date("April 1, 2021")
  console.log(init)
  init = Math.floor(init.getTime()/1000)
  const inc = 24*60*60*1000;

  let current = new Date()
  current = Math.floor(current.getTime()/1000)

      while(init < current){

        let _init = new Date(init*1000)
        console.log(_init)
        init += inc;

  }

    await mongoose.disconnect()
    // await printSalePrices(0)

}
testing()

