const { channels, roles, guilds } = require('../../constants')

const mentors = require('../../util/mentors.js')

const fs = require('fs')
const path = require('path')
const Dictionary = require('../../util/Dictionary')

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

        const channel = message.channel
        const text = message.content
        const guild = channel.guild

        if(message.channel != channels.botcommands)
            return

        if(!text.toLowerCase().startsWith("mentor-assign"))
            return

        const members = (await guild.members.fetch()).array()

        await assignGroupsToMembers(members, guild)

    })

}


async function assignGroupsToMembers(peopleToAssign, guild) {
    const allMentors = await mentors.allMentorDictionary(guild)
    let smg = null
    let i = peopleToAssign.length
    for(const member of peopleToAssign) {
        i--
        console.log(i + " left to assign")
        console.log("Assigning " + member.displayName)
        const cache = member.roles.cache
        
        if(await doesHaveMentorRole(cache))
            continue

        const team = await getTeam(cache)

        smg = smallestMentorGroup(allMentors, team)
        let { name, role, members } = smg

        await assignRole(member, role)
        members += 1

        allMentors.spread(name, {name, role, members})
    }
}


function smallestMentorGroup(allMentors, team) {
    let members = -1
    let cur = null
    for(const a of allMentors.flat) {
        if(!!team && a.team != team)
            continue
        if(a.members < members || members == -1) {
            members = a.members
            cur = a
        }
    }
    return cur
}

async function getTeam(cache) {
    if(await cache.find(role => role.name.toLowerCase() == "tech"))
        return "tech"

    if(await cache.find(role => role.name.toLowerCase() == "business"))
        return "business"

    if(await cache.find(role => role.name.toLowerCase() == "design"))
        return "design"

    return "tech" // default to tech, its fine
}

async function doesHaveMentorRole(cache) {
    if(await cache.find(role => role.name.toLowerCase().includes("mentor group")))
        return true
    return false
}

module.exports.assignGroupsToMembers = assignGroupsToMembers  