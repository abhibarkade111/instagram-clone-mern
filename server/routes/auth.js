const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require("../config/keys")
const requireLogin =  require("../middleware/requireLogin")
const crypto = require('crypto')
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')
const {SENDGRID_API, EMAIL} = require("../config/keys")



const transporter = nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key:SENDGRID_API
    }
}))

router.post('/signup',(req,res)=>{
   const { name , email, password,pic}= req.body
   if(!email|| !password || !name){
    return res.status(422).json({err:'please add all of the feilds'})   
   }
  User.findOne({email:email})
  .then((savedUser)=>{
      if(savedUser){
          return res.status(422).json({error:"User already exists with that email"})
      }
       bcrypt.hash(password,12)
       .then(hashedpassword=>{

            const user =  new User({
                email,
                name,
                password:hashedpassword,
                pic
            })
    
            user.save()
            .then(user=>{
                transporter.sendMail({
                    to:user.email,
                    from:"abhibarkade111@gmail.com",
                    subject:" successfully signup",
                    html:"<h1>welcome to instagram</h1>"
                })
                res.json({message: "Signup successfully"})
            })
            .catch(err=>{
                console.log(err)
            })

       })
      
  })
  .catch(err=>{
      console.log(err)
  })
})


router.post('/signin', (req, res)=>{
    const {email,password}= req.body
    if(!email || !password){
        res.status(422).json({error:"Please add emial or password "})
    }
        User.findOne({email:email})
        .then(savedUser=>{
            if(!savedUser){
               return res.status(422).json({error: "Invalid Email or Password"})
            }
            bcrypt.compare(password, savedUser.password)
            .then(doMatch=>{
                if(doMatch){
                    // res.json({message: "Successfully Signed in"})
                    const token = jwt.sign({_id:savedUser._id}, JWT_SECRET)
                    const {_id,name, email,followers,following,pic} = savedUser
                    res.json({token,user:{_id,name,email,followers,following,pic}})
                }
                else{
                    return res.status(422).json({error: " Invalid Email or Password"})
                }
            })
            .catch(err=>{
                console.log(err)
            })
        })

    
})

router.post('/reset-password',(req,res)=>{
    crypto.randomBytes(32,(err,buffer)=>{
        if(err){
            console.log(err)
        }
        const token = buffer.toString("hex")
        User.findOne({email:req.body.email})
        .then(user=>{
            if(!user){
                return res.status(422).json({error:"User does not match with that email"})
            }
           user.resetToken = token
           user.expiredToken = Date.now()+ 3600000
           user.save().then((result=>{
            transporter.sendMail({
                to:user.email,
                from:"abhibarkade111@gmail.com",
                subject:"password reset",
                html:`
                <p>You requested for password reset</p
                <h5>Click the below button to reset password</h5>
                <button className="btn waves-effect waves-light #64b5f6 blue darken-1"  ><a href="${EMAIL}/reset/${token}">Reset Password</a>
                </button>
                <button><a href="${EMAIL}/reset/${token}>Click Here </a></button>`
            })
            res.json({message:"check the eamil"})
           }))
        })
    })
})

router.post('/new-password',(req,res)=>{
    const NewPassword = req.body.password
    const sentToken = req.body.token
    User.findOne({resetToken:sentToken, expiredToken:{$gt:Date.now()}})
    .then(user=>{
        if(!user){
            return res.status(422).json({error:"Try again session expired"})
        }
        bcrypt.hash(NewPassword,12).then(hashedpassword=>{
            user.password = hashedpassword
            user.resetToken = undefined
            user.expiredToken = undefined
            user.save().then(savedUser=>{
                res.json({message:"Password updated successfully"})
            })
        })
    }).catch(err=>{
        console.log(err)
    })

})


module.exports= router