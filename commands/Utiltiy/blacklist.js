const HasPermissions = require("../../isbypass")
const blacklistmongo = require("../../blacklistmongo")
const MakeEmbed = require("../../makeembed")
const RequiredRoles = require("../../values/roles")
module.exports = {
    commands: ["blacklist", "bl"],
    description: `Blacklists users from making suggestions, reports, or changing WainkBot's status.`,
    requiredRoles: "832747239809613834",
    expectedArgs: "<user> <type> <reason>",
    minArgs: 3,
    maxArgs: null,
    Category: "Utility",
    permissionError: "You cannot run this command.",
    callback: async (message,args) => {
        const mentionmember = message.mentions.members.first() || await message.guild.members.fetch(args[0]).catch(console.log)
        if(!mentionmember || mentionmember.size > 1){
            const embed = await MakeEmbed({title: "Unknown Member", description: `\`${args[0]}\` is not a member.`, color: "RED"})
            message.channel.send(embed)
            return;
        }
        if(mentionmember.user.bot){
            const embed = await MakeEmbed({title: "Permission Denied", description: `You're not allowed to blacklist bots.`, color: "RED"})
            message.channel.send(embed)
            return;
        }
        let hasperm = await HasPermissions(RequiredRoles,mentionmember)
        if(hasperm == true){
            const embed = await MakeEmbed({title: "Permission Denied", description: `You're not allowed to blacklist this user.`, color: "RED"})
            message.channel.send(embed)
            return;
        }
        let id = message.id
        let typeofbl = args[1].toLowerCase()
        if(typeofbl != "status" && typeofbl != "suggestion" && typeofbl != "report"){
            const embed = await MakeEmbed({title: `Unknown Type`, description: `This is not a blacklist type. You can choose from **status**, **report**, or **suggestion**.`, color: "RED"})
            message.channel.send(embed);
            return;
        }
        const logchannel = message.client.channels.cache.get("847864335195570198");
        if(!logchannel){
            const embed = await MakeEmbed({title: "Missing Channel", description: `Cannot find the blacklist log channel.`, color: "RED"})
            message.channel.send(embed)
            return;
        }
        let isblacklisted = await blacklistmongo.findOne({user: mentionmember.id, type: typeofbl, blacklisted: true})
        console.log(isblacklisted)
        let reason = args.splice(2).join(" ")
        if(isblacklisted == null){
            const logembed = await MakeEmbed({title: `New Blacklist`, description: `**User:** ${mentionmember}\n**Moderator:** ${message.member}\n**Reason:** ${reason}\n**Case ID:** ${id}`, color: "ff00f3", footer: {text: `Blacklisted`}, timestamp: Date.now()})
            logchannel.send(logembed)
            let blmongo = new blacklistmongo({user: mentionmember.id, type: typeofbl, blid: id, reason: reason, blacklisted: true})
            await blmongo.save();
            message.channel.send(`<a:checkmark:870842284202164244> ${mentionmember} has been blacklisted with the ID of \`${id}\`.`,{allowedMentions: {parse: []}})
           
            return;
        }else if(isblacklisted != null){
            const blid = isblacklisted.blid
            const query = {"blid": isblacklisted.blid};
// Set some fields in that document
const update = {
  "$set": {
    "blacklisted": false
  }
};
// Return the updated document instead of the original document
const options = { returnNewDocument: true };
   await blacklistmongo.findOneAndUpdate(query, update, options).then(async updatedDocument => {
       console.log(updatedDocument)
    if(updatedDocument) {
        const logembed = await MakeEmbed({title: `New Unblacklist`, description: `**User:** ${mentionmember}\n**Moderator:** ${message.member}\n**Reason:** ${reason}\n**Case ID:** ${isblacklisted.blid}`, color: "ff00f3", footer: {text: `Unblacklisted`}, timestamp: Date.now()})
        logchannel.send(logembed)
        message.channel.send(`<a:checkmark:870842284202164244> ${mentionmember} has been unblacklisted with the ID of \`${blid}\`.`,{allowedMentions: {parse: []}})
       
      
      console.log(`Successfully updated document: ${updatedDocument}.`)
    } else {
      message.channel.send(`Something went wrong! \`Cannot find document\``)
    }
    return updatedDocument
  })
  .catch(err => {console.error(`Failed to find and update document: ${err}`)})

        }
    }
}