import FriendRequest from "../models/FriendRequest.js";
import User from "../models/User.js";

export async function getRecommendedUsers(req,res) {
    try {
        const userId = req.user._id;
        const user = req.user;

        const recommendedUsers = await User.find({
            $and:[
                {_id:{$ne:userId}},     // exclude current user
                {_id:{$nin:user.friends}},   // exclude friends of current user
                {isOnboarded:true}, // only include onboarded users
            ]
        })

        res.status(200).json({success:true, message:"Recommended users fetched successfully", recommendedUsers})

    } catch (error) {
        res.status(500).json({success:false, message:"Internal server error"});
    }

}

export async function getMyFriends(req,res){
    try {
        const user = await User.findById(req.user._id)
        .select("friends")
        .populate("friends","fullName profilePic nativeLanguage learningLanguage");

        res.status(200).json({success:true, message:"Friends fetched successfully", friends:user.friends})
    } catch (error) {
        res.status(500).json({success:false, message:"Internal server error"});
    }
}

export async function sendFriendRequest(req,res){
    try {
        const myId = req.user._id;
        const {id:recipientId} = req.params;

        //prevent self friend request
        if(myId === recipientId){
            return res.status(400).json({success:false, message:"You cannot send friend request to yourself"});
        }

        const recipient = await User.findById(recipientId);
        if(!recipient){
            return res.status(404).json({success:false, message:"Recipient not found"});
        }
        //check if already friends
        if(recipient.friends.includes(myId)){
            return res.status(400).json({success:false, message:"You are already friends with this user"});
        }

        //check if already sent friend request
        const existingRequest = await FriendRequest.findOne({
            $or:[
                {sender:myId, recipient:recipientId},
                {sender:recipientId, recipient:myId}
            ]
        });
        if(existingRequest){
            return res.status(400).json({success:false, message:"Friend request already exists"});
        }
        const friendRequest = await FriendRequest.create({
            sender:myId,
            recipient:recipientId
        });
        res.status(201).json({success:true, message:"Friend request sent successfully", friendRequest});

    } catch (error) {
        console.log(error);
        res.status(500).json({success:false, message:"Internal server error"});
    }
}
export async function acceptFriendRequest(req,res){
    try {
        const {id:requestId} = req.params;
        const friendRequest = await FriendRequest.findById(requestId);
        if(!friendRequest){
            return res.status(404).json({success:false, message:"Friend request not found"});
        }
        if(friendRequest.recipient.toString() !== req.user._id.toString()){
            return res.status(403).json({success:false, message:"You are not authorized to accept this friend request"});
        }
        friendRequest.status = "accepted";
        await friendRequest.save();

        //add to friends list
        const sender = await User.findByIdAndUpdate(friendRequest.sender,{
            $addToSet:{
                friends:friendRequest.recipient
            }
        });
        const recipient = await User.findByIdAndUpdate(friendRequest.recipient,{
            $addToSet:{
                friends:friendRequest.sender
            }
        });
        res.status(200).json({success:true, message:"Friend request accepted successfully", friendRequest});
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false, message:"Internal server error"});
    }
}
export async function getFriendRequests(req,res){
    try {
        const userId = req.user._id;
        const friendRequests = await FriendRequest.find({
            recipient:userId,
            status:"pending"
        }).populate("sender","fullName profilePic nativeLanguage learningLanguage");

        const acceptedRequest = await FriendRequest.find({
            sender:userId,
            status:"accepted" 
        }).populate("recipient","fullName profilePic");

        res.status(200).json({success:true, message:"Friend requests fetched successfully", friendRequests, acceptedRequest});
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false, message:"Internal server error"});   
    }
}
export async function outgoingFriendRequests(req,res){
    try {
        const userId = req.user._id;
        const outgoingFriendRequests = await FriendRequest.find({
            sender:userId,
            status:"pending"
        }).populate("recipient","fullName profilePic nativeLanguage learningLanguage");
        res.status(200).json({success:true, message:"Outgoing friend requests fetched successfully", outgoingFriendRequests});
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false, message:"Internal server error"});
    }
}