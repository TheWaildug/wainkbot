const MakeEmbed = require("../../makeembed")
const BlockSchema = require("../../blockschema")
const roles = require("../../values/roles")
const HasPermissions = require("../../isbypass")
const wait = require("util").promisify(setTimeout)
module.exports = {
    commands: ["dmdisable", "disabledms", "blockdms", "blockdm", "disabledm", "dmsdisable", "dmblock"],
    description: `Allowed you to opt in/out of getting DMs from wainkbot.`,
    requiredRoles: "@everyone",
    Category: "Utility",
    permissionError: `If you can see this, something went wrong.`,
    expectedArgs: "<enable/disable/view>",
    minArgs: 1,
    maxArgs: null,
    callback: async (message,args,text,prefix,alias) => {
        let cont = await HasPermissions(roles,message.member)
        console.log(cont)
        if(cont == false && message.member.id != "432345618028036097" && message.channel.id != "818890024178155603"){
            const embed = await CreateEmbed({title: "Permissions Error", description: `Whoops! Make sure to use this command in <#818890024178155603>.`, color: "RED"})
            message.channel.send({embeds: [embed]})
            message.delete();
            return;
          }  
          let type = args[0]
          if(type.toLowerCase() != "enable" && type.toLowerCase() != "disable" && type.toLowerCase() != "view"){
            const embed = await MakeEmbed({title: "Missing Arguments", description: `You're missing a few arguments. Use \`${prefix}${alias} <enable/disable/view>\`.`, color: "RED"})
                 
            message.reply({embeds: [embed]})
            return;
          }

          if(type.toLowerCase() == "view"){
            const isblocked = await BlockSchema.findOne({user: message.member.id, type: "dm"})
            if(isblocked == null){
              message.reply(`Your DMs are currently open to WainkBot.`)
              return;
            }else if(isblocked != null){
              message.reply(`Your DMs are currently closed to WainkBot.`)
              return;
            }
          }
          if(type.toLowerCase() == "enable"){
            const isblocked = await BlockSchema.findOne({user: message.member.id, type: "dm"});
            if(isblocked != null){
              const noembed = await MakeEmbed({title: `Permission Denied`, description: `You've already opted out from DMs!`, color: "RED"})
              message.reply({embeds: [noembed]})
              return;
            }else if(isblocked == null){
              const newblock = new BlockSchema({user: message.member.id, type: "dm"})
              newblock.save()
              message.reply(`Your DMs have been closed to non-automated DMs.`)
              return;
            }
          }else if(type.toLowerCase() == "disable"){
            const isblocked = await BlockSchema.findOne({user: message.member.id, type: "dm"})
            if(isblocked == null){
              const noembed = await MakeEmbed({title: `Permission Denied`, description: `You've already opted in to DMs!`, color: "RED"})
              message.reply({embeds: [noembed]})
              return;
            }else if(isblocked != null){
              await BlockSchema.deleteMany({user: message.member.id, type: "dm"})
              message.reply(`Your DMs have been opened.`)
              return;
            }
          }
    }
}