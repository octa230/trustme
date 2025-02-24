import Employee from "../../models/employee.js";
import User from '../../models/user.js';
import { Router } from "express";
import asyncHandler from "express-async-handler";
import bcrypt from 'bcrypt'
import { generateId } from "../../utils.js";



const employeeRouter = Router()

employeeRouter.post('/', asyncHandler(async(req, res)=> {

    const {firstname, lastname, username, email, phone, password} = req.body

    
    const userExists = await User.findOne({username: username})
    const employeeExists = await Employee.findOne({username: username})
    

    if(userExists || employeeExists){
        res.status(403).send({message: "user with username exists"})
        return
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    try{

        const newUser = await new User({
            firstname,
            lastname,
            email,
            username,
            phone,
            password: hashedPassword
        })
    
        await newUser.save()
        
        const employee = new Employee({
            controlId: await generateId(),
            userDetails: {
                id: newUser._id,
                username: newUser.username
            }
        })

        await employee.save()
        
        res.status(200).send({user :newUser, employee: employee})
    }catch(error){
        res.send(error)
    }

}))

employeeRouter.get('/', asyncHandler(async(req, res)=> {
    const employees = await Employee.find()
    res.status(200).send(employees)
}))

employeeRouter.delete('/', asyncHandler(async(req, res)=>{
    const employee = await Employee.findOne({controlId: req.body.controlId})
    employee.remove()
    res.status(200).send({message: "Employee  removed"})
}))


employeeRouter.patch('/info/:id', asyncHandler(async(req, res)=>{

    const {employeeId, joiningDate, leaveDate, maritalStatus, department, shift, weeklyHoliday, bloodGroup } = req.body
    const employee = await Employee.findById(req.params.id)

    if(employee){
        employee.joiningDate = joiningDate,
        employee.employeeId = employeeId
        employee.leaveDate = leaveDate,
        employee.maritalStatus = maritalStatus,
        employee.department = department,
        employee.shift = shift,
        employee.weeklyHoliday = weeklyHoliday,
        employee.bloodGroup = bloodGroup
    }

    await employee.save()
    res.status(200).send(employee)

}))


export default employeeRouter