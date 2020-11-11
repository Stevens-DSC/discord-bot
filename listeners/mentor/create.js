const { channels, roles, guilds } = require('../../constants')

const mentors = require('../../util/mentors.js')

const fs = require('fs')
const path = require('path')

module.exports = function(client) {
    client.on('message', async message => {
        if(message.author.bot) return;
        const channel = message.channel
        const text = message.content
        if(message.channel != channels.botcommands)
            return

        if(!text.toLowerCase().startsWith("mentor-create"))
            return;
            
        const args = text.trim().split(" ")

        if(args.length < 2) {
            channel.send("Usage: mentor-create [...groups]")
            return
        }

        args.shift()

        let output = []

        for(let mentor of args) {
            mentor = mentor.toLowerCase()
            await mentors.create({title: mentor, guild: message.guild })
            output.push("Created " + mentor)
        }

        const mentor = args[0]

        channel.send(`\`\`\`${output.join("\n")}\`\`\``)

    })
}
   