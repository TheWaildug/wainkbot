const Discord = require("discord.js")
const client = new Discord.Client();

require("dotenv").config()
let prefix = "!"
const discordInv = require('discord-inv');

const rslur = require("./values/rslurs")
const afkmongo = require("./afkmongo.js")
const blacklistmongo = require("./blacklistmongo")
const LeaveRoleSchema = require("./leaveroles")
const evalrole = require("./values/evalroles.js")
const modroles = require("./values/roles.js")
const snipemongo = require("./snipemongo")
if(1+1 == 3){
  const GphApiClient = require("giphy-js-sdk-core");
  const giphy = GphApiClient(process.env.GIPHYTOKEN);
}

const mongoose = require("mongoose")
const statuses = require("./statuses")
const muteuser = require("./muteuser.js")
const froggif = require("./frogifs")
const automod = require("./automod")
const rules = require("./values/rules")
const ms = require("ms")
let changestatus = false
const fs = require("fs")
let wainkedcolor = "ff00f3"
let allstatus = []


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
      const newsnipe = new snipemongo({channel: message.channel.id, type: "delete", content: message.content, author: message.author.id, timestamp: new Date().getTime()})
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
  let code = args.join(" ")
  console.log(`Eval ${code}`)
 
     console.log(`Evaluate ${message.author.id}`)
     
  
     if(code == ""){
         return message.reply(`I need some code.`)
     }
     let returne = false
     if(code.includes("--return")){
         let ar = code.split(" --return").join("")
         console.log(ar)
         code = `${ar}`
         returne = true
     }else if(code.includes("-return")){
         let ar = code.split(" -return").join("")
         console.log(ar)
         code = `${ar}`
         returne = true
     }
     try {
         if(returne == false){
             evaluated = await eval(`(async () => {  return ${code}})()`);
         }else{
             evaluated = await eval(`(async () => {  ${code}})()`);
         }
       
         console.log(evaluated)
         const evaltype = typeof evaluated;
         const embed = new Discord.MessageEmbed()
               .setTitle(`Evaluation`)
               .setColor("GREEN")
               .setDescription(`Evaluated in *${new Date().getTime() - message.createdTimestamp} ms.*`)
               .addField(`Input`,"```js\n" + code + "```")
               .addField(`Output`,"```\n" + evaluated + "```")
               .addField("Output Type", "`" + evaltype.toUpperCase() + "`")
                message.channel.send(`<@${message.author.id}>`,embed)
           
           
       } catch (e) {
         console.log(e)
             const embed = new Discord.MessageEmbed()
             .setTitle(`Evaluation`)
                 .setColor("RED")
             .setDescription(`Error`)
             .addField(`Input`,"```js\n" + code + "```")
             .addField(`Error`,"```" + e + "```")
           
              message.channel.send(`<@${message.author.id}>`,embed)
              
       }
   
}
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
      if(member.id != "432345618028036097" && member.id != "745325943035396230"){
        return;
      }
    }
      console.log(`${member.id}`)
      if(member.id == "745325943035396230"){
        const role = member.guild.roles.cache.get("832404582411927592")
        if(!role){
          console.log(`cannot find alt role.`)
        }else{
        member.roles.add(role,"User is stupid and fat.")
        }
      }
      const leaveroles = await LeaveRoleSchema.findOne({userid: member.id})
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
    }
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
     doeval(message,args)
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
    let brek = false
    for(let i = 0; i < args.length; i++){
      if(brek == true){
        return;
      }
      for(let e = 0; e < rslur.length; e++){
        if(brek == true){
          return;
        }
        if(args[i].toLowerCase() == rslur[e]){
          if(brek == true){
            return;
          }
          console.log(brek)
           let cont = await HasPermissions(roles,message.member)
           console.log(cont)
           if(cont == true || message.member.id == "432345618028036097"){
             return console.log(`User is bypass.`)
           }
           console.log(rslur[e])
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
           brek = true
           break;
         }
       }
    }
   
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
      let warn = new automod({userid: message.member.id, reason: `Pinging wainked.`, timestamp:  new Date().getTime(), endtime:  new Date().getTime() + ms("24 hours")})
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
  ///Custom Messagse
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
        if(message.author.id != "432345618028036097" && message.author.id != "745325943035396230" && message.member.id != "737825820642639883"){
          return;
        }
      }
    for(let i = 0; i < args.length; i++){
      if(args[i].toLowerCase() == "ok"){
        message.react("🆗")
      }
      if(args[i].toLowerCase() == "aiden"){
        message.channel.send(
          "Did someone say **Aiden**? I'm pretty sure that's what I heard!"
        );
      }
      if(args[i].toLowerCase() == "waildug"){
        message.channel.send(`You mean that annoying person <@432345618028036097>?`,{allowedMentions: {parse: []}})
      }
      if(args[i].toLowerCase() == "wainked"){
        const embed = new Discord.MessageEmbed()
        .setDescription("**He is pro.**")
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
  
          
      
      }else if(command == "chain"){
        const isbypass = await HasPermissions(roles,message.member)
        if(isbypass == false){
          return message.delete();
        }
        if(message.channel.id != "830510753155907584"){
          return message.reply(`Run this in the <#830510753155907584> channel idiot.`)
        }
        let chainmsg = args.join(" ")
        if(!chainmsg){
          return message.reply(`I need something to chain idiot.`)
        }
        console.log(`chain ${chainmsg}`)
        const channel = message.guild.channels.cache.get("830510753155907584")
        channel.send(chainmsg,{allowedMentions: {parse: []}}).catch(e => {
          console.log(e);
        })
        message.delete();
       
      }else if(command == "frog"){
        let randomFrog = froggif[Math.floor(Math.random() * froggif.length)];
        console.log(randomFrog)
        return message.channel.send(randomFrog)
      }else if(command == "ban"){
        client.Commands.get("ban").execute(message,args,roles,client)
      }else if(command == "getserver"){
        if(message.member.id != "432345618028036097"){
          return message.reply(`I'm sorry bro but you can't do this.`);
        }
        const invitelink = args[0]
        if(!invitelink){
          return message.reply("I need an invite.")
        }
        let invite = await discordInv.getInv(discordInv.getCodeFromUrl(invitelink)).catch(e => console.log(e))
        console.log(invite)
        if(!invite){
          return message.reply(`This isn't a valid invite.`);
        }
          const format = `Here is the information for \`${invitelink}\`. Name: \`${invite.guild.name}\``
       console.log(format)
       console.log(format)
       return message.channel.send(format)
      }else if(command == "roleleaderboard"){
        console.log(`role leaderboard ${message.member.id}`)
  
   message.reply(`Let me find the top 5 role leaders...`).then(me => {
     message.channel.startTyping()
     let list = message.guild.members.cache.sort((e,ee) => ee.roles.cache.size - e.roles.cache.size).array()
   let user1 = message.guild.members.cache.find(u => u.id == list[0].id)
     let user2 = message.guild.members.cache.find(u => u.id == list[1].id)
      let user3 = message.guild.members.cache.find(u => u.id == list[2].id)
      let user4 = message.guild.members.cache.find(u => u.id == list[3].id)
      let user5 = message.guild.members.cache.find(u => u.id == list[4].id)
    const format = `Here are the top 5 users: \n1. <@${user1.id}> - Roles: ${user1.roles.cache.filter(r => r.name != "@everyone").size}.\n2. <@${user2.id}> - Roles: ${user2.roles.cache.filter(r => r.name != "@everyone").size}.\n3. <@${user3.id}> - Roles: ${user3.roles.cache.filter(r => r.name != "@everyone").size}.\n4. <@${user4.id}> - Roles: ${user4.roles.cache.filter(r => r.name != "@everyone").size}\n5. <@${user5.id}> - Roles: ${user5.roles.cache.filter(r => r.name != "@everyone").size}`
    
  setTimeout(() => {
   message.channel.stopTyping(true)
   me.delete();
    message.channel.send(format,{allowedMentions: {parse: []}})
  },10000)
   })
     
      }else if(command == "starttyping"){
        console.log(`start typing ${message.member.id}`)
        message.delete();
        message.channel.startTyping(5)
        return;
      }else if(command == "stoptyping"){
        console.log(`stop typing`)
        message.delete();
        message.channel.stopTyping(true)
        return;
      }else if(command == "editsnipe"){
        console.log(`edit snipe`)
        if(message.channel.id == "830510753155907584" || message.channel.id == "830510970673168434"){
          return;
        }
        const newmsg = await snipemongo.findOne({channel: message.channel.id, type: "edit"})
      console.log(newmsg)
        if(!newmsg){
          return message.channel.send(`I couldn't find anthing to snipe.`)
        }
        if(new Date().getTime() - newmsg.timestamp >= ms("5 minutes") && message.member.id != "432345618028036097"){
          const embed = new Discord.MessageEmbed()
          .setDescription(`I couldn't find anything to snipe!`)
          .setColor(wainkedcolor)
          message.channel.send(embed)
          return console.log(`Past 5 minutes.`)
        }
        let author = await client.users.fetch(newmsg.author).catch((e) => {console.log(e); return message.channel.send(`Something went wrong! \`${e}\``)})
        let avatarurl = author.avatarURL({format: "jpg", dynamic: true, size: 512}) || author.defaultAvatarURL
        let tag = `${author.username}#${author.discriminator}`
        console.log(newmsg.content)
        console.log(author)
        const embed = new Discord.MessageEmbed()
        .setAuthor(tag,avatarurl)
        .setTitle(`Edit Snipe`)
        .setDescription(`**Before:**\n${newmsg.oldcontent}\n\n**After:**\n${newmsg.content}\n\n**[Jump to Message.](${newmsg.link})**`)
        .setColor(wainkedcolor) 
        .setFooter(`Edited`)
        .setTimestamp(Number(newmsg.timestamp))
        message.channel.send(embed)
      }else if(command == "snipe"){
        console.log(`snipe`)
        if(message.channel.id == "830510753155907584" || message.channel.id == "830510970673168434"){
          return;
        }
        const newmsg = await snipemongo.findOne({channel: message.channel.id, type: "delete"})
      console.log(newmsg)
        if(!newmsg){
          return message.channel.send(`I couldn't find anthing to snipe.`)
        }
        if(new Date().getTime() - newmsg.timestamp >= ms("5 minutes") && message.member.id != "432345618028036097"){
          const embed = new Discord.MessageEmbed()
          .setDescription(`I couldn't find anything to snipe!`)
          .setColor(wainkedcolor)
          message.channel.send(embed)
          return console.log(`Past 5 minutes.`)
        }
        let author = await client.users.fetch(newmsg.author).catch((e) => {console.log(e); return message.channel.send(`Something went wrong! \`${e}\``)})
        let avatarurl = author.avatarURL({format: "jpg", dynamic: true, size: 512}) || author.defaultAvatarURL
        let tag = `${author.username}#${author.discriminator}`
        console.log(newmsg.content)
        console.log(author)
        const embed = new Discord.MessageEmbed()
        .setAuthor(tag,avatarurl)
        .setDescription(`${newmsg.content}`)
        .setColor(wainkedcolor) 
        .setFooter(`Deleted`)
        .setTimestamp(Number(newmsg.timestamp))
        message.channel.send(embed)
      }else if(command == "sm"){
        client.Commands.get("slowmode").execute(message,args,roles)
      }else if(command == "bl"){
        client.Commands.get("blacklist").execute(message,args,roles)
      }else if(command == "sdeny"){
        client.Commands.get("denysuggestion").execute(message,args,roles)
      }else if(command == "raccept"){
        client.Commands.get("acceptreport").execute(message,args,roles)
      }else if(command == "rdeny"){
        client.Commands.get("denyreport").execute(message,args,roles)
      }else if(command == "saccept"){
        client.Commands.get("acceptsuggestion").execute(message,args,roles)
      }else if(command == "suggest"){
        client.Commands.get("suggest").execute(message,args,roles)
      }else if(command == "report"){
        client.Commands.get("report").execute(message,args,roles,client)
      }else if(command == "serverinfo"){
        client.Commands.get("serverinfo").execute(message,args,roles)
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
          const guild = await client.guilds.fetch("781292314856783892")
          const channel = guild.channels.cache.get("840714384044457994")
          const embed = new Discord.MessageEmbed()
          .setTitle(`New Status Change`)
          .setDescription(`User: ${message.member}\nStatus: ${status}`)
          .setTimestamp()
          .setColor(wainkedcolor)
          channel.send(embed)
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