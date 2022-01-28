const fs = require("fs")
const ms = require("ms")
const MakeEmbed = require("../../makeembed")
const InformationSchema = informationschema = require("../../informationschema")
module.exports = {
    commands: ["restart", "reboot"],
    description: "Restarts WainkBot",
    requiredRoles: ["832364191075663903","813837707393761300"],
    expectedArgs: [],
    minArgs: null,
    maxArgs: null,
    permissionError: `You cannot run this command.`,
    Category: "Utility",
    callback: async (message,args) => {
        if(message.member.id != "432345618028036097"){
            const embed = await MakeEmbed({title: "Permissions Error", description: `You are not allowed to run this command.`, color: "RED"})
            message.delete();
            message.channel.send({embeds: [embed]}).then(msg => {
                setTimeout(() => {
                    msg.delete();
                },5000)
            })
            return;
        }
        await informationschema.deleteMany()
        
        let information = new informationschema({
            channel: message.channel.id,
            currenttime: new Date().getTime(),
            active: true
        })
        console.log(information)
        await information.save();
        message.channel.send(`Restarting...`).then(() => {
            return process.exit();
        })
    }
}