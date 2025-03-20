import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,    
        required:true,
        minlength:6,
    },
    fullName:{
        type:String,
        required:true,
    },
    profilePic:{
        type:String,
        default:"",
    },
    description:{
        type:String,
        default:"NICE TO MEET YOU ",
    }
},{
    timestamps:true
}
);
const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;