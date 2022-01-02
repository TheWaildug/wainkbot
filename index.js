const Discord = require("discord.js")
const client = new Discord.Client({allowedMentions: {
  // set repliedUser value to `false` to turn off the mention by default
  repliedUser: true
}});
client.setMaxListeners(100);
require("dotenv").config()
let prefix = "!"
require("./ExtendMessage")
const usersMap = new Map()
const hastebin = require("hastebin")
const discordInv = require('discord-inv');
const RandomString = require("randomstring")
const rslur = require("./values/rslurs")
const MakePaste = require("./makepaste")
const afkmongo = require("./afkmongo.js")
const fetch = require("node-fetch")
const checkforflags = require("./checkflags.js")
const blacklistmongo = require("./blacklistmongo")
const LeaveRoleSchema = require("./leaveroles")
const evalrole = require("./values/evalroles.js")
const asked = require("./values/whoasked.js")
const modroles = require("./values/roles.js")
const InformationSchema = require("./informationschema")
const snipemongo = require("./snipemongo")
const loadCommands = require("./commands/load-commands")
const filter = require('leo-profanity');
filter.clearList()
filter.add("wailboobisnoob")
client.on("ready", async () => {
    console.log("I'm ready, Aiden!");
   
    loadCommands(client)
   const data = await InformationSchema.findOne({active: true})
   if(data){
    const channel = client.channels.cache.get(data.channel);
  let Ping = ms(new Date().getTime() - data.currenttime,{long: true})
  channel.send(`Restarted in **${Ping}.**`)
  await InformationSchema.deleteMany();
   }
   
    if(client.user.id == "832740448909000755"){
      let status = await statuses.findOne({shuffle: false})
       
      if(status == null){
        status.status = "test."
      }
      client.user.setPresence({activity: {name: status.status, type: `WATCHING`}, status: "online"})
    }else{
      if(changestatus == true){

      
      let status = await statuses.find()
      allstatus = status
      UpdateStatus()
      }else if(changestatus == false){
        let status = await statuses.findOne({shuffle: false})
       
        if(status == null){
          status.status = "test."
        }
        client.user.setActivity(status.status, {
          type: "STREAMING",
          url: "https://www.twitch.tv/wainked"
        });
      }
    }
    
  });
const mongoose = require("mongoose")
const statuses = require("./statuses")
const muteuser = require("./automuteuser.js")
const MakeEmbed = require("./makeembed")
const automod = require("./automod")

const ms = require("ms")
let changestatus = false
const fs = require("fs")
const path = require("path")

let wainkedcolor = "ff00f3"
let allstatus = []


const mutemongo = require("./mutemongo")
async function getTimeZone(){
  const today = new Date();
  const short = today.toLocaleDateString(undefined);
  const full = today.toLocaleDateString(undefined, { timeZoneName: 'long' });

  // Trying to remove date from the string in a locale-agnostic way
  const shortIndex = full.indexOf(short);
  if (shortIndex >= 0) {
    const trimmed = full.substring(0, shortIndex) + full.substring(shortIndex + short.length);
    
    // by this time `trimmed` should be the timezone's name with some punctuation -
    // trim it from both sides
    return trimmed.replace(/^[\s,.\-:;]+|[\s,.\-:;]+$/g, '');

  } else {
    // in some magic case when short representation of date is not present in the long one, just return the long one as a fallback, since it should contain the timezone's name
    return full;
  }
}
async function setData(user,time,reason,mod){
    const ne = new mutemongo({
          userid: user,
          mutetime: time,
          reason: reason,
          moderator: mod,
          logsurl: "null",
          ismuted: true
        })
        console.log(`New Mute Data: ${user} ${time} ${reason} ${mod}`)
        console.log(ne)
        ne.save()
        return ne._id
  }
