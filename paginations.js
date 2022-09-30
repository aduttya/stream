var axios = require('axios');
const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2');
const NeverSold = require('./models/neversold');
const Transaction = require('./models/transaction');
const NFTBAYC = require('./models/nfts');
const url = "mongodb+srv://Aduttya:iNmA33zkb7eMOkmP@cluster0.esdgm.mongodb.net/Testings?authSource=admin&replicaSet=atlas-vri7gd-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true"
mongoose.connect(url, { useNewUrlParser: true }).then(console.log("connection successful"))

// Transaction.plugin(mongoosePaginate)



async function pagination_data(page_size){

    
    let list = []
    let limit = page_size;
    let init = 0;

    let data;
    let never_sold_nfts = []
    
    while (limit < 10000){

        for(let i = init; i < limit; ++i){
            list.push(i)
        }
        
        data = await Transaction.find({token_id : {$in : list}})
        console.log(data)

        // for(let j = init; j < limit; ++j){
            
        // }
        console.log("one cycle ended")

        init = limit;
        limit += page_size;
        list = [] 
    }


}


async function get_price_history_of_single_nft(id){

        // get the object from the transaction

        let data 

        try{
            data = await Transaction.find({token_id:id})
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

        console.log(arr)

        await mongoose.disconnect()
}

// get_price_history_of_single_nft(7876)
async function never_sold(){

    let data
     try{
       data =  await NeverSold.find({}).limit(5)

     }
     catch(err){
        throw err;
     }

     for(let i = 0; i < data.length; ++i){
        // console.log(data[i].nfts[0].valueOf())
        try{
            let temp_data =  await NFTBAYC.findById(data[i].nfts[0].valueOf())
            console.log(" : ",temp_data)
          }
          catch(err){
             throw err;
          }
     }
}
never_sold()

async function main(){
    
    let data 
    let never_sold_nfts = []

    console.time('Execution Time')
    const page = 1
    const limit = 1000;
    const skip = (page - 1) * limit;
    const docs = await Transaction.aggregate([
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

  console.log(docs)
    // try{

    //     for(let i = 0; i < 10000; ++i){
    //         data = await Transaction.find({token_id : i})
    //         // console.log(data)
    //         if(data.length === 0){
    //             try{
    //                 let temp_data = await NFTBAYC.find({token_id : i})
                    

    //                 if(temp_data.length != 0){
    //                     let _tempnfts = {
    //                         nfts : []
    //                     }

    //                     _tempnfts.nfts = temp_data[0]._id;

    //                     try{
    //                         await NeverSold.create(_tempnfts)
    //                         // console.log(_tempnfts)
    //                     }catch(err){
    //                         console.log(err)
    //                     }
    //                 }
    //             }catch(err){
    //                 console.log(err)
    //             }
    //         }
    //     }
    //     console.log("Data size : ",never_sold_nfts.length)
    //     console.log(never_sold_nfts)

    // }catch(err){
    //     throw err
    // }
        console.timeEnd('Execution Time')
        await mongoose.disconnect()



}
// main()