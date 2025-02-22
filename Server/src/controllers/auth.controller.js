import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs"

export const signup = async (req,res)=>{
    const {fullName,email,password} = req.body;
    try {
        if(!fullName || !email || !password){
            return res.status(400).json({message:"All Fields are required"});
        }

        if(password<6){
            return res.status(400).json({message:"Password should be atleast 6 characters"});
        }
        const user = await User.findOne({email})
        if(user) return res.status(400).json({message:"Email already Exists"});

        const salt = await bcrypt.genSalt(10);
        const hashedPasswword = await bcrypt.hash(password,salt);

        const newUser = new User({
            fullName,
            email,
            password:hashedPasswword
        });

        if(newUser){
            generateToken(newUser._id,res);
            await newUser.save();
            res.status(201).json({
                _id:newUser._id,
                fullName:newUser.fullName,
                email:newUser.email,
                profilePic:newUser.profilePic
            });
        }else{
            return res.status(400).json({message:"Invalid User Data"});
        }
    } catch (error) {
        console.log("error in controller",error);
        res.status(500).json({message:"Internal Status Code error"})
    }
}

export const login = async (req,res)=>{
    const {email,password} = req.body;
    try {
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"Invalid Credentials"});
        }
        const ispassword = await bcrypt.compare(password,user.password);

        if(!ispassword){
            return res.sstatus(400).json({message:"Invalid Credentials"});
        }
        generateToken(user._id,res);
        res.status(201).json({
            _id:user._id,
            fullName:user.fullName,
            email:user.email,
            profilePic:user.profilePic,
            createdAt:user.createdAt,
            updatedAt:user.updatedAt,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal Status Code error"})
    }
}

export const logout = (req,res)=>{
    try {
        res.cookie("jwt","",{maxAge:0});
        res.status(200).json({message:"Logged out Successfully"})
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal Server error"});
    }
}

export const updateProfile = async (req,res) =>{
    try {
        const {profilePic} = req.body;
        const userId = req.user._id;
        if(!profilePic){
            res.status(400).json({message:"Profile pic required"});
        }
        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updateUser = await User.findByIdAndUpdate(
            userId,
            {profilePic:uploadResponse.secure_url},
            {new:true});
        res.status(200).json(updateUser)
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Internal Error"});
    }
}

export const checkAuth = (req,res)=>{
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
}