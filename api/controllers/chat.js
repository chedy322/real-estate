const mongoose = require('mongoose');
const chat = require('../module/chat');
const user=require('../module/User')
const message=require('../module/message')
const getAllchats  = async (req, res) => {
  try {
    const chats = await chat.find({
      userIds: { $in: [req.user.id] }
    }).sort('createdAt').lean() // Use lean() for plain JS objects

    for (const chat of chats) {
      // getting the receiver
      const receiverId = chat.userIds.find(id => id !== req.user.id);
      // getting the information relative to the receiver from user db
      const relativeUser = await user.findOne({ _id: receiverId }).select(['avatar', 'username', '_id']);
      // assigning those info into a receiver objects inside the chats
      chat.receiver = relativeUser;
    }

    return res.status(201).json(chats);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error getting all chats" });
  }
}


const createChat = async (req, res) => {
  try {
    const { id: sender_id } = req.user;

    if (!sender_id) {
      return res.status(400).json({ message: "You need to be logged in" });
    }
    const existing_chat = await chat.findOne({ userIds:[sender_id,req.body.receiver]})
    console.log(existing_chat)
    if(existing_chat){
      const chats = await chat.findOneAndUpdate(
        { _id: existing_chat._id, userIds: { $in: [req.user.id] } },
        { $addToSet: { seenBy: req.user.id } }, // Ensure user ID is unique in seenBy
        { new: true }
      )
      const messages=await message.find({chatId:existing_chat._id})
      return res.status(400).json({chats,messages})
    }
    const chats = await chat.create({
      userIds: [sender_id, req.body.receiver],
    });
    return res.status(201).json(chats)
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error creating chat" });
  }
}
// get chat by id from; params 
const getChat = async (req, res) => {
  try {
    const { id } = req.params;
    // find chat by id and user__id
    // need to check about the select option here
    // need to fix this
    if(!req.params.id){
      return res.status(400).json("sorry")
    }
    const chats = await chat.findOneAndUpdate(
      { _id: id, userIds: { $in: [req.user.id] } },
      { $addToSet: { seenBy: req.user.id } }, // Ensure user ID is unique in seenBy
      { new: true }
    )
    //thinking about puttin it in an array of messages
    // look for messages relative to this chat_id
    const messages=await message.find({chatId:id})
    return res.status(201).json({chats,messages});
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error getting chat" });
  }
}

const deleteChat = async (req, res) => {
  try {
    const { id: chat_id } = req.params;
    const { id: user_id } = req.user;

    if (!user_id) {
      return res.status(400).json({ message: "You need to be logged in to delete this chat" });
    }

    const chats = await chat.findOneAndDelete({
      _id: chat_id,
      userIds: { $in: [user_id] }
    });

    return res.status(200).json({ message: "Chat deleted successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error deleting chat" });
  }
}

module.exports = { getAllchats, getChat, deleteChat, createChat }; 
