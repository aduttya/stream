const mongoose = require('mongoose')

const event_schema = new mongoose.Schema({

        name: {
        type : String,
        required : true
        },

        image_url : {
            type : String,
            required : true
        },
        slug : {
            type:String
        },

        transaction : {
            transactionHash:{
                type:String,
                required : true
            },
    
            timestamp:{
                type:Date,
                required:true
            },
    
            from_account:{
                type:String,
                required:true
            },
    
            to_account:{
                type:String,
                required:true
            },
            
            payment_token:{
                type:String
            },
    
            total_price:{
                type:Number,
                required:true
            }
        }
        


})

const EventModel = mongoose.model("EventModel", event_schema);
module.exports = EventModel;
