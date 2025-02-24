import User from "../../models/user.js";
import { Router } from "express";
import asyncHandler from "express-async-handler";
import { generateToken } from "../../utils.js";


const userRouter = Router()


//GET ALL USERS
userRouter.get('/', asyncHandler(async(req, res)=> {
    const users = await User.find()
    res.status(200).send(users)
}))



///ADMIN MAKE ANOTHER USER ADMIN
userRouter.patch('/admin/:id', asyncHandler(async(req, res)=>{
    
    const user = await User.findById(req.params.id)
    
    if(!user) return res.status(404).send({message: "user not found"})
    
        user.isAdmin = req.body.isAdmin

    await user.save()
    res.status(200).send(user)
}))



//ADMIN DELETE USER
userRouter.delete('/admin/:id', asyncHandler(async(req, res)=>{
    
    const user = await User.findByIdAndDelete(req.params.id)
    
    if(!user) return res.status(404).send({message: "user not found"})

    res.status(200).send({message: "user deleted successfully"})
}))



//EDIT USER
userRouter.post('/:id', asyncHandler(async(req, res)=>{
    
    const user = await User.findById(req.params.id)
    
    const {username,firstname,lastname,email,phone,} = req.body
    
    if(!user) return res.status(404).send({message: "user not found"})

        if(username) user.username =  username
        if(firstname) user.firstname = firstname
        if(lastname) user.lastname =  lastname
        if(email) user.email = email
        if(phone) user.phone = phone
        
    await user.save()
    res.status(200).send({message: "user updated successfully"})
}))


//ADMIN ADD NEW USER
userRouter.post('/admin', asyncHandler(async(req, res)=>{
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


export default userRouter