const UserChats = require('../models/UserChats');
const Chat = require('../models/Chat');
const { clerkClient, getAuth } = require('@clerk/express')



const Chats = async (req, res) => {
    const userId = req.auth.userId;
    const {text} = req.body;
    //console.log(text)
    try {
        const newChat = new Chat({
            userId : userId,
            history : [{
                role : "user", parts : [{text}]
            }]
        });

        const savedChat = await newChat.save();

        const userChats = await UserChats.find({userId : userId})
        if(!userChats.length){
            const newUserChats = new UserChats({
                userId : userId,
                chats : [
                    {
                        _id : savedChat._id,
                        title : text.substring(0, 40),
                    }
                ]
            })
            await newUserChats.save()
        } else{
            await UserChats.updateOne(
                {userId:userId},
                {
                $push :{
                    chats : {
                        _id : savedChat._id,
                        title : text.substring(0, 40)
                    }
                }
            })
            res.status(201).send(newChat._id)
        }

    } catch (error) {
        console.log(error)
        res.status(500).send("error catching chats!")
    }
}
module.exports = Chats;