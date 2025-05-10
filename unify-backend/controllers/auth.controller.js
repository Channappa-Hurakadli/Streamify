import User from "../models/User.js";
import jwt from "jsonwebtoken";
// import cookie from "cookie-parser";

export async function signup(req, res) {
  const {email, password, fullName} = req.body;

  try {
    if(!email || !password || !fullName) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    if(password.length < 4){
        res.status(400).json({message: "Password must be at least 4 characters long"})
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const idx = Math.floor(Math.random() * 100)+1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

    //Create a new user
    const newUser = await User.create({
        email,
        fullName,
        password,
        profilePic:randomAvatar
    })
    // Generate JWT token
    const token = jwt.sign({userId:newUser._id}, process.env.JWT_SECRET, {expiresIn: "30d"});

    res.cookie("token",token,{
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    })
    res.status(201).json({
        success: true,
        message: "User created successfully",
        user: newUser,
        token
    })

  } catch (error) {
    console.log("Error in signup controller", error);
    res.status(500).json({ success:false,message: "Internal server error" });
  }
}


export async function login(req, res) {
    try {
        const { email, password } = req.body;
        if(!email || !password){
            return res.status(400).json({message:"All fields are required"})
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({message:"Invalid credentials"})
        }
        const isMatch = await user.matchPassword(password);

        if(!isMatch){
            return res.status(401).json({message:"Invalid credentials"})
        }

        // Generate JWT token
        const token = jwt.sign({userId:user._id}, process.env.JWT_SECRET, {expiresIn: "30d"});

        res.cookie("token",token,{
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        })
        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            user,
            token
        })

    } catch (error) {
        console.log("Error in login controller", error);
        res.status(500).json({ success:false,message: "Internal server error" });
    }
}

export async function logout(req, res) {
    try {
        res.clearCookie("token");
        res.status(200).json({success:true, message: 'User logged out successfully' });
    } catch (error) {
        res.status(500).json({ success:false,message: "Internal server error" });
    }
}

