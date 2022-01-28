const fetch = require("node-fetch")
const Discord = require("discord.js")
const ms = require("ms")
const MakeEmbed = require("./makeembed")
const mutemongo = require("./mutemongo")
async function setData(member,time,reason,moderator,id,logurl){
  const unmutetime = Date.now() + time
  const ne = new mutemongo({
      userid: member.id,
      mutetime: time,
      reason: reason,
      moderator: moderator,
      logsurl: logurl,
      ismuted: true,
      unmutetimestamp: unmutetime,
      caseid: id
  })
  console.log(ne)
  await ne.save();
  return;
}
module.exports = async function(message,reason,time){
  const mutedrole = message.guild.roles.cache.get("826093027545710653")
  if(!mutedrole){
      const embed = await MakeEmbed({title: "Missing Role", description: `Cannot find the muted role.`, color: "RED"})
                  message.channel.send({embeds: [embed]})
                  
                  return;
  }
  if(mutedrole.position >= message.guild.me.roles.highest.position){
      const embed = await MakeEmbed({title: "Permission Denied", description: "The mute role is higher than me. Please move it below my role.", color: "RED"})
      message.channel.send({embeds: [embed]})
      return;
  }
  if(message.member.roles.cache.has(mutedrole)){
      const embed = await MakeEmbed({title: "Permission Denied", description: `This user is already muted.`, color: "RED"})
      message.channel.send({embeds: [embed]})
      return;
  }

  console.log(ms(time))
  console.log(reason)
  const unmutetime = Date.now() + ms(time);
  const channel = message.guild.channels.cache.get("825938877327998997")
  if(!channel){
      const embed = await MakeEmbed({title: "Missing Channel", description: `Cannot find the logs channel.`, color: "RED"})
      message.channel.send({embeds: [embed]})
      
      return;
  }

  message.member.roles.add(mutedrole).catch(async e => {
      console.log(e)
      const embed = await MakeEmbed({title: "Error", description: `Something went wrong! \`${e}\``, color: "RED"})
      message.channel.send({embeds: [embed]})
  }).then(async () => {
      const id = message.id
      const logembed = await MakeEmbed({title: "New Mute", description: `**User**\n${message.member}\n**Moderator**\n<@${message.client.user.id}>\n**Reason**\n${reason}\n**Length of Mute**\n${ms(ms(time,{long: true}))}\n**Case ID**\n${id}`, color: "ff00f3", footer: {text: "Unmute"}, timestamp: unmutetime})
      let logurl = await channel.send({embeds: [logembed]});
      logurl = logurl.url
      console.log(logurl)
      await setData(message.member,ms(time),reason,message.client.user.id,id,logurl)
           const dmembed = await MakeEmbed({title: `You've been auto muted in **${message.guild.name}**.`, description: `**Reason**\n${reason}\n**Length of Mute**\n${ms(ms(time,{long: true}))}\n**Case ID**\n${id}`,color: "ff00f3", footer: {text: "Unmute"}, timestamp: unmutetime})
      message.member.send({embeds: [dmembed]}).catch(console.log)
      let params = {
          "user": message.member.id,
          "reason": reason,
          "logsurl": logurl,
          "caseid": id,
          "mutetime": ms(time),
          "moderator": message.client.user.id
      }
      params = JSON.stringify(params)
      console.log(params)
      return fetch(process.env.mute, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: params
  }).then(console.log)
  })  
}