import User from "../../models/user.js";
import { Router } from "express";
import asyncHandler from 'express-async-handler'
import bcrypt from 'bcrypt'
import { generateToken } from "../../utils.js";

const authRouter = Router()


authRouter.post('/', asyncHandler(async(req, res)=>{
    const {firstname, lastname, username, email, phone, password} = req.body
    //console.log(n, password)

    const hasedPassword = await bcrypt.hash(password, 10)
    const userExists = await User.findOne({username: username})
    if(userExists){
        res.send({message: 'username taken'})
        return
    }

    const newuser = new User({
        username,
        firstname,
        lastname,
        email,
        phone,
        password: hasedPassword
    })

    const savedUser = await newuser.save()
    res.status(200).send({token: generateToken(savedUser), savedUser})
}))


authRouter.post('/login', asyncHandler(async(req, res)=>{
    const {username, password} = req.body

    const user = await User.findOne({username: username})

    if( user ){

        const verifyPassword = bcrypt.compareSync(password, user.password)
        if(verifyPassword){
            res.send({
                _id: user._id,
                username: user.username,
                email: user.email,
                phone: user.phone,
                token: generateToken(user)
            })
        }
    }else{
        res.status(405).send({message: 'check username or password'})
    }

}))

export default authRouter