mongoose.connect(process.env.mongourl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
  autoIndex: false
}).then(() => console.log("Connected to MongoDB")).catch(error => {
  console.log(error)
})


  async function handlechannel(member,voiceState){
    console.log(`${member.id} created new VC.`)
    const channel = member.guild.channels.cache.get("850078357327970374");
    const newchannel = await member.guild.channels.create(`${member.displayName}\'s VC`,{type: "voice", userLimit: 2, parent: channel, reason: `${member.user.tag} went into the VC.`})
    voiceState.setChannel(newchannel,`${member.user.tag} went into the VC.`)
    client.on("voiceStateUpdate", async (oldState,newState) => {
      if(oldState.channelID == newState.channelID){
        return;
      }
      if(newState.guild.id != "813837609473933312"){
        return;
      }
      if(client.user.id == "832740448909000755"){
        if(newState.id != "432345618028036097" && newState.id != "7453y25943035396230" && newState.id != "737825820642639883"){
          return;
        }
      }
      if(oldState.channelID == newchannel.id && newState.channelID != newchannel.id && newState.member.id == member.id){
        console.log(`${member.id} left new VC.`)
        newchannel.delete()
      }
    })
  }
  client.on('raw', packet => {
    if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t)) return;
   const channel = client.channels.cache.get(packet.d.channel_id);
    if (channel.messages.cache.has(packet.d.message_id)) return;
    channel.messages.fetch(packet.d.message_id).then(message => {
        const emoji = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;
        const reaction = message.reactions.cache.get(emoji);
        if (reaction) reaction.users.cache.set(packet.d.user_id, client.users.cache.get(packet.d.user_id));
        /*if (packet.t === 'MESSAGE_REACTION_ADD') {
            client.emit('messageReactionAdd', reaction, client.users.cache.get(packet.d.user_id));
        }
        */
        if (packet.t === 'MESSAGE_REACTION_REMOVE') {
            client.emit('messageReactionRemove', reaction, client.users.cache.get(packet.d.user_id));
        }
    });
});
  client.on("rateLimit", async info => {
    const embed = new Discord.MessageEmbed()
    .setTitle(`Wainkbot Rate Limit`)
    .setDescription(`**Timeout:** ${info.timeout}ms\n**Limit:** ${info.limit}\n**Method:** ${info.method}\n**Path:** ${info.path}\n**Route:** ${info.route}`)
    .setColor(wainkedcolor)
    .setTimestamp()
    const params = {
      username: "Wainkbot Rate Limits",
      avatar_url: "",
      embeds: [embed
      ]
      
  }
  await   fetch(process.env.errorweb, {
    method: "POST",
    headers: {
        'Content-type': 'application/json'
    },
    body: JSON.stringify(params)
}).then(res => {
    console.log(res);
}) 
  })
  client.on("voiceStateUpdate", async (oldState,newState) => {
    if(oldState.channelID == newState.channelID){
      return;
    }
    if(newState.guild.id != "813837609473933312"){
      return;
    }
    if(client.user.id == "832740448909000755"){
     return;
    }
    if(newState.channelID == "850072327378960485" && oldState.channelID != "850072327378960485"){
      handlechannel(newState.member,newState)
    }
  })
  client.on("messageUpdate", async (oldmsg,message) => {
    if(message.guild == null){
      return;
    }
    if(message.guild.id != "813837609473933312"){
      return;
    }
    if(message.type != "DEFAULT"){
      return;
    }
    if(message.guild == null){
      return;
    }
    if(message.author.bot){
      return;
    }
    if(client.user.id == "832740448909000755"){
      if(message.author.id != "432345618028036097" && message.author.id != "745325943035396230" && message.author.id != "737825820642639883"){
        return;
      }
    }
    if(oldmsg.content == message.content){
      return;
    }
    
    
    console.log(oldmsg.content)
    console.log(message.content)
    try{
      
      await snipemongo.deleteMany({channel: message.channel.id, type: "edit" })
      const newsnipe = new snipemongo({channel: message.channel.id, type: "edit", oldcontent: oldmsg.content, content: message.content, link: message.url, author: message.author.id, timestamp: message.editedTimestamp})
      console.log(newsnipe)
      newsnipe.save()
    }catch(e){
      console.log(e)
    }
    const guild = await client.guilds.fetch("781292314856783892")
    const channel = await guild.channels.cache.get("847284615331708969")
    let embed = new Discord.MessageEmbed()
      .setTitle("New Message Edited")
      .setDescription(`**Author:** <@${message.author.id}>\n**Old Content:** ${oldmsg.content}\n**New Content:** ${message.content}\n**Channel:** <#${message.channel.id}>\n\n**[Jump to Message.](${message.url})**`)
      .setFooter(`Edited`)
      .setColor(wainkedcolor)
      .setTimestamp(Date.now())
    
   
    channel.send(embed)
  })
  client.on("guildMemberUpdate", async (oldmember,newmember) => {
    if(oldmember.bot || newmember.bot){
      return;
    }
    
    if(oldmember.displayName != newmember.displayName){
      if(newmember.displayName.toLowerCase() == "wainked"){
        console.log(`User has nickname of wainked.`)
        let hasperm = await HasPermissions(roles,newmember)
    console.log(hasperm)
    if(hasperm == true){
      console.log(`User has bypassed role.`)
      return;
    }
        const newnick = RandomString.generate({
          length: 7,
          charset: 'alphabetic'
        });
        console.log(newnick)
        
        newmember.setNickname(`Moderated Nickname ${newnick}`,`User had nickname of wainked.`).catch(e => {
          console.log(e)
        })
      }
    }
  })
  client.on("messageReactionRemove", async (reaction,user) => {
    if(reaction.message == null){
      return;
    }
    if(reaction.message.guild == null){
      return;
    }
    if(reaction.message.guild.id != "813837609473933312"){
      return;
    }
    if(reaction.message.type != "DEFAULT"){
      return;
    }
    if(user.bot){
      return;
    }
    if(client.user.id == "832740448909000755"){
      if(user.id != "432345618028036097" && user.id != "745325943035396230" && user.id != "737825820642639883"){
        return;
      }
    }
   
    try{
      await snipemongo.deleteMany({channel: reaction.message.channel.id, type: "reaction"})
      const newsnipe = new snipemongo({channel: reaction.message.channel.id, type: "reaction", link: reaction.message.url, content: reaction.emoji, author: user.id, timestamp: new Date().getTime()})
      console.log(newsnipe)
      newsnipe.save()
    }catch(e){
console.log(e)
    }
  })
  client.on("messageDelete", async message => {
    if(message.guild == null){
      return;

    }
    if(message.guild.id != "813837609473933312"){
      return;
    }
    if(message.type != "DEFAULT"){
      return;
    }
    if(message.guild == null){
      return;
    }
    if(message.author.bot){
      return;
    }
    if(client.user.id == "832740448909000755"){
      if(message.author.id != "432345618028036097" && message.author.id != "745325943035396230" && message.author.id != "737825820642639883"){
        return;
      }
    }
    try{
      
      await snipemongo.deleteMany({channel: message.channel.id, type: "delete"})
      const newsnipe = new snipemongo({channel: message.channel.id, type: "delete", link: message.url, content: message.content, author: message.author.id, timestamp: new Date().getTime()})
      console.log(newsnipe)
      newsnipe.save()
    }catch(e){
      console.log(e)
    }
    const guild = await client.guilds.fetch("781292314856783892")
    const channel = await guild.channels.cache.get("847284615331708969")
    let embed = new Discord.MessageEmbed()
      .setTitle("New Message Deleted")
      .setDescription(`**Author:** <@${message.author.id}>\n**Content:** ${message.content}\n**Channel:** <#${message.channel.id}>`)
      .setFooter(`Deleted`)
      .setColor(wainkedcolor)
      .setTimestamp(Date.now())
    
   
    channel.send(embed)
    console.log(`New Message Deleted: ${message.content}`)
    
  })
