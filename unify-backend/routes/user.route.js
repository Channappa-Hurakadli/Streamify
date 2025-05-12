import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import {getRecommendedUsers,getMyFriends, sendFriendRequest, acceptFriendRequest, getFriendRequests, outgoingFriendRequests} from "../controllers/user.controller.js";

const router = express.Router();

//apply middleware to all routes in this router
router.use(protectRoute);

router.get("/",getRecommendedUsers);
router.get("/friends",getMyFriends);

router.post("/friend-request/:id",sendFriendRequest);
router.put("/friend-request/:id/accept",acceptFriendRequest);

router.get("/friend-requests",getFriendRequests);
router.get("/outgoing-friend-requests",outgoingFriendRequests);

//todo: reject friend request
//todo: unfriend user
//todo: get user's friends list

export default router;