const fs = require("fs")
const ms = require("ms")
const MakeEmbed = require("../../makeembed")
module.exports = {
    commands: ["sus", "sussy"],
    description: "imposter is sussy",
    requiredRoles: "931959403098292298",
    expectedArgs: [],
    minArgs: null,
    maxArgs: null,
    permissionError: `You cannot run this command.`,
    Category: "Utility",
    callback: async (message,args) => {
        
        
        message.channel.send(`very sussy...`)
    }
}