async function UpdateStatus(){
 

  
  let randomstatus = allstatus[Math.floor(Math.random() * allstatus.length)];
    client.user.setActivity(randomstatus.status, {
      type: "STREAMING",
      url: "https://www.twitch.tv/wainked"
    });
    setInterval(async () => {
 
      let randomstatus = allstatus[Math.floor(Math.random() * allstatus.length)];
     
      client.user.setActivity(randomstatus.status, {
        type: "STREAMING",
        url: "https://www.twitch.tv/wainked"
      });
    }, 20000)
} 
async function doeval(message,args){
  let code = args.join(' ');
		console.log(`Eval ${code}`)

	if (code == '') {
		return message.reply(`I need some code.`);
	}
	let ar = await checkforflags(args.join(' '), 'return');
	let returne;
	if (ar == null) {
		returne = false;
	} else if (ar != null) {
		code = ar;
		returne = true;
	}

	try {
		if (returne == false) {
			evaluated = await eval(`(async () => {  return ${code}})()`);
		} else {
			evaluated = await eval(`(async () => {  ${code}})()`);
		}
        const evalms = Date.now() - message.createdTimestamp;
		console.log(evaluated)
		const evaltype = typeof evaluated;
		let embed;
		const curdate = new Date().toLocaleString('en-us', {  weekday: 'long', day: "2-digit", year: "numeric", month: "long" })
    let curtime = new Date().toLocaleTimeString(`en-US`,{timeZoneName: "short", timeZone: "CST"}) 
    const newdate = `${curdate} ${curtime}`
    
		if (evaltype == 'object') {
			const url = await MakePaste(`//Evaluated ${newdate}\n\n${JSON.stringify(evaluated,null,2)}\n\n//This was auto-generated by WainkBot. If you have any issues, please DM TheWaildug.`,"js")
			const embed = new Discord.MessageEmbed()
				.setTitle(`Evaluation`)
				.setColor(`GREEN`)
				.setDescription(
					`Evaluated in *${evalms} ms.*`
				)
				.addField(`Input`, '```js\n' + code + '```')
				.addField(`Output`, `${url}`)
				.addField('Output Type', '`' + evaltype.toUpperCase() + '`');
                message.channel.send(embed);
                return;
		} else {
			embed = new Discord.MessageEmbed()
				.setTitle(`Evaluation`)
				.setColor('GREEN')
				.setDescription(
					`Evaluated in *${evalms} ms.*`
				)
				.addField(`Input`, '```js\n' + code + '```')
				.addField(`Output`, '```\n' + evaluated + '```')
				.addField('Output Type', '`' + evaltype.toUpperCase() + '`');
		}

        message.channel.send(embed);
	} catch (e) {
		console.log(e)
		const embed = new Discord.MessageEmbed()
			.setTitle(`Evaluation`)
			.setColor('RED')
			.setDescription(`Error`)
			.addField(`Input`, '```js\n' + code + '```')
			.addField(`Error`, '```' + e + '```');
		/*if (embed.length >= 6000) {
			const url = await MakePaste(error,"txt")
			embed = new Discord.MessageEmbed()
				.setTitle(`Evaluation`)
				.setColor('RED')
				.setDescription(`Error`)
				.addField(`Input`, '```js\n' + code + '```')
				.addField(`Error`, `${link}`)
				.setFooter(`The error exceeds the maximum size.`);
		}
    */
        message.channel.send(embed);
    }
   
}
client.on("error", console.log)
async function dmuser(user,info){
 user.send(``,{embed: info}) 
}
  async function enoughwarns(message){
    let requireddate = new Date().getTime() + ms("5 minutes")
    let allwarnings = await automod.find({userid: message.member.id})
    let newwarnings = []
    allwarnings.forEach(async warning => {
      console.log( new Date().getTime() >= warning.enddate)
      if(new Date().getTime() >= warning.endtime){
        await automod.deleteOne({_id: warning.id})
        
      }else{
        newwarnings.push(warning)
      }
    })
    console.log(newwarnings.length)
    if(newwarnings.length >= 3){
    
      console.log(`at least 3 warns in past 5 minutes.`)

      muteuser(message,`3 warns in the past 5 minutes.`,"1 hour")
    }
  }
  
  
  client.on("guildMemberRemove", async member => {
    if(client.user.id == "832740448909000755"){
      if(member.id != "432345618028036097" && member.id != "745325943035396230"){
        return;
      }
    }
    
      console.log(`${member.id} left the server :(.`)
      if(member.bot){
        return;
      }
      await LeaveRoleSchema.deleteMany(({userid: member.id}))
   let rolearray = []
     member.roles.cache.forEach(role => {if( !role.managed && role.name != "@everyone"){ rolearray.push(role);}})
  let roleschema = new LeaveRoleSchema({
    userid: member.id,
    roles: rolearray
  })
  await roleschema.save()
  })
 

   client.on("guildMemberAdd", async member => {

    if(client.user.id == "832740448909000755"){
      if(member.id != "432345618028036097" && member.id != "745325943035396230" && [member != "432345618028036097" && member != "745325943035396230"]){
        return;
      }
    }
  
    console.log(previous)
      if(previous == null){
        if(member.id == "745325943035396230"){
          const role = member.guild.roles.cache.get("832404582411927592")
          if(!role){
            console.log(`cannot find alt role.`)
          }else{
          member.roles.add(role,"User is stupid and fat.")
          }
        }

        /*const leaveroles = await LeaveRoleSchema.findOne({userid: member.id})
        if(leaveroles){
          
             console.log(leaveroles.roles)
        leaveroles.roles.forEach(rolei => {
          console.log(rolei)
          const role = member.guild.roles.cache.get(rolei)
          if(role){
            if(role.name != "@everyone"){
              member.roles.add(role,`User had this role before they left.`)
            }
          }
     
        })
      }*/
      }
      
   
      })
  ///Eval for thewaildug
  client.on("message", async message => {
    if(message.type != "DEFAULT"){
      return;
    }
    if(message.guild == null){
      return;
    }
    if(client.user.id == "832740448909000755"){
      prefix = "&"
    }
    if(!message.content.startsWith(prefix)){
      return;
    }
   
    if(message.author.bot){
      return;
    }

if(message.member.id != "432345618028036097"){
  return;
}
    const args = message.content.slice(prefix.length).split(" ")
    const command = args.shift().toLowerCase();
    if(command == "eval"){
      if(message.guild.id == "813837609473933312"){
        return;
      }
     doeval(message,args)
    }    
  })
  ///Remove AFK
  client.on("message", async message => {
   
    if(message.type != "DEFAULT"){
      return;
    }
    if(message.guild == null){
      return;
    }
    if(message.author.bot){
      return;
    }
    if(client.user.id == "832740448909000755"){
      if(message.author.id != "432345618028036097" && message.author.id != "745325943035396230" && message.author.id != "737825820642639883"){
        return;
      }
    }
    if(message.guild.id != "813837609473933312"){
      return;
    }
    let isafk = await afkmongo.findOne({userid: message.member.id})
      
        if(isafk != null){
          console.log(`removing afk`)
          
            message.channel.send(`Welcome back, ${message.member}! I've removed your AFK.`).then(msg => {
              setTimeout(() => {
                msg.delete();
              },10000)
            })
            message.member.setNickname(isafk.currentname,`Removal from AFK.`).catch(e => console.log(e))
            await afkmongo.deleteMany({userid: message.member.id})
          
        }
      if(message.mentions.members.first()){
        message.mentions.members.forEach(async user => {
          let isafk = await afkmongo.findOne({userid: user.id})
          if(isafk != null){
            let afkms =  new Date().getTime() - isafk.afkms
            message.reply(`${user} has been AFK with the reason **${isafk.afk}** for **${ms(afkms,{long: true})}**.`,{allowedMentions: {parse: [], users: [message.member.id]}})

          }
        })
      }
  })
  let limit = 5;
  let timeOut = 10000
  let difference = 3000
  /*Spam Filter
  client.on("message", async message => {
    if(message.type != "DEFAULT"){
      return;
    }
    if (message.guild == null) {
      return;
    }
    if (message.author.bot) {
      return;
    }
    if(message.guild.id != "813837609473933312"){
      return;
    }
   
    
    const warnemote = message.guild.emojis.cache.get("833398158616821840")
    if(HasPermissions(roles,message.member)){
      return;
    }
    if(!message.mentions.members.first()){
      return;
    }
    if(!message.mentions.members.has("432345618028036097")){
      return;
    }
    if(client.user.id == "832740448909000755"){
    
      if(message.member.id != "432345618028036097" && message.member.id != "745325943035396230"){
        return;
      }
    }
    if(usersMap.has(message.author.id)){
      let userData = usersMap.get(message.author.id)
      let { lastMessage, timer, pingCount } = userData
      const diff = message.createdTimestamp - lastMessage.createdTimestamp
      console.log(diff)
      console.log(pingCount)
      if(diff > difference){
    
        clearTimeout(timer)
        console.log(`Cleared Timeout`)
        userData.pingCount = 1;
        userData.lastMessage = message
        userData.timer = setTimeout(() => {
          usersMap.delete(message.author.id)
          console.log(`Removed from REEST`)
        }, timeOut);
        usersMap.set(message.author.id,userData)
      }else{

      
      pingCount++
      if(pingCount === limit){
        message.channel.send(`${warnemote} ${message.member}, You're not allowed to spam ping!`).then(msg => {
          setTimeout(() => {
            msg.delete();
          }, 5000)
        })
        let embedinfo = []
        embedinfo.title = "You're not allowed to do that!"
        embedinfo.color = wainkedcolor
        embedinfo.description = "You aren't allowed to spam ping other users."
        dmuser(message.member,embedinfo)
        usersMap.delete(message.author.id)
        let messages = await message.channel.messages.fetch()
        messages = messages.filter(m => m.author.id == message.author.id)
        let newmsg = []
        let msgsize = 0
        messages.forEach(msg => {
            if(msgsize > pingCount){
                return;
            }
            newmsg.push(msg);
            msgsize++
        })
        messages = newmsg
        message.channel.bulkDelete(messages).catch(e => {
          console.log(e)
        })
        let warn = new automod({userid: message.member.id, reason: `Spam Ping.`, timestamp:  new Date().getTime(), endtime:  new Date().getTime() + ms("24 hours")})
     await warn.save()
      enoughwarns(message)
      
      }else{
       
        userData.pingCount = pingCount
        usersMap.set(message.author.id, userData)
      }
    }
    }else {
     
     let fn = setTimeout(() => {
        usersMap.delete(message.author.id)
        console.log(`Removed from the map.`)
      }, timeOut);
      usersMap.set(message.author.id, {
        pingCount: 1,
        lastMessage: message,
        timer: fn
      })
    }
  })
  */
  ///Automod
  client.on("message",async message => {
    if(message.type != "DEFAULT"){
      return;
    }
    if (message.guild == null) {
      return;
    }
    if (message.author.bot) {
      return;
    }
    if(message.guild.id != "813837609473933312"){
      return;
    }
    
    const warnemote = message.guild.emojis.cache.get("833398158616821840")
    let args = message.content.split(" ")
    if(HasPermissions(roles,message.member)){
      return;
    }
    if(client.user.id == "832740448909000755"){
    
      if(message.member.id != "432345618028036097" && message.member.id != "745325943035396230"){
        return;
      }
    }
    //test
    
    /* if(filter.check(message.content)){
        message.delete()
        message.channel.send(`dude don't say that!`)
         muteuser(message,`(AUTOMOD) boobies.`,"5 seconds")
      
        
       }*/
       
   
  let regxinvite = /discord.gg\/\w*\d*/
let cdu = regxinvite.test(message.content.toLowerCase().replace(/\s+/g, ''))
if(cdu == true){
  let cont = await HasPermissions(roles,message.member)
  console.log(cont)
  if(cont == true || message.member.id == "432345618028036097"){
    return console.log(`User is bypass.`)
  }
  if(message.channel.id == "831176865595129888"  || message.channel.id == "831175761137631273"){
    return message.reply(`In a whitelisted channel.`)
  } 
  let inv = message.content.search("discord.gg/");
  let e = message.content.split("").slice(inv).join("").split(" ").join(" ")
  console.log(e)
  let e2 = e.search(`discord.gg/`)
  console.log(e2)
  let e3 = e.split(" ").slice(e2)
console.log(e3)
  discordInv.getInv(discordInv.getCodeFromUrl(e3[0])).then(async invite => {
    console.log(invite)
    console.log(`${message.member.id} posted an invite to the server ${invite.guild.name}`)
    message.channel.send(`${warnemote} ${message.member}, You're not allowed to post invites in this channel!`).then(msg => {
      setTimeout(() => {
        msg.delete();
      }, 5000)
    })
    let embedinfo = []
    embedinfo.title = "You're not allowed to do that!"
    embedinfo.color = wainkedcolor
    embedinfo.description = "You aren't allowed to post invites in that channel. The only channels that you can post invites in are <#831176865595129888> and <#831175761137631273>."
    dmuser(message.member,embedinfo)
    message.delete().catch((e) => console.log(e))
    if(client.user.id == "12345"){
      return;
    }else{
    let warn = new automod({userid: message.member.id, reason: `Posting Invites.`, timestamp:  new Date().getTime(), endtime:  new Date().getTime() + ms("24 hours")})
 await warn.save()
  enoughwarns(message)
    }
}).catch(() => {console.log('This is not a valid invite')})
 
}
    
  })

  ///DMs
  client.on("message", async message => {
    if(message.type != "DEFAULT"){
      return;
    }
    if(message.guild != null){
      return
    }
    if(message.author.bot){
      return;
    }
    if(client.user.id == "832740448909000755"){
      if(message.author.id != "432345618028036097" && message.author.id != "745325943035396230"){
        return;
      }
    }
    const log = message.client.channels.cache.get("862715876633739304")
        if(!log){
            return console.log(`Cannot find dm log channel.`);
        }
    if(!message.content){
      return;
    }  
    const logembed = await MakeEmbed({title: `New DM Received`, description: `**User: ** ${message.author}\n**Message: **${message.content}\n**URL: **${message.url}`, timestamp: Date.now()})
    log.send(logembed)
  })
  client.on("raw", async packet => {
     
  })
 
  ///Custom Messagse
  client.on("message", async message => {
    if(message.type != "DEFAULT"){
      return;
    }
   
    
    let args = message.content.split(" ")
     if(client.user.id == "832740448909000755"){
       
        if(message.author.id != "432345618028036097" && message.author.id != "745325943035396230" && message.author.id != "737825820642639883"){
          return;
        }
      }
      if(message.mentions.members.has(client.user.id)){
        const reference = message.reference
        if(reference){
          const referenceID = reference.messageID
          if(referenceID){
          const msg = await message.channel.messages.fetch(referenceID)
          if(msg){
            if(msg.author.id != client.user.id){
              message.inlineReply("WAT")
            }
          }
        }
        }else{
          message.inlineReply("WAT")
        }
       
      }
      if(message.content.toLowerCase().includes("pls rob") && (message.channel.id == "832040924267806750" || message.channel.id == "818890024178155603")){
        const embed = await MakeEmbed({title: "Robbing is Disabled!", description: "In order to prevent users from leaving the server, robbing is disabled on this server! It will not be enabled so don't ask.", color: "ff00f3"})
        message.channel.send(embed) 
      }
    for(let i = 0; i < args.length; i++){
      const newargs = args[i].toLowerCase().replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
      if(newargs == "ok"){
        message.react("🆗")
      }
     
      if(newargs == "aiden"){
        if(message.author.bot){
          return;
        }
        message.channel.send(
          "Did someone say **Aiden**? I'm pretty sure that's what I heard!"
        );
      }
      if(newargs == "ansh"){
        //Submitted by 717149032753004625
        if(message.author.bot){
          return;
        }
        message.channel.send("He Are Say Ok")
      }
      
      if(newargs == "cheeto" || newargs == "esrom"){
        // Submitted by 670492259560718356  
        if(message.author.bot){
          return;
        }
        message.react("<:amswag:826864279696179200>")
      }
      if(newargs == "waildug"){
        if(message.author.bot){
          return;
        }
        message.channel.send(`You mean that annoying person <@432345618028036097>?`,{allowedMentions: {parse: []}})
      }
      if(newargs == "wainked"){
        if(message.author.bot){
          return;
        }
        const embed = new Discord.MessageEmbed()
        .setDescription("**He is pro.**")
        .setColor("#ff00f3");
      message.channel.send(embed)
      
      }
    }
    
    const newmessage = message.content.toLowerCase().replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
    if(newmessage.includes("i am pro")){
      //Submitted by 718778492866789437
      if(message.author.bot){
        return;
      }
      message.channel.send(`No, lol`)
    }
    for(let i = 0; i < asked.length; i++){
      if(message.author.bot){
        return;
      }
      if(newmessage.includes(asked[i])){
        return message.channel.send(`${message.author}`,{files: ["https://cdn.discordapp.com/attachments/804002610624331796/848619408926310400/i_asked.mp4"]})
      }
    }
  });
  const HasPermissions = require("./isbypass")
  client.on("message", async message => {
    if(message.type != "DEFAULT"){
      return;
    }
    if(message.guild == null){
        return;
      }
      if(message.guild.id != "813837609473933312"){
        return;
      }
      if(client.user.id == "832740448909000755"){
        if(message.author.id != "432345618028036097" && message.author.id != "745325943035396230" && message.author.id != "737825820642639883"){
          return;
        }
      }
      if(client.user.id == "832740448909000755"){
        prefix = "&"
      }
      if(!message.content.startsWith(prefix)){
        return;
      }
      if(message.author.bot){
          return;
        }
      const args = message.content.slice(prefix.length).split(" ")
      const command = args.shift().toLowerCase();
      if(command == "eval"){
        let cont = await HasPermissions(evalrole,message.member)
       console.log(cont)
        if(cont == false && message.member.id != "432345618028036097"){
          const embed = new Discord.MessageEmbed()
          .setDescription(`You do not have the correct permissions to run this command.`)
          .setColor("FF0000")
          message.channel.send(embed).then(msg => {
            msg.delete({timeout: 5000})
          })
          return message.delete();
        }
        doeval(message,args)
  
          
      
      }
  })

  
const roles = require("./values/roles.js");
const pingroles = require("./values/pingroles");
const express = require("express");
  const server = express()
  server.listen(3000, ()=>{console.log("Server is Ready!")}); 
  server.all('/', (req, res)=>{
    res.send('wainked is meanie')
})
client.login(process.env.token)
