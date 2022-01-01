const MakeEmbed = require("../../makeembed")
module.exports = {
    commands: ["starttyping", "starttype"],
    description: "Makes WainkBot type in the current channel.",
    expectedArgs: [],
    minArgs: null,
    maxArgs: null,
    requiredRoles: "@everyone",
    permissionError: "If you can see this, something went wrong.",
    Category: "Fun",
    callback: async (message,args) => {
        console.log(`start typing ${message.member.id}`)
        message.delete();
        message.channel.startTyping(5)
        return;
    }
}