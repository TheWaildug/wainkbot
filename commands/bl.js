const HasPermissions = require("../isbypass")
const blacklistmongo = require("../blacklistmongo")
const RandomString = require("randomstring")
const Discord = require("discord.js")
module.exports = {
    name: "bl",
    description: "Blacklists users from making suggestions, reports or, changing WainkBot's status",
  permissions: "<@&833021553935122432>.",
  arguments: "!bl (user) (type) (reason)",
    async execute(message,args,roles){
        
        if(!message.member.roles.cache.has("833021553935122432")){
            const embed = new Discord.MessageEmbed()
            .setDescription(`You do not have the correct permissions to run this command.`)
            .setColor("FF0000")
            message.channel.send(embed).then(msg => {
              msg.delete({timeout: 5000})
            })
            return message.delete();
        }
        if(!args[0]){
            return message.reply(`I need someone to blacklist.`);
        }
        let mentionmember = message.mentions.members.first() || await message.guild.members.fetch(args[0]).catch(e => console.log(e));
        if(!mentionmember || mentionmember.size > 1){
            return message.reply(`This is not a user!`)
        }
        let hasperm = await HasPermissions(roles,mentionmember)
        if(hasperm == true){
            return message.reply(`This user cannot be blacklisted.`)
        }
        if(!args[1]){
          return message.reply(`This isn't a blacklist type! You can choose from **status**, **suggestion**, or **report**.`);
        }
        let id = RandomString.generate({
          length: 20,
          charset: 'alphabetic'
        });
        let typeofbl = args[1].toLowerCase();
        if(typeofbl != "status" && typeofbl != "suggestion" && typeofbl != "report"){
          return message.reply(`This isn't a blacklist type! You can choose from **status**, **suggestion**, or **report**.`);
        }
        let isblacklisted = await blacklistmongo.findOne({user: mentionmember.id, type: typeofbl, blacklisted: true})
        console.log(isblacklisted)
        let reason
        if(isblacklisted == null){
             reason = args.splice(2).join(" ")
            if(reason == ""){
                return message.reply(`I need a reason.`)
            }
        }
       
        
        console.log(isblacklisted)
        if(isblacklisted != null){
           
const query = {"_id": isblacklisted.id};
// Set some fields in that document
const update = {
  "$set": {
    "blacklisted": false
  }
};
// Return the updated document instead of the original document
const options = { returnNewDocument: true };
   await blacklistmongo.findOneAndUpdate(query, update, options).then(updatedDocument => {
       console.log(updatedDocument)
    if(updatedDocument) {
        message.channel.send(`I have unblacklisted this user with the ID of \`${updateDocument.blid}\``)
      console.log(`Successfully updated document: ${updatedDocument}.`)
    } else {
      message.channel.send(`Something went wrong! \`Cannot find document\``)
    }
    return updatedDocument
  })
  .catch(err => {console.error(`Failed to find and update document: ${err}`); return message.channel.send(`Something went wrong! \`${err}\``)})


        }else{
          
            let blmongo = new blacklistmongo({user: mentionmember.id, type: typeofbl,  blid: id, moderator: message.member.id, reason: reason, blacklisted: true})
            message.channel.send(`I have blacklisted this user with the ID of \`${id}\`.`);
           await blmongo.save()
        }
       
    }
}