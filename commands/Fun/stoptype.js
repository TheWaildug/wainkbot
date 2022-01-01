const MakeEmbed = require("../../makeembed")
module.exports = {
    commands: ["stoptyping", "stoptype"],
    description: "Makes WainkBot stop typing in the current channel.",
    expectedArgs: [],
    minArgs: null,
    maxArgs: null,
    requiredRoles: "@everyone",
    permissionError: "If you can see this, something went wrong.",
    Category: "Fun",
    callback: async (message,args) => {
        console.log(`stop typing ${message.member.id}`)
        message.delete();
        message.channel.stopTyping(true)
        return;
    }
}