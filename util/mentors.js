let mentors = {}

const { channels, roles, guilds } = require('../constants')
const Dictionary = require("./Dictionary")

// message.guild
mentors.create = async function({title, guild}) {
    title = title.toLowerCase()
    // create
    const channel = await guild.channels.create(title, { reason: 'Create mentor group ' + title })
    await channel.setParent(channels.mentorscategory)

    const role = await guild.roles.create({
        data: {
          name: title + " Mentor Group"
        },
        reason: 'Create mentor group ' + title,
      })
    // const everyone = await guild.roles.cache.find(role => role.name === "@everyone")
    channel.updateOverwrite(guild.roles.everyone, { VIEW_CHANNEL: false})
    channel.updateOverwrite(role, { VIEW_CHANNEL: true })
}

mentors.findMentorGroup = async function(guild, str) {

    let dict = new Dictionary()

    const roles = await guild.roles.cache.find(({name}) => name == str.toLowerCase() + " Mentor Group")
    const channels = await guild.channels.find(({name}) => name == str.toLowerCase())
    return {
        role: await guild.roles.cache.find(({name}) => name == str.toLowerCase() + " Mentor Group"),
        channel: await guild.channels.find(({name}) => name == str.toLowerCase())
    }
}

mentors.allMentorDictionary = async function(guild) {

    let dict = new Dictionary()

    const roles = guild.roles.cache

    for(let _role of roles) {
        const id = _role[0]
        let role = _role[1]
        let { name } = role

        if(!name.includes(" Mentor Group")) continue
        name = name.replace(" Mentor Group", "").toLowerCase()

        console.log(role.members.array().length)

        dict.spread(name, {
            role,
            name,
            members: role.members.array().length
        })

        const channel = await guild.channels.cache.find(a => a.name == name.toLowerCase())
        dict.spread(name, { channel })

        if(name.includes("-")) {
            const team = name.split('-')[1]
            dict.spread(name, { team })
        }

    }

    return dict
}

mentors.updateStoredModel = async function(client) {
    client._storedDictionaryModel = await mentors.allMentorDictionary()
}

module.exports = mentors
