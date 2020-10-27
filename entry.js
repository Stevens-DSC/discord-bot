require('dotenv').config()
const { channels, roles, guilds } = require('./constants')

const express = require('express')
const app = express()

if(!process.env.DISCORD_TOKEN) {
    console.error("No token defined.")
    process.exit(1)
}

const TOKEN = process.env.DISCORD_TOKEN
const PORT = process.env.PORT || 3000


const Discord = require('discord.js')
const client = new Discord.Client()
let ready = false

client.once('ready', () => {
    console.log('Connected to Discord Cloud')
    ready = true
})
async function assignRole(member,role) {
    await member.roles.add(role);   
}
async function removeRole(member,role) {
    try {
        await member.roles.remove(role);  
    }catch(e) {}
 
}
const fs = require('fs')
const path = require('path')


client.on('message', async message => {
    
    if(message.author.bot) return;
    if(message.guild === null) {
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
        
        return;
    }

    function append(a,b) {
        return new Promise((resolve, reject) => {
            fs.appendFile(a,b,(err) => err ? reject(err) : resolve())
        })
    }
    if(message.channel == channels.signin) {
        const member = message.author
        const txt = message.content
        const dateObj = new Date()
        const month = dateObj.getUTCMonth() + 1 //months from 1-12
        const day = dateObj.getUTCDate()
        const year = dateObj.getUTCFullYear()

        const filename = parseInt(year) + '-' + parseInt(month) + '-' + parseInt(day)

        await append(path.join(__dirname + '/meetings/' + filename + '.csv') + "", txt + ',' + message.author.id + ',' + Date.now() + '\n', (err) => err ? reject(err) : resolve())
        await message.delete()
        member.send("Thanks for signing in on " + filename  +"! Enjoy the meeting :)")  

    }
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
            member.send("We've assigned Tech team as your primary team! If your Discord account doesn't use your real name, feel free to type it below and I'll assign you a nickname.")  
            return;

        }

        if(txt == "business") {
            await removeRole(member, roles.tech);
            await assignRole(member, roles.business);
            await removeRole(member, roles.design);
            await assignRole(member, roles.member);
            member.send("We've assigned Business team as your primary team! If your Discord account doesn't use your real name, feel free to type it below and I'll assign you a nickname.")  

            return;
        }

        if(txt == "design") {
            await removeRole(member, roles.tech);
            await removeRole(member, roles.business);
            await assignRole(member, roles.design);  
            await assignRole(member, roles.member);
            member.send("We've assigned Business team as your primary team! If your Discord account doesn't use your real name, feel free to type it below and I'll assign you a nickname.")  

            return;
        }



    }
}catch(e) {
    console.log(e)
}
});

client.login(TOKEN)
app.get('/', (req, res) => { res.send("Stevens DSC")} )
app.get('/meeting/:year/:month/:day/signin.csv', (req, res) => { 
    try {
        const { year, month, day } = req.params
        const filename = parseInt(year) + '-' + parseInt(month) + '-' + parseInt(day) + '.csv'
        res.sendFile(path.join(__dirname + '/meetings/' + filename) + "")
    }catch(e) {
        res.send("404").status(404)
    }

} )

app.get('/meeting/:year/:month/:day/signin.txt', (req, res) => { 
    try {
        const { year, month, day } = req.params
        const filename = parseInt(year) + '-' + parseInt(month) + '-' + parseInt(day) + '.csv'
        // this is shit but it's not often at all people do this anyway
        res.header('Content-Type', 'text/plain')
        res.send(fs.readFileSync(path.join(__dirname + '/meetings/' + filename) + ""))
    }catch(e) {
        res.send("404").status(404)
    }

} )

app.get('/meeting/today/signin.csv', (req, res) => { 
    const dateObj = new Date()
    const month = dateObj.getUTCMonth() + 1 //months from 1-12
    const day = dateObj.getUTCDate()
    const year = dateObj.getUTCFullYear()

    res.redirect('/meeting/' + parseInt(year) + '/' + parseInt(month) + '/' + parseInt(day) + '/signin.csv')

} )

app.get('/meeting/today/signin.txt', (req, res) => { 
    const dateObj = new Date()
    const month = dateObj.getUTCMonth() + 1 //months from 1-12
    const day = dateObj.getUTCDate()
    const year = dateObj.getUTCFullYear()

    res.redirect('/meeting/' + parseInt(year) + '/' + parseInt(month) + '/' + parseInt(day) + '/signin.txt')

} )

app.listen(PORT)
