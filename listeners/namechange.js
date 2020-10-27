const { channels, roles, guilds } = require('../constants')


module.exports = function(client) {
    client.on('message', async message => {
        if(message.author.bot) return;
        if(message.guild !== null)
        return;
        // it's a dm
        const name = message.content
        let firstname = name
        if(name.includes(" "))
            firstname = name.split(" ")[0]
        const guild = client.guilds.cache.get(guilds.dsc)
        const member = guild.member(message.author)

        if(!member)
        return console.log(member);
        try {
            await member.setNickname(name)
            message.channel.send("Thanks, " + firstname + "! I've set your name to that.")

        }catch(e) {
            message.channel.send("You have to do it yourself because you're higher role than me! Sorry.")
        }
    })
}