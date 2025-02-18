import User from "../../models/user.js";
import { Router } from "express";
import asyncHandler from "express-async-handler";


const userRouter = Router()

userRouter.get('/', asyncHandler(async(req, res)=> {
    const users = await User.find()
    res.status(200).send(users)
}))


export default userRouter