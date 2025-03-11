const { config } = require('dotenv');
const UserChats = require('../models/UserChats');

const UserChatsController = async(req, res) => {
    const userId = req.auth.userId;
    try {
        const chat = await UserChats.find({userId})
        //console.log(chat)
        //console.log(userId)
        res.status(200).send(chat[0].chats)
        
    } catch (error) {
        console.log(error)
        res.status(500).send("error fetching chat !")
        
    }
}

module.exports = UserChatsController