const dotenv = require('dotenv').config()
const Discord = require('discord.js')
const client = new Discord.Client()
const parser = require('discord-command-parser')
const mexp = require('math-expression-evaluator')

const botKey = process.env.BOT_KEY

client.on('ready', () => {
    console.log(`Connected as ${client.user.tag}`)
    client.user.setPresence({
        activity: {
            name: 'FateCore | !help'
        },
        status: 'available'
    })
})

client.on('message', receivedMessage => {
    const prefix = '!'

    const parsed = parser.parse(receivedMessage, prefix)

    if (receivedMessage.author == client.user) {
        return
    }

    if (!parsed.success) return

    switch (parsed.command) {
        case 'help':
        case 'h':
            helpCommand(parsed.arguments, receivedMessage)
            break

        case 'roll':
        case 'r':
            rollCommand(parsed.arguments, receivedMessage)
            break

        default:
            receivedMessage.channel.send("I don't understand that command. Try !help")
            break
    }
})

const helpCommand = (args, receivedMessage) => {
    if (args.length === 0) {
        receivedMessage.channel.send("\`!help / !h: List all commands for Lord of Fate, or input a specific command as an argument; !help [command without prefix]\n!roll / !r: Roll 4 fate dice; !roll [+/-*] [integer]\`")
    } else {
        switch (args[0]) {
            case 'help':
            case 'h':
                receivedMessage.channel.send("\`!help / !h: List all commands for Lord of Fate, or input a specific command as an argument; !help [command without prefix]\`")
            case 'roll':
            case 'r':
                receivedMessage.channel.send("\`!roll / !r: Roll 4 fate dice; !roll [+/-*] [integer]\`")
        }
    }
}

const rollCommand = (args, receivedMessage) => {
    const values = [-1, 0, 1]
    let rolls = []
    let rollsResult = 0
    let mods = args

    for (i = 0; i < 4; i++) {
        let randomNumber = values[Math.floor(Math.random() * 3)]
        rolls.push(randomNumber)
        rollsResult += randomNumber
    }

    if (mods.length > 0 && !!Number(mods.join('').split('')[0])) {
        mods.unshift('+')
    }

    mods.unshift(String(rollsResult))

    try {
        receivedMessage.channel.send(`
                ${receivedMessage.author}\n**ROLL:** \`[${rolls.join(', ')}]\` = ${rollsResult}\n**FINAL:** ${mexp.eval(mods.join(''))}
            `)
    } catch (err) {
        receivedMessage.channel.send(`${receivedMessage.author}\n\`ERROR:${err.message}\``)
    }
    console.log(args)
}

client.login(botKey)