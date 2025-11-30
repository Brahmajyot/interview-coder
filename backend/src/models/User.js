import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
name:
{
    type:String,
    required:true,
},
email:
{
    type:String,
    required:true,
    unique:true,
},
clerkId:
{
    type:String,
    required:true,
    unique:true,
},
profileImages:
{
    type:String,
    default:"",
},
timestamps:true //createAt and UpdateAt

})

const User = mongoose.model("User",userSchema);
export default User;