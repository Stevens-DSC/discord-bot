module.exports = {
    channels: {
        "welcome": "770432114952503359",
        "signin": "770440224731561984",
        "botcommands": "771498973528719401",
        "mentorscategory": "772600061442916352"
    },
    roles: {
        "tech": "770432347341979668",
        "design": "770432391927562270",
        "business": "770432413221257226",
        "member": "770437645121749012"
    },
    guilds: {
        "dsc": "770432114952503356"
    },
    messages: {
        "resourceswb": "770457322790322178"
    }
}

module.exports = {
    
    ...module.exports,

    teams: {
        "tech": module.exports.roles.tech,
        "design": module.exports.roles.tech,
        "business": module.exports.roles.tech,

    }
}