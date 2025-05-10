import mongoose from "mongoose";
import bcrypt from "bcryptjs";


const userSchema = new mongoose.Schema({
    fullName:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
        minlength: 4
    },
    bio:{
        type: String,
        default: "Hey there! I am using Unify."
    },
    profilePic:{
        type: String,
        default: ""
    },
    gender:{
        type: String,
        default:""
    },
    nativeLanguage:{
        type: String,
        default: ""
    },
    learningLanguage:{
        type: String,
        default: ""
    },
    country:{
        type: String,
        default: ""
    },
    isOnboarded:{
        type: Boolean,
        default: false
    },
    friends:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ]
},{timestamps:true})

// prehook middleware to hash password before saving
userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error); 
    }
})

userSchema.methods.matchPassword = async function(enteredPassword){
    const isCorrect = await bcrypt.compare(enteredPassword, this.password);
    return isCorrect;
}
const User = mongoose.model("User", userSchema);



export default User;