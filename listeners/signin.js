const { channels, roles, guilds } = require('../constants')

const fs = require('fs')
const path = require('path')

module.exports = function(client) {
    client.on('message', async message => {
        if(message.author.bot) return;
        
        function append(a,b) {
            return new Promise((resolve, reject) => {
                fs.appendFile(a,b,(err) => err ? reject(err) : resolve())
            })
        }
        if(message.channel != channels.signin) 
        return;
            const member = message.author
            const txt = message.content
            const dateObj = new Date()
            const month = dateObj.getUTCMonth() + 1 //months from 1-12
            const day = dateObj.getUTCDate()
            const year = dateObj.getUTCFullYear()
    
            const filename = parseInt(year) + '-' + parseInt(month) + '-' + parseInt(day)
    
            await append(path.join(__dirname + '/../meetings/' + filename + '.csv') + "", txt + ',' + message.author.id + ',' + Date.now() + '\n', (err) => err ? reject(err) : resolve())
            await message.delete()
            member.send("Thanks for signing in on " + filename  +"! Enjoy the meeting :)")  
    
        


    })
}
   