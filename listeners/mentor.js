const { channels, roles, guilds } = require('../constants')

const fs = require('fs')
const path = require('path')

module.exports = function(client) {
    client.on('message', async message => {
        if(message.author.bot) return;
        const text = message.content
        if(text.startsWith("!mentor-test")) {
            message.reply("Mentor test");
        }

    })
}
   