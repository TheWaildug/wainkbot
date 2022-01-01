const ms = require("ms")
const MakeEmbed = require("../../makeembed")
const wait = require("util").promisify(setTimeout)
module.exports = {
    commands: ["ping","latiency"],
    description: "Shows current ping.",
    expectedArgs: [],
    category: "Utility",
    permissionError: "If you see this, something went wrong.",
    requiredRoles: "@everyone",
    minArgs: null,
    maxArgs: null,
    callback: async (message, arguments, text) => {
        const now = new Date();
		const utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
        const yourping = now - message.createdTimestamp;
		const clientping = message.client.ws.ping
        let embed = await MakeEmbed({description: `Pinging <a:loading:875074931459751937>`, color: "ff00f3"})
       const msg = await message.channel.send(embed)
       wait(5000)
		embed = await MakeEmbed({title: `Pong!`, description: `**Latiency:** ${yourping}\n**Websocket:** ${clientping}`, color: "ff00f3"})
        
		msg.edit(embed)
		return;
    }
}