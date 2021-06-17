
const WarningSchema = require("../warningmongo")
const HasPermissions = require("../isbypass")
const RandomString = require("randomstring")
async function setData(user,warning,mod,url,id){
  const ne = new WarningSchema({
        userid: user,
        warning: warning,
        moderator: mod,
        logsid: url,
        timestamp: new Date().getTime(),
        warningid: id
      })
      console.log(`New Warn Data: ${user} ${warning} ${mod} ${url} ${id}`)
      ne.save()
      console.log(ne)
      return ne._id
}
const Discord = require("discord.js")

module.exports = {
  name: "warn",
  description: "Warns users.",
  permissions: "Staff Member.",
  arguments: "!warn (user) (reason)",
 async execute(message,args,roles) {
    let hasperm = await HasPermissions(roles,message.member)
    console.log(hasperm)
    if(hasperm == false){
        const embed = new Discord.MessageEmbed()
        .setDescription(`You do not have the correct permissions to run this command.`)
        .setColor("FF0000")
        message.channel.send(embed).then(msg => {
          msg.delete({timeout: 5000})
        })
        return message.delete();
    }
  let mentionmember;
  //If user dont mention a member, that show him this error msg
  if (message.mentions.members.first()) {
    mentionmember = message.mentions.members.first();
  } else if (!message.mentions.members.first()) {
    console.log(args[0]);
    mentionmember = await message.guild.members.fetch(args[0]).catch(e => {
        console.loG(e)
    })
  }
  if(!mentionmember || mentionmember.size > 1){
    return message.channel.send(`${message.member}, this is not a user.`);
}
  if(mentionmember.user.bot){
    return message.reply(`You cannot warn a bot.`)
  }
 if (
    mentionmember.roles.highest.position >= message.member.roles.highest.position
  ) {
    console.log("higher");
    return message.reply("This user has an equal or higher role.");
  }
  
   let reason = message.content.split(" ").splice(2).join(" ")
        console.log(reason)
        if(!reason){
            return message.reply(`I need a reason.`)
        }
        let id = RandomString.generate({
          length: 20,
          charset: 'alphabetic'
        });
  
   
    const embed2 = new Discord.MessageEmbed()
    .setDescription(`${mentionmember} has been **warned** with the ID of` + "`" + id + "`." + `${mentionmember}, please check your DMs.`)
      .setColor('#ff00f3');
    const cannotembed = new Discord.MessageEmbed()
    .setDescription(`${mentionmember} has been **warned** with the ID of` + "`" + id + "`." + ` I could not send a DM ${mentionmember}.`)
      .setColor('#ff00f3');
    const warnembed = new Discord.MessageEmbed()
    .setTitle(`You've been warned in ${message.guild.name}.`)
    .addField(`Reason`,reason)
      .setColor('#ff00f3')
    .addField(`Moderator`,message.author.tag)
    .addField(`Warn ID`,id)
    .setTimestamp();
    let candm = true
      const exampleEmbed = new Discord.MessageEmbed()
            .setColor('#FF0000')
            .setTitle('Moderation')
            .setDescription("New Warn!")
            .addFields(
                { name: 'Offender', value: `<@${mentionmember.id}>` },
                { name: "Sender:", value: `<@${message.member.id}>` },
                { name: 'Reason: ', value: `${args[1]}`},{
                  name: `Case ID`, value: `${id}`
                }   
            )
            .setTimestamp()
            .setColor('ff00f3');

    const channel = message.guild.channels.cache.find(channel => channel.id == "825938877327998997")
            if(channel){
            channel.send(exampleEmbed).then(async msg => {
                await setData(mentionmember.id,reason,message.member.id,msg.id,id)
            })

            }
    mentionmember.send(warnembed).catch(() => {
      message.channel.send(cannotembed)
      console.log(`Cannot DM ${mentionmember.id}`)
      candm = false
        return message.delete();
    
    }).then(() => {
        if(candm == true){
      message.channel.send(embed2)
        return message.delete();
    
    } 
    
    })

  }
}