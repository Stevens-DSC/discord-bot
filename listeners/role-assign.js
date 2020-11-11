const { channels, roles, guilds } = require('../constants')

const { assignGroupsToMembers } = require('./mentor/assign.js');

async function assignRole(member,role) {
    await member.roles.add(role);   
}
async function removeRole(member,role) {
    try {
        await member.roles.remove(role);  
    }catch(e) {}
 
}

module.exports = function(client) {
    client.on('message', async message => {
        if(message.author.bot) return;
        try {
            if(message.channel == channels.welcome) {
                const member = message.member
                await message.delete()
                const txt = message.content.toLowerCase()
        
                if(txt == "tech") {
                    await assignRole(member, roles.tech);
                    await removeRole(member, roles.business);
                    await removeRole(member, roles.design);      
                    await assignRole(member, roles.member);   
                    await assignGroupsToMembers(member, message.channel.guild) 
                    member.send("We've assigned Tech team as your primary team! If your Discord account doesn't use your real name, feel free to type it below and I'll assign you a nickname.")  
                    return;
        
                }
        
                if(txt == "business") {
                    await removeRole(member, roles.tech);
                    await assignRole(member, roles.business);
                    await removeRole(member, roles.design);
                    await assignRole(member, roles.member);
                    await assignGroupsToMembers(member, message.channel.guild) 
                    member.send("We've assigned Business team as your primary team! If your Discord account doesn't use your real name, feel free to type it below and I'll assign you a nickname.")  
        
                    return;
                }
        
                if(txt == "design") {
                    await removeRole(member, roles.tech);
                    await removeRole(member, roles.business);
                    await assignRole(member, roles.design);  
                    await assignRole(member, roles.member);
                    await assignGroupsToMembers(member, message.channel.guild) 
                    member.send("We've assigned Design team as your primary team! If your Discord account doesn't use your real name, feel free to type it below and I'll assign you a nickname.")  
        
                    return;
                }
        
        
        
            }
        }catch(e) {
            console.log(e)
        }

    })

    
}