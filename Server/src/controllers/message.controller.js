import cloudinary from "../lib/cloudinary.js";
import { getRecieverSocketId, io } from "../lib/socket.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const getUsers = async (req,res)=>{
    try {
        const loggedIn = req.user._id;
        const filteredUsers = await User.find({_id:{ $ne: loggedIn } }).select("-password");
        res.status(200).json(filteredUsers);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
}

export const getMessages = async (req,res)=>{
    try {
        const usertochatId = req.params.id;
        const myId = req.user._id;

        const messages = await Message.find({
            $or:[
                {senderId:myId,receiverId:usertochatId},
                {senderId:usertochatId,receiverId:myId}
            ]
        })
        res.status(200).json(messages);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
}

export const sendMessage = async (req,res)=>{
    try {
        const {text,image} = req.body;
        const {id:receiverId} = req.params;
        const senderId = req.user._id;
        let imageUrl;

        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image:imageUrl
        });

        await newMessage.save();

        //Todo Socket.Io
        const receiverSocketId = getRecieverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newMessage);
        }

        res.status(201).json(newMessage);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
}