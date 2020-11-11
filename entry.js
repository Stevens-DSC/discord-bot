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

// require('./listeners/namechange.js')(client)
// require('./listeners/role-assign.js')(client)
require('./listeners/mentor/create.js')(client)
require('./listeners/mentor/assign.js')(client)
// require('./listeners/signin.js')(client)

client.login(TOKEN)

const fs = require('fs')
const path = require('path')

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
        res.send((fs.readFileSync((path.join(__dirname + '/meetings/' + filename) + "")) + "").split('\n').map(a=>a.split(',')[0]).join('\n'))
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
