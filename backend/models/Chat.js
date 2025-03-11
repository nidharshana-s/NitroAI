const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema({
    userId : {
        type: String,
        required : true,
    },
    history : [
        {
            role : {
                type : String,
                enum : ["user" , "model"],
                required : true,
            },
            parts : [
                {
                    text : {
                        type : String,
                        required : true
                    },
                },
            ],

            img : {
                type : String,
                required : false,
            }
        }
    ]
},
    {timestamps : true}
);

const Chat = mongoose.model('Chat', ChatSchema);
module.exports = Chat