import {Account, AccountType, AccountGroup } from "./models/account.js";
import { accountGroupsToSeed, accountTypesToSeed } from "./data.js";



export async function seedPredefinedAccounts() {
    for (const [name, { accountType, accountGroup }] of Object.entries(Account.predefinedAccountsMapping)) {
        const type = await AccountType.findOne({ name: accountType });
        const group = await AccountGroup.findOne({ name: accountGroup });

        if (!type || !group) {
            console.warn(`Skipping account "${name}": Type or group not found.`);
            continue;
        }

        const account = new Account({
            controlId: `ACC-${name.toUpperCase()}`,
            serialNumber: `SN-${name.toUpperCase()}`,
            name,
            accountType: type._id,
            accountGroup: group._id,
            isActive: true,
            balance: 0,
        });

        await account.save();
        console.log(`✅ Seeded account: ${name}`);
    }
}

export async function seedAccountTypes() {
    for (const typeData of accountTypesToSeed) {
        const existingType = await AccountType.findOne({ name: typeData.name });

        if (!existingType) {
            const newType = new AccountType(typeData);
            await newType.save();
            console.log(`✅ Seeded account type: ${typeData.name}`);
        } else {
            console.log(`ℹ️ Account type already exists: ${typeData.name}`);
        }
    }
}



export async function seedAccountGroups() {
    for (const groupData of accountGroupsToSeed) {
        const existingGroup = await AccountGroup.findOne({ name: groupData.name });

        if (!existingGroup) {
            const accountType = await AccountType.findOne({ name: groupData.accountType });
            if (!accountType) {
                console.warn(`Skipping account group "${groupData.name}": Account type "${groupData.accountType}" not found.`);
                continue;
            }

            const newGroup = new AccountGroup({
                ...groupData,
                accountType: accountType._id,
            });

            await newGroup.save();
            console.log(`✅ Seeded account group: ${groupData.name}`);
        } else {
            console.log(`ℹ️ Account group already exists: ${groupData.name}`);
        }
    }
}