import { Router } from "express";
import Job from "../../models/job.js";

const jobsRouter = Router()


jobsRouter.post('/', asyncHandler(async(req, res)=>{
    const {name, description, salary, occupied, salaryComment, employeeId} = req.body

    const job = new Job({
       name,
       description,
       salary,
       occupied, 
       department,
       employee: employeeId,
       salaryComment
     
    })
    await job.save()
    res.status(200).send(job)
}))



export default jobsRouter