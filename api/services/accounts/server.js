import { Router } from 'express'
import { AccountingService } from './accountservice.js'
import asyncHandler from 'express-async-handler'
import { accIdGenerator, generateId } from '../../utils.js'
import { Account, AccountGroup, AccountType } from '../../models/account.js'



const accountsRouter = Router()







accountsRouter.get('/groups', asyncHandler(async(req, res)=> {
    //console.log('requesting groups')
    const accounts = await AccountGroup.find({})
    res.send(accounts)
}))

///GET ACCOUNTS
accountsRouter.get('/', asyncHandler(async (req, res) => {
    const query = req.query;

    // Construct the projection object dynamically (inclusion only)
    const project = Object.keys(query).reduce((acc, key) => {
        if (parseInt(query[key], 10) === 1) {
            acc[key] = 1; // Include only fields explicitly set to 1
        }
        return acc;
    }, {}); // Start with an empty object

    const accounts = await Account.find({}, project).sort({ name: 1 });
    res.send(accounts);
}));


accountsRouter.get('/:id', asyncHandler(async(req, res)=>{
    const account = await AccountGroup.findById(req.params._id)
    res.send(account)
}))


// Create a new account
accountsRouter.post('/', async (req, res) => {
    const { name, accountGroup, isActive, balance, subType } = req.body;

    try {
        // Validate required fields
        if (!name || !accountGroup) {
            return res.status(400).json({ message: 'Name and accountGroup are required' });
        }

        // Fetch and validate accountGroup
        const group = await AccountGroup.findById(accountGroup).populate('accountType');
        if (!group) {
            return res.status(400).json({ message: 'Invalid account group' });
        }

        // Generate account data
        const dbLen = await Account.countDocuments();
        const account = new Account({
            name,
            accountGroup,
            typeName: group.accountType.name,
            accountType: group.accountType._id,
            controlId: await generateId(),
            groupName: group.name,
            serialNumber: await accIdGenerator(group.accountType.name),
            isActive: isActive !== undefined ? isActive : true,
            balance: balance || 0,
            subType,
        });

        // Save the account
        await account.save();
        res.status(201).send(account);
    } catch (error) {
        /* if (error.code === 11000) {
            return res.status(400).json({ message: 'Duplicate controlId or serialNumber' });
        } */
        console.error('Error creating account:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

/* ////CREATE ACCOUNT
accountsRouter.post('/', asyncHandler(async(req, res)=> {

    const { name, type, subType, description, group, parentAccount} = req.body
    console.log(req.body)

    if(!name || !type){
        res.status(400);
        throw new Error('Name and type are required.');
    }

    // Validate account type
    const validTypes = ['asset', 'liability', 'equity', 'revenue', 'expense'];
    if (!validTypes.includes(type)) {
        res.status(400);
        throw new Error(`Invalid account type. Must be one of: ${validTypes.join(', ')}`);
    }

    const acctsLen = await Account.countDocuments()
    const dbLen = acctsLen > 0 ? acctsLen + 1 : 1;
    const code = (acctsLen + 1).toString().padStart(4, '0')

    // Check if parentAccount exists (if provided)
    if (parentAccount) {
        const parent = await Account.findById(parentAccount);
        if (!parent) {
            res.status(404);
            throw new Error('Parent account not found.');
        }
    }



    const newAccount = new Account({
        name,
        controlId: await accIdGenerator(type, dbLen),
        subType,
        code,
        group,
        type,
    })

    await newAccount.save()
    // If this account has a parent, update the parent's balance (if applicable)
    if (parentAccount) {
        const parent = await Account.findById(parentAccount);
        parent.balance += newAccount.balance; // Add child balance to parent
        await parent.save();
    }

    res.send(newAccount)
    
}))
 */

export default accountsRouter