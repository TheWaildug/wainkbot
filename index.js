const Discord = require("discord.js")
const client = new Discord.Client({ ws: { properties: { $browser: "Discord iOS" }} });
require("dotenv").config()
let prefix = "!"
const rslur = require("./values/rslurs")
const afkmongo = require("./afkmongo.js")
const blacklistmongo = require("./blacklistmongo")
const evalrole = require("./values/evalroles.js")
const modroles = require("./values/roles.js")
const mongoose = require("mongoose")
const statuses = require("./statuses")
const muteuser = require("./muteuser.js")
const automod = require("./automod")
const rules = require("./values/rules")
const ms = require("ms")
let changestatus = false
const fs = require("fs")
let wainkedcolor = "ff00f3"
let allstatus = []

const allcooldown = new Set();
const mutemongo = require("./mutemongo")
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
  useCreateIndex: true
}).then(() => console.log("Connected to MongoDB")).catch(error => {
  console.log(error)
})
client.Commands = new Discord.Collection();

  const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.Commands.set(command.name, command);
  }
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
async function doeval(message){
  let code = message.content.split(" ").slice(1).join(" ")
  console.log(`Eval ${code}`)
 
     console.log(`Evaluate ${message.author.id}`)
     if(code == ""){
         return message.channel.send(`I need some code dude.`)
     }
     let evaluated = ""
     if(code.toLowerCase().includes("process.env.token")){
      evaluated = "lol no you're not going to get the token."
   }else if(code.toLowerCase().includes("process.exit()")){
     evaluated = "lol no you're not going to restart the bot."
  }else if(code.toLowerCase().includes("client.destroy()")){
   evaluated = "lol no you're not going to destroy the bot."
}
   try {
     if(evaluated == ""){
      evaluated = await eval(`(async () => {  ${code}})()`);
     
     }
    
     console.log(evaluated)
     const evaltype = typeof evaluated;
     const embed = new Discord.MessageEmbed()
           .setTitle(`Evaluation`)
           .setColor("RANDOM")
           .setDescription(`Evaluated in *${Date.now() - message.createdTimestamp + " ms"}.*`)
           .addField(`Input`,"```js\n" + code + "```")
           .addField(`Output`,"```\n" + evaluated + "```")
           .addField("Output Type", "`" + evaltype.toUpperCase() + "`")
           .setTimestamp()
            message.channel.send(`<@${message.author.id}>`,embed)
         
   } catch (e) {
     console.log(e)
         const embed = new Discord.MessageEmbed()
         .setTitle(`Evaluation`)
             .setColor("RANDOM")
         .setDescription(`Error`)
         .addField(`Input`,"```js\n" + code + "```")
         .addField(`Error`,"```" + e + "```")
         .setTimestamp()
          message.channel.send(`<@${message.author.id}>`,embed)
   }   
}
async function dmuser(user,info){
 user.send(``,{embed: info}) 
}
  async function enoughwarns(message){
    let requireddate = Date.now() + ms("5 minutes")
    let allwarnings = await automod.find({userid: message.member.id})
    let newwarnings = []
    allwarnings.forEach(async warning => {
      console.log(Date.now() >= warning.enddate)
      if(Date.now() >= warning.endtime){
        await automod.deleteOne({_id: warning.id})
        
      }else{
        newwarnings.push(warning)
      }
    })
    console.log(newwarnings.length)
    if(newwarnings.length >= 3){
    
      console.log(`at least 3 warns in past 5 minutes.`)

      muteuser(message,`(AUTOMOD) 3 warns in the past 5 minutes.`,ms("1 hour"))
    }
  }
client.on("ready", async () => {
    console.log("I'm ready, Aiden!");
    if(client.user.id == "832740448909000755"){
      client.user.setStatus("invisible")  
      client.user.setPresence({activity: {name: "new features for wainkbot.", type: `WATCHING`}, status: "online"})
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
  client.on("guildMemberAdd", async member => {
    if(client.user.id != "832740448909000755"){
      console.log(`${member.id}`)
      if(member.id == "745325943035396230"){
        const role = member.guild.roles.cache.get("832404582411927592")
        if(!role){
          return console.log(`cannot find alt role.`)
        }
        member.roles.add(role,"User is stupid and fat.")
      }else{
      
        const embed = new Discord.MessageEmbed()
        .setTitle(`Welcome!`)
        .setDescription(`${member} just hopped in!`)
        .setColor("ff00f3")
        .setTimestamp()
        let channel = member.guild.channels.cache.get("816863447156523028");
        if(!channel){
          return console.log(`cannot find channel.`)
        }
        channel.send(embed)
      }
    }else{
      if(member.id == "432345618028036097"){
        const embed = new Discord.MessageEmbed()
        .setTitle(`Welcome!`)
        .setDescription(`${member} just hopped in!`)
        .setColor("ff00f3")
        .setTimestamp()
        let channel = member.guild.channels.cache.get("816863447156523028");
        if(!channel){
          return console.log(`cannot find channel.`)
        }
        channel.send(embed)
      }
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
if(message.guild.id == "813837609473933312"){
  return;
}
if(message.member.id != "432345618028036097"){
  return;
}
    const args = message.content.slice(prefix.length).split(" ")
    const command = args.shift().toLowerCase();
    if(command == "eval"){
     doeval(message)
    }else if(command == "ping"){
      let yourping = new Date().getTime() - message.createdTimestamp 
      let botping = Math.round(client.ws.ping)
      const embed = new Discord.MessageEmbed()
      .setTitle(`Pong!`)
      .setDescription(`Message Ping: ${yourping}\nAPI Ping: ${botping}`)
      .setColor(`ff00f3`)
      message.channel.send(embed)
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
      if(message.member.id != "432345618028036097" && message.member.id != "745325943035396230"){
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
            let afkms = Date.now() - isafk.afkms
            message.reply(`${user} has been AFK with the reason **${isafk.afk}** for **${ms(afkms,{long: true})}**.`,{allowedMentions: {parse: [], users: [message.member.id]}})

          }
        })
      }
  })
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
    let usertoping = "737825820642639883"
    if(client.user.id == "832740448909000755"){
      usertoping = "432345618028036097"
      if(message.member.id != "432345618028036097" && message.member.id != "745325943035396230"){
        return;
      }
    }
    for(let i = 0; i < rslur.length; i++){
   if(message.content.includes(rslur[i])){
      let cont = await HasPermissions(pingroles,message.member)
      console.log(cont)
      if(cont == true || message.member.id == "432345618028036097"){
        return console.log(`User is bypass.`)
      }
      console.log(`${message.member.id} just said a racial slur.`)
      message.channel.send(`${warnemote} ${message.member}, You're not allowed to use racial slurs.`).then(msg => {
        setTimeout(() =>{
          msg.delete();
        },5000)
      })
      let embedinfo = []
      embedinfo.title = `You're not allowed to do that!`
      embedinfo.color = wainkedcolor
      embedinfo.description = `You're not allowed to use racial slurs.`
      dmuser(message.member,embedinfo)
      message.delete();
      muteuser(message,`(AUTOMOD) Use of racial slurs.`,ms("1 hour"))
      return;
    }
  }
    if(message.mentions.members.has(usertoping)){
      let cont = await HasPermissions(pingroles,message.member)
      console.log(cont)
      if(cont == true || message.member.id == "432345618028036097"){
        return console.log(`User is bypass.`)
      }
      console.log(`${message.member.id} pinged wainked.`)
      message.channel.send(`${warnemote} ${message.member}, You're not allowed to ping wainked!`).then(msg => {
        setTimeout(() => {
          msg.delete();
        }, 5000)
      })
      let embedinfo = []
      embedinfo.title = "You're not allowed to do that!"
      embedinfo.color = wainkedcolor
      embedinfo.description = "You aren't allowed to ping **wainked.** If you'd like to contact him, try visiting our website [here](https://bit.ly/wainkedd)."
      dmuser(message.member,embedinfo)
      message.delete()
      if(client.user.id == "12345"){
        return;
      }else{
      let warn = new automod({userid: message.member.id, reason: `Pinging wainked.`, timestamp: Date.now(), endtime: Date.now() + ms("24 hours")})
   await warn.save()
    enoughwarns(message)
      }
  }
  })

  ///Modmail
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
  })
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
    
    let args = message.content.split(" ")
    if(client.user.id == "832740448909000755"){
      if(message.member.id != "432345618028036097" && message.member.id != "745325943035396230"){
        return;
      }
    }
    for(let i = 0; i < args.length; i++){
      if(args[i].toLowerCase() == "ok"){
        message.react("🆗")
      }
      if(args[i].toLowerCase() == "aiden"){
        return message.channel.send(
          "Did someone say **Aiden**? I'm pretty sure that's what I heard!"
        );
      }
      if(args[i].toLowerCase() == "wainked"){
        const embed = new Discord.MessageEmbed()
        .setDescription("**Creating viruses...**")
        .setColor("#ff00f3");
      message.channel.send(embed)
      
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
        if(message.author.id != "432345618028036097" && message.author.id != "745325943035396230"){
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
        doeval(message)
  
          
      
      }else if(command == "bl"){
        client.Commands.get("blacklist").execute(message,args,roles)
      }else if(command == "deny"){
        client.Commands.get("deny").execute(message,args,roles)
      }else if(command == "accept"){
        client.Commands.get("accept").execute(message,args,roles)
      }else if(command == "suggest"){
        client.Commands.get("suggest").execute(message,args,roles)
      }else if(command == "rule"){
        let cont = await HasPermissions(roles,message.member)
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
         const rule = args[0]
         let tablerule = Number(args[0]) - 1
         if(tablerule > rules.length - 1){
           return message.reply(`This is not a rule!`)
         }
         if(tablerule < 0){
           return message.reply(`This is not a rule!`)
         }
         let getrule = rules[tablerule]
         const embed = new Discord.MessageEmbed()
         .setTitle(`Rule #**${rule}**`)
         .setDescription(getrule)
         .setColor(wainkedcolor)
         message.channel.send(embed)
      }else if(command == "ping"){
        let yourping = new Date().getTime() - message.createdTimestamp 
        let botping = Math.round(client.ws.ping)
        const embed = new Discord.MessageEmbed()
        .setTitle(`Pong!`)
        .setDescription(`Message Ping: ${yourping}\nAPI Ping: ${botping}`)
        .setColor(`ff00f3`)
        message.channel.send(embed)
      }else if(command == "afk"){
        client.Commands.get("afk").execute(message,args)
      }else if(command == "status"){
        if(message.guild.me.id == "832740448909000755"){
          return message.reply(`Please use this on the regular wainkbot.`)
        }
        let isblacklisted = await blacklistmongo.findOne({user: message.member.id, type: "status", blacklisted: true})
        console.log(isblacklisted)
        if(isblacklisted != null){
          return message.reply(`You have been blacklisted from changing my ststus.`)
        }
        let status = message.cleanContent.split(" ").splice(1).join(" ")
        if(!status){
          return message.reply(`I need a status!`)
        }
        if(changestatus == true){
          message.reply(`I have added this status to the pool.`)
        let statusm = new statuses({status: status, user: message.member.id, shuffle: true})
        await statusm.save()
        let allstat = await statuses.find()
        allstatus = allstat
        }else if(changestatus == false){
          await statuses.deleteMany({shuffle: false})
          let statusm = new statuses({status: status, user: message.member.id, shuffle: false})
          await statusm.save()
          client.user.setActivity(status, {
            type: "STREAMING",
            url: "https://www.twitch.tv/wainked"
          });
          return message.reply(`go check it out noob.`)
        }
        
      }else if(command == "say"){
        let cont = await HasPermissions(roles,message.member)
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
        let mentionchannel
        let switchargs = false
        if(message.mentions.channels.first()){
          mentionchannel = message.mentions.channels.first()
        }else if(!isNaN(args[0])){
          mentionchannel = message.guild.channels.cache.get(args[0])
        }else{
          mentionchannel = message.channel
          switchargs = true
        }
        if(!mentionchannel){
          switchargs = true
          mentionchannel = message.channel
        }
        console.log(mentionchannel.name)
        let msg = ""
        if(switchargs == false){
          msg = args.splice(1).join(" ")
        }else if(switchargs == true){
          msg = args.join(" ")
        }
        console.log(msg)
        if(msg == ""){
          return message.reply(`I can't say nothing!`)
        }
        mentionchannel.send(msg).catch(e => {return message.reply(`${e}`)})
        message.delete()
      }else if(command == "mute"){
        client.Commands.get("mute").execute(message,args,modroles)
      }else if(command == "kick"){
        client.Commands.get("kick").execute(message,args,modroles)
      }
  })

  const express = require("express");
const roles = require("./values/roles.js");
const pingroles = require("./values/pingroles")
const blacklist = require("./commands/blacklist.js");
const mute = require("./commands/mute.js");
  const server = express()
  server.listen(3000, ()=>{console.log("Server is Ready!")}); 
  server.all('/', (req, res)=>{
    res.send('wainked is meanie')
})
client.login(process.env.token)