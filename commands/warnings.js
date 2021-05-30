const WarningSchema = require("../warningmongo")
const HasPermissions = require("../isbypass.js")
const daysoftheweek = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
const months = ["January","February","March","April","May","June","July","August","September","October","November","December"]
const Discord = require("discord.js")
module.exports = {
  name: "warnings",
  description: "views those idiot's warnings",
 async execute(message,args,roles) {
  
      
     
       let cont = true;
  let mentionmember
  //If user dont mention a member, that show him this error msg
  let hasperm = await HasPermissions(roles,message.member)
  console.log(hasperm)
  if(hasperm == false && message.channel.id != "818890024178155603"){
    return message.reply(`Whoops! Make sure to use this command in <#818890024178155603>.`);
            
  }
    if(hasperm == true){
      if(message.mentions.members.first()){
        mentionmember = message.mentions.members.first()
      }else if(!message.mentions.members.first()){
        mentionmember = await message.guild.members.fetch(args[0]).catch(e => {
            console.log(e)
        })
      }
    }else if(hasperm == false){
        
          mentionmember = message.member
    }
  
 if(!mentionmember || mentionmember.size > 1){
  mentionmember = message.member
 }
 const warnings = await WarningSchema.find({userid: mentionmember.id})
 console.log(warnings.toString())
 if(mentionmember.id == message.member.id){
       if(warnings == ""){
   return message.reply(`You're clean!`);
 }
  }else if(mentionmember.id != message.member.id){
    if(warnings == ""){
      return message.reply(`This user has no warnings!`)
    }
  }
  let warningstring = ""
const embed = new Discord.MessageEmbed()
.setDescription(`All warnings for ${mentionmember}`)
.setTimestamp()
.setColor("ff00f3")

  warnings.forEach(warning => {
      let timestamp = Number(warning.timestamp);
      
      let date = new Date(timestamp)
let hours = date.getUTCHours() ; 
let AmOrPm = hours >= 12 ? 'pm' : 'am';
hours = (hours % 12) || 12;
hours = hours.toLocaleString('en-US', {
  minimumIntegerDigits: 2,
  useGrouping: false
})
let minutes = date.getUTCMinutes();
minutes = minutes.toLocaleString('en-US', {
  minimumIntegerDigits: 2,
  useGrouping: false
})
let seconds = date.getUTCSeconds();
seconds = seconds.toLocaleString('en-US', {
  minimumIntegerDigits: 2,
  useGrouping: false
})
let finalTime = `${hours}:${minutes}:${seconds} ${AmOrPm}`
      let format = `${daysoftheweek[date.getUTCDay()]}, ${months[date.getUTCMonth()]} ${date.getUTCDate()} ${date.getUTCFullYear()} ${finalTime} GMT`
    embed.addField(`ID: ${warning.warningid}`,`${warning.warning} - ${format}`)
  })
 
  message.channel.send(embed)
  }
} 