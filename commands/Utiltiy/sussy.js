const fs = require("fs")
const ms = require("ms")
const MakeEmbed = require("../../makeembed")
module.exports = {
    commands: ["sus", "sussy"],
    description: "imposter is sussy",
    requiredRoles: "832747239809613834",
    expectedArgs: [],
    minArgs: null,
    maxArgs: null,
    permissionError: `You cannot run this command.`,
    Category: "Utility",
    callback: async (message,args) => {
       
        
        message.channel.send(`very sussy...`)
    }
}