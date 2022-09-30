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


// async function testing(){

//     let data = await getData()
//     data = data.asset_events
//     for(let i = 0; i < data.length; ++i){
//     // data.asset [data.asset.name, (data.asset.image_url, data.asset.image_preview_url,data.asset.image_thumnail.url)]
//     // data.asset.asset_contract.address 
//     // data.asset.asset_contract.description
//     // data.event_timestamp
//     // data.payment_token
//     // data.transaction

//         console.log(
//             "name : ",
//             data[i].asset.name)
//             console.log(
//             "address : ",
//             data[i].asset.asset_contract.address)
//             console.log(
//             "description : ",
//             data[i].asset.asset_contract.description)

//             console.log(
//             " ",
//             data[i].asset.image_url,
//             " ",
//             data[i].asset.image_preview_url,
//             " ",
//             data[i].asset.image_thumbnail_url,
//             " "
//         )

//         console.log(data[i].event_timestamp)
//         console.log(data[i].payment_token)
//         console.log(data[i].transaction)
//         console.log("Sold Price : ",data[i].total_price)
//         console.log(" ")
//     }

// }

// testing()
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

async function printSalePrices(tokenId){

    let data = await getDataNFT(tokenId)
    // let temp_data = data.asset_events
    console.log("Data filling started for tokenId : ",tokenId)

    // for(let i = 0; i < temp_data.length; ++i){
    //     let transaction = {
    //         address:"",
    //         token_id: "",
    //         transactions : {
    //         transactionHash:'',
    //         timestamp:'',
    //         from_account:'',
    //         to_account:'',
    //         payment_token:'',
    //         total_price:null
    //         }
    //     }

    
    // await set_data(transaction,temp_data[i])
    // // check whether the nft is present in the collection or not?
    // let isPresent = false;

    // try{
    //     let txns = await Transaction.findOne({token_id : transaction.token_id})
    //     if(txns != null){
    //         isPresent = true
    //     }
    // }
    // catch(err){
    //     // console.log(err)
    //     console.log("error in starting")
    // }

    // // if present (push the new transaction)
    // if(isPresent === true){
    //     try{
    //         // create new object for it
    //         let new_transaction = {
    //                 transactionHash:'',
    //                 timestamp:'',
    //                 from_account:'',
    //                 to_account:'',
    //                 payment_token:'',
    //                 total_price:null}

    //         new_transaction.transactionHash = transaction.transactions.transactionHash
    //         new_transaction.timestamp = transaction.transactions.timestamp
    //         new_transaction.from_account = transaction.transactions.from_account
    //         new_transaction.to_account = transaction.transactions.to_account
    //         new_transaction.payment_token = transaction.transactions.payment_token,
    //         new_transaction.total_price = transaction.transactions.total_price

            
    //         await Transaction.findOneAndUpdate({token_id:transaction.token_id},{"$push":{"transactions":new_transaction}})
    //     }
    //     catch(err){
    //     }
    // }
    // // else (create new)
    // else{
    //         try{
    //              await Transaction.create(transaction)
    //         }
    //         catch(err){
    //                 // console.log("error")
    //                 console.log(err)
    //         }
    // }

    // }
    let first_itr = true
    while(data.next != null || first_itr === true){
      
      let temp_data = data.asset_events;
      first_itr = false;
      console.log(data)
      for(let i = 0; i < temp_data.length; ++i){

        let transaction = {
            address:"",
            token_id: "",
            transactions : {
            transactionHash:'',
            timestamp:'',
            from_account:'',
            to_account:'',
            payment_token:'',
            total_price:null
            }

      }

      await set_data(transaction,temp_data[i])
      console.log(transaction)
      // check whether the nft is present in the collection or not?
      let isPresent = false;
  
      try{
          let txns = await TransactionBAYC.findOne({token_id : transaction.token_id})
          if(txns != null){
              isPresent = true
          }
      }
      catch(err){
          console.log(err)
      }  

      // if present (push the new transaction)
    if(isPresent === true){
        try{
            // create new object for it
            let new_transaction = {
                    transactionHash:'',
                    timestamp:'',
                    from_account:'',
                    to_account:'',
                    payment_token:'',
                    total_price:null}


                    new_transaction.transactionHash = transaction.transactions.transactionHash
                    new_transaction.timestamp = transaction.transactions.timestamp
                    new_transaction.from_account = transaction.transactions.from_account
                    new_transaction.to_account = transaction.transactions.to_account
                    new_transaction.payment_token = transaction.transactions.payment_token,
                    new_transaction.total_price = transaction.transactions.total_price
            
            
            await TransactionBAYC.findOneAndUpdate({token_id:transaction.token_id},{"$push":{"transactions":new_transaction}})
        }
        catch(err){
            console.log("err : ",err)
        }
    }
    // else (create new)
    else{
            try{
                 await TransactionBAYC.create(transaction)
            }
            catch(err){
                    // console.log("error")
                    console.log(err)
            }
    }

    }
    await getDataNFT(tokenId,data.next)
}
}




async function main(){

      let data;
      data = await getData()

      let temp_data;
      temp_data = data.asset_events

      for(let i = 0; i < temp_data.length; ++i){
          console.log(temp_data[i].total_price)
      }

      while(data.next != null){
        // await print(data.asset_events)
        data = await getData(data.next)

        for(let i = 0; i < temp_data.length; ++i){
          console.log(temp_data[i].total_price)
      }
      }

}
// main()


async function testing(){

    for(let i = 0; i <= 100; ++i){
        await printSalePrices(i)
        console.log("data filled for nft id : ",i)

    }

    await mongoose.disconnect()
    // await printSalePrices(0)

}
testing()

