module.exports = {
    commands: ["mock","spongebob"],
    description: "MaKeS tEXT lIKe This",
    requiredRoles: "@everyone",
    expectedArgs: "<text>",
    permissionError: "If you can see this, something went wrong.",
    minArgs: 1,
    maxArgs: null,
    Category: "Fun",
    callback: async (message,args,text) => {
        let msg = text
        let mock = require("../../mock")(msg)
        return message.channel.send(mock,{allowedMentions: {parse: []}})
    }
}