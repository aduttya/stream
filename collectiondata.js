var axios = require('axios');
const mongoose = require('mongoose')
const Transaction = require('./models/transaction');
const NFTBAYC = require('./models/nfts')
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


async function set_data(schema,data){

    let img = []
    img.push(data.image_url)
    img.push(data.image_preview_url)
    img.push(data.image_thumbnail_url)
    schema.images = img
    schema.address = data.asset_contract.address
    schema.traits = data.traits
    schema.token_id = data.token_id

    if(data.name != null){
        schema.name = data.name
    }else{
        schema.name = " "
    }

    

    try{
        const transaction_data = await Transaction.findOne({token_id:data.token_id})
        console.log("Transaction data : ",transaction_data)
        if(transaction_data != null){
            schema.transactions = transaction_data._id
        }
    }catch(err){
        console.log(err)
    }
     
}

async function getDataNFT(tokenId){

    let data ;
    let options
    options = {
        method: 'GET',
        url: `https://api.opensea.io/api/v1/asset/0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D/${tokenId}/`,
        params: {include_orders: 'false'},
        headers: {accept: 'application/json', 'X-API-KEY': 'a0672943ce854d16a94e4509aa388ef1'}

      };
    
      try{
          let response = await axios(options)
          data = response.data
          
          }catch(err){
              console.log("err is",err)
          }
    return data
}

async function getNFT(tokenId){

    let data = await getDataNFT(tokenId)
    // let temp_data = data.asset_events
    console.log("Data filling started for tokenId : ",tokenId)

    let schema = {
        metadata:{
        name: "",
        description: "",
        images: [],
        banner_image: [],
        symbol: "",
        external_links: {
        website_url: "",
        discord_url: "",
        twitter_username: "",
        other_url: "",
        },
        },
        address: "",
        slug: "",
        opensea_slug: "",
        blockchain: "",
        dox: {
          project_type: "",
          project_status: "",
          release_date: "",
        },
        verification: {
          fullname: "",
          email: "",
          role: "",
        },
      
        financial_data: {
          total_supply: "",
          total_sales: "",
          num_owners: "",
          average_price: "",
          market_cap:"",
          total_volume: "",
        },
        nfts: [],
        votes: ""
    }
    await set_data(schema,data)
    try{
        // check the transaction exists or not
        const nft_data = await Transaction.findOne({token_id:schema.token_id})

        // if transaction exists for the NFT
        if(nft_data != null){
            try{
                await NFTBAYC.create(schema)
            }catch(err){
                console.log(err)
            }
        }
        // when the transaction doesn't exist for the NFT
        else{

            let new_schema = {
                token_id: "",
                address: "", 
                name: "",
                images: [],
                traits:[],
                }

                new_schema.token_id = schema.token_id
                new_schema.address = schema.address
                new_schema.name = schema.name
                new_schema.images = schema.images
                new_schema.traits = schema.traits
                try{
                    await NFTBAYC.create(new_schema)
                }catch(err){
                    console.log(err)
                }
        }
    }catch(err){
        console.log(err)
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

    for(let i = 1001; i <= 2000; ++i){
        await getNFT(i)
        console.log("data filled for nft id : ",i)

    }

    
    

}
testing()

