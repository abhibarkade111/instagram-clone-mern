const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types


const userSchema =  new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required: true
    },
    password:{
      type: String,
      required: true  
    },
    resetToken:String,
    expiredToken:Date,
    pic:{
        type:String,
        default:"https://res.cloudinary.com/technicalab/image/upload/v1627278283/profile_wygqv3.jpg"
    },
    followers:[{type:ObjectId,ref:"User"}],
    following:[{type:ObjectId,ref:"User"}]
})

mongoose.model("User", userSchema)
