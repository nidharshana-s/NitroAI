const Chats = require("../models/Chat");
const {ObjectId} = require("mongoose").Types

const SingleChats = async(req, res) => {
    const userId = req.auth.userId;
    try {
        //console.log(await Chats.findById(new ObjectId(req.params.id)))
        const chat = await Chats.findOne({_id:req.params.id, userId})
        console.log(req.params.id)
        res.status(200).json(chat)
    } catch (error) {
        console.log(error);
        res.status(500).send("Error fetching chat!");
    }
}

const UpdateChats = async(req, res) => {
    const userId = req.auth.userId

    const { question, answer, img } = req.body;

    const newItems = [
        ...(question
        ? [{ role: "user", parts: [{ text: question }], ...(img && { img }) }]
        : []),
        { role: "model", parts: [{ text: answer }] },
  ];

    try {
        const updatedChat = await Chats.updateOne(
            { _id: req.params.id, userId },
            {
              $push: {
                history: {
                  $each: newItems,
                },
              },
            }
          );
          res.status(200).send(updatedChat);        
    } catch (error) {
        console.log(error);
        res.status(500).send("Error updating conversation!");
    }
}
module.exports = {SingleChats, UpdateChats};
