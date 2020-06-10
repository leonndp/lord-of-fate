const dotenv = require('dotenv').config()
const Discord = require('discord.js')
const client = new Discord.Client()
const parser = require('discord-command-parser')
const mexp = require('math-expression-evaluator')

const botKey = process.env.BOT_KEY

client.on('ready', () => {
    console.log(`Connected as ${client.user.tag}`)
})

client.on('message', receivedMessage => {
    const prefix = '!'

    if (receivedMessage.author == client.user) {
        return
    }

    const parsed = parser.parse(receivedMessage, prefix)

    if (!parsed.success) return

    if (parsed.command === 'roll') {
        rollCommand(parsed.arguments, receivedMessage)
    }

    // console.log(parsed)
})

const processCommand = receivedMessage => {
    const prefix = '!'

    const parsed = parser.parse(receivedMessage, prefix)
    if (!parsed.success) return

    if (parsed.command === 'roll') {
        rollCommand(args, receivedMessage)
    }
}

const helpCommand = (args, receivedMessage) => {
    if (args.length === 0) {
        receivedMessage.channel.send("**!help / !h:** List all commands for Lord of Fate, or input a specific command as an argument; !help <command without prefix>\n**!roll / !r: Roll 4 fate dice; !roll <+/-*> <integer>")
    } else {
        receivedMessage.channel.send('It looks like you need help with ' + args)
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

    mods.unshift(String(rollsResult))

    if (!'+-/*'.includes(args[0])) {
        receivedMessage.channel.send(`Invalid arguments! Try !help`)
    } else {
        try {
            receivedMessage.channel.send(`
                ${receivedMessage.author}\n**ROLL:** [${rolls.join(', ')}] = ${rollsResult}\n**FINAL:** ${mexp.eval(mods.join(''))}
            `)
        } catch (err) {
            receivedMessage.channel.send(`${receivedMessage.author}\n${err.message}`)
        }
    }
}

client.login(botKey)