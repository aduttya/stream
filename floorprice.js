var axios = require('axios');
const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2');
const NeverSold = require('./models/neversold');
const TransactionBAYC = require('./models/transaction');
const NFTBAYC = require('./models/nfts');
const url = "mongodb+srv://Aduttya:iNmA33zkb7eMOkmP@cluster0.esdgm.mongodb.net/Testings?authSource=admin&replicaSet=atlas-vri7gd-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true"
mongoose.connect(url, { useNewUrlParser: true }).then(console.log("connection successful"))

async function get_price_history_of_single_nft(id){

    // get the object from the transaction

    let data 

    try{
        data = await TransactionBAYC.find({token_id:id})
    }catch(err){
        console.log(err)
    }

    if(data.length === 0){
        console.log("NFT hasn't been sold a single time")
        await mongoose.disconnect()
        return
    }
    // create an object and put it in pairs of unix time and price
    let transactions = data[0].transactions;

    let arr = []
    for(let i = 0; i < transactions.length; ++i){
        let obj = {
            time : null,
            total_price : null
        }

        let _time = new Date(transactions[i].timestamp)

        const timestamp = Math.round(_time.getTime()/1000);
        obj.time = timestamp
        obj.total_price = transactions[i].total_price
        arr.push(obj)
    }

    return arr;

    // await mongoose.disconnect()
}

async function get_data(page,limit){
    // const page = 1
    // const limit = 1000;
    const skip = (page - 1) * limit;
    const docs = await TransactionBAYC.aggregate([
    {
      $sort: {
        _id: -1,
      },
    },
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
  ]);

    return docs
}

async function print_date(t1, t2){
    let date1 = new Date(t1*1000)
    let date2 = new Date(t2*1000)

    console.log(date1, " ",date2)
}
async function get_floor_price(_time){

    let _t = new Date(_time*1000)
    console.log("Send time : ",_t)

    // fetch the 100 nft and store the lowest price at that time
    // fetch next 100 and compare the lowest price 

    let floor_price_nft = {
        floor_price : (10**18)*100, // string the floor price with 100 ETH
        token_id : '',
        time : null
    }

    // for(let i = 1; i <= 2; ++i){
        // return array of objects
        // let data = await get_data(i,5)
        let data = await TransactionBAYC.find({}).limit(10)

        for(let j = 0; j < data.length; ++j){

            // let txns = await get_price_history_of_single_nft(data[j].token_id)
            let txns = data[j].transactions

            if(txns.length != 1){
                for(let k = 0; k < txns.length-1; ++k){
                    // if the transaction in the time frame

                    if(_time <= txns[k].timestamp && _time >= txns[k+1].timestamp){ 

                        await print_date(txns[k].timestamp,txns[k+1].timestamp)
                        console.log(txns[k].total_price/10**18," ",txns[k+1].total_price/10**18)
                        console.log(" ")
                        // current is lower than the floor_price
                        if(txns[k].total_price < floor_price_nft.floor_price){   
                            console.log(txns[k].total_price/10**18," ",txns[k+1].total_price/10**18)     
                        floor_price_nft.floor_price = txns[k+1].total_price/10**18 
                        floor_price_nft.token_id = data[j].token_id
                        floor_price_nft.time = txns[k+1].timestamp
                        }
                    }
            }
            }else{

                if(_time >= txns[0].timestamp ){
                    // current is lower than the floor_price
                    if(txns[0].total_price < floor_price_nft.floor_price){    
                        // console.log(txns[k].total_price/10**18," ",txns[k+1].total_price/10**18)
    
                        floor_price_nft.floor_price = txns[0].total_price/10**18 
                        floor_price_nft.token_id = data[j].token_id
                        floor_price_nft.time = txns[0].timestamp
                        }
                }
            }

         
        }

    // }

    console.log(floor_price_nft)

    await mongoose.disconnect()
}

// get_floor_price(1625307225)

async function get_nft_price_at_time(_time,tokenId){

    let data;

    try{
        data = await TransactionBAYC.find({token_id : tokenId})
        if(data.length === 0){
            console.log("NFT haven't been sold yet")
            await mongoose.disconnect()
            return
        }
        data = data[0]
    }catch(err){
        throw err
    }

    let txns = data.transactions
    let _t = new Date(_time*1000)
    console.log("Passed time : ",_t)

    let index = 0

    while(index < txns.length && (txns[index].timestamp >= _time || txns[index].timestamp < _time)){
        console.log("Entered")
        
        if(txns[index].timestamp < _time && index === 0){
            console.log(
                _t,
                " ",
                txns[index].total_price/10**18, " ETH"
                )

                index = txns.length;
                await mongoose.disconnect()
                return ;

        }
        else if(txns[index +1].timestamp <= _time){
            let prev = new Date(txns[index+1].timestamp*1000)
            let next = new Date(txns[index].timestamp*1000)
            console.log(
                prev,
                " ",
                next,
                " ",
                (txns[index+1].total_price)/10**18, " ETH"
            )
            index = txns.length
            await mongoose.disconnect()
            return 
        }

        index++;
    }

    
    
    await mongoose.disconnect()
}

get_nft_price_at_time(1637608569,6)