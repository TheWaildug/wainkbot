const Discord = require("discord.js")
const client = new Discord.Client();
require("dotenv").config()
let prefix = "!"
const discordInv = require('discord-inv');
const RandomString = require("randomstring")
const rslur = require("./values/rslurs")
const afkmongo = require("./afkmongo.js")
const fetch = require("node-fetch")
const checkforflags = require("./checkflags.js")
const blacklistmongo = require("./blacklistmongo")
const LeaveRoleSchema = require("./leaveroles")
const evalrole = require("./values/evalroles.js")
const asked = require("./values/whoasked.js")
const modroles = require("./values/roles.js")
const snipemongo = require("./snipemongo")
if(1+1 == 3){
  const GphApiClient = require("giphy-js-sdk-core");
  const giphy = GphApiClient(process.env.GIPHYTOKEN);
}

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
    console.log(command)
    
    client.Commands.set(command.name, command);
  }
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
     let ar = await checkforflags(args.join(" "),"return")
     console.log(ar)
     let returne
     if(ar == null){
       returne = false
     }else if(ar != null){
       code = ar
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
         let embed
         if(evaltype == "object"){
          let evaluatedstring = JSON.stringify(evaluated)
     
          embed = new Discord.MessageEmbed()
               .setTitle(`Evaluation`)
               .setColor("GREEN")
               .setDescription(`Evaluated in *${new Date().getTime() - message.createdTimestamp} ms.*`)
               .addField(`Input`,"```js\n" + code + "```")
               .addField(`Output`,"```\n" + evaluatedstring + "```")
               .addField("Output Type", "`" + evaltype.toUpperCase() + "`")
               
         }else{
          embed = new Discord.MessageEmbed()
          .setTitle(`Evaluation`)
          .setColor("GREEN")
          .setDescription(`Evaluated in *${new Date().getTime() - message.createdTimestamp} ms.*`)
          .addField(`Input`,"```js\n" + code + "```")
          .addField(`Output`,"```\n" + evaluated + "```")
          .addField("Output Type", "`" + evaltype.toUpperCase() + "`")
         }
         
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
    let jsonData = require('./information.json');
console.log(jsonData);
if(jsonData.active == true){
  const channel = client.channels.cache.get(jsonData.channel);
  let Ping = ms(new Date().getTime() - jsonData.currenttime,{long: true})
  channel.send(`Restarted in **${Ping}.**`)
  let information = { 

    active: false
};
 
let data = JSON.stringify(information);
fs.writeFileSync('information.json', data);
}
    if(client.user.id == "832740448909000755"){
      let status = await statuses.findOne({shuffle: false})
       console.log(status)
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
     client.Commands.get("ping").execute(message,args,client)
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
  client.on("raw", async packet => {
     
  })
  ///Dad Bot Stuff
  client.on("message", async message => {
    if(message.type != "DEFAULT"){
      return;
    }
    if (message.guild == null) {
      return;
    }
   
    
    let args = message.content.split(" ")
     if(client.user.id == "832740448909000755"){
        if(message.author.id != "432345618028036097" && message.author.id != "745325943035396230" && message.author.id != "737825820642639883"){
          return;
        }
      }
      
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
  
          
      
      }else if(command == "help"){
        client.Commands.get("help").execute(message,args,client.Commands,roles)
      }else if(command == "unlock"){
        client.Commands.get("unlock").execute(message,args,roles)
      }else if(command == "lock"){
        client.Commands.get("lock").execute(message,args,roles)
      }else if(command == "chain"){
       client.Commands.get("chain").execute(message,args,roles)
      }else if(command == "restart"){
        client.Commands.get("restart").execute(message,args)
      }else if(command == "doban"){
        client.Commands.get("doban").execute(message,args,roles) 
      }else if(command == "warn"){
        client.Commands.get("warn").execute(message,args,roles)
      }else if(command == "warnings"){
        client.Commands.get("warnings").execute(message,args,roles)
      }else if(command == "ban"){
        client.Commands.get("ban").execute(message,args,roles,client)
      }else if(command == "membercount"){
        client.Commands.get("membercount").execute(message,args,roles)
      }else if(command == "mock"){
        client.Commands.get("mock").execute(message,args)
      }else if(command == "roleleaderboard"){
        client.Commands.get("roleleaderboard").execute(message,args)
      }else if(command == "starttyping"){
        client.Commands.get("starttyping").execute(message,args)
      }else if(command == "stoptyping"){
        client.Commands.get("stoptyping").execute(message,args)
      }else if(command == "editsnipe"){
       client.Commands.get("editsnipe").execute(message,args,roles,client)
      }else if(command == "snipe"){
        client.Commands.get('snipe').execute(message,args,roles,client)
      }else if(command == "sm"){
        client.Commands.get("slowmode").execute(message,args,roles)
      }else if(command == "bl"){
        client.Commands.get("bl").execute(message,args,roles)
      }else if(command == "sdeny"){
        client.Commands.get("sdeny").execute(message,args,roles)
      }else if(command == "raccept"){
        client.Commands.get("raccept").execute(message,args,roles)
      }else if(command == "rdeny"){
        client.Commands.get("rdeny").execute(message,args,roles)
      }else if(command == "saccept"){
        client.Commands.get("saccept").execute(message,args,roles)
      }else if(command == "suggest"){
        client.Commands.get("suggest").execute(message,args,roles)
      }else if(command == "report"){
        client.Commands.get("report").execute(message,args,roles,client)
      }else if(command == "serverinfo"){
        client.Commands.get("serverinfo").execute(message,args,roles)
      }else if(command == "rule"){
        client.Commands.get("rule").execute(message,args,roles)
      }else if(command == "ping"){
        client.Commands.get("ping").execute(message,args,client)
      }else if(command == "afk"){
        client.Commands.get("afk").execute(message,args)
      }else if(command == "status"){
        client.Commands.get("status").execute(message,args,client)
      }else if(command == "say"){
        client.Commands.get("say").execute(message,args,roles)
      }else if(command == "unmute"){
        client.Commands.get("unmute").execute(message,args,modroles)
      }else if(command == "mute"){
        client.Commands.get("mute").execute(message,args,modroles)
      }else if(command == "purge"){
        client.Commands.get("purge").execute(message,args,roles)
      }else if(command == "kick"){
        client.Commands.get("kick").execute(message,args,modroles)
      }
  })

  const express = require("express");
const roles = require("./values/roles.js");
const pingroles = require("./values/pingroles")
const blacklist = require("./commands/bl.js");
const mute = require("./commands/mute.js");
  const server = express()
  server.listen(3000, ()=>{console.log("Server is Ready!")});
  server.all('/', (req, res)=>{
    res.send('wainked is meanie')
})
client.login(process.env.token)