const validatePermissions = (permissions) => {
    const validPermissions = [
      'CREATE_INSTANT_INVITE',
      'KICK_MEMBERS',
      'BAN_MEMBERS',
      'ADMINISTRATOR',
      'MANAGE_CHANNELS',
      'MANAGE_GUILD',
      'ADD_REACTIONS',
      'VIEW_AUDIT_LOG',
      'PRIORITY_SPEAKER',
      'STREAM',
      'VIEW_CHANNEL',
      'SEND_MESSAGES',
      'SEND_TTS_MESSAGES',
      'MANAGE_MESSAGES',
      'EMBED_LINKS',
      'ATTACH_FILES',
      'READ_MESSAGE_HISTORY',
      'MENTION_EVERYONE',
      'USE_EXTERNAL_EMOJIS',
      'VIEW_GUILD_INSIGHTS',
      'CONNECT',
      'SPEAK',
      'MUTE_MEMBERS',
      'DEAFEN_MEMBERS',
      'MOVE_MEMBERS',
      'USE_VAD',
      'CHANGE_NICKNAME',
      'MANAGE_NICKNAMES',
      'MANAGE_ROLES',
      'MANAGE_WEBHOOKS',
      'MANAGE_EMOJIS',
    ]
  
    for (const permission of permissions) {
      if (!validPermissions.includes(permission)) {
        throw new Error(`Unknown permission node "${permission}"`)
      }
    }
  }
  const Discord = require("discord.js")
  const MakeEmbed = require("../makeembed")
module.exports = (client,commandOptions) => {
    let{
        commands,
        expectedArgs = "",
        permissionError = "You do not have the correct permission to run this command.",
        minArgs = 0,
        maxArgs = null,
        permissions = [],
        requiredRoles = [],
        callback
    } = commandOptions

    //Ensure command and aliases are an array
    if(typeof commands === "string"){
        commands = [commands]
    }
    if(typeof requiredRoles === "string"){
        requiredRoles = [requiredRoles]
    }
 
    //Ensure permissions are an array and are valid.
    if(permissions.length){
        if(typeof permissions === "string"){
            permissions = [permissions]
        }
        validatePermissions(permissions)
    }
    client.on("messageCreate", async message => {
        if(message.type != "DEFAULT"){
            return;
          }
          if(message.guild == null){
            return;
          }
          if(message.author.bot){
              return;
          }
          const {member, content, guild} = message
          if(message.client.user.id == "832740448909000755"){
            if(message.member.id != "432345618028036097" && message.member.id != "745325943035396230" && message.member.id != "737825820642639883"){
                
              return;
            }
          }
         
       
        let prefix 
        if(client.user.id == "832740448909000755"){
            prefix = "&"
        }else{
            prefix = "!"
        }
        if(client.user.id == "832740448909000755" && message.content.startsWith("!")){
            return;
        }
        if(!message.content.startsWith(prefix)){
            return;
        }
        const argumentstest = message.content.slice(prefix.length).split(" ")
        const cmd = argumentstest.shift().toLowerCase();
        if(guild.id != "813837609473933312"){
            return;
        }
        
       
        
        for(const alias of commands){
            if(cmd == alias){
                
                
                //Ensure required roles
                let hasRole
                for(const requiredRole of requiredRoles){
                   
                    const role = guild.roles.cache.find(r => r.name == requiredRole) || guild.roles.cache.get(requiredRole)
                    if(!role){
                        console.log(`there isn't a role names ${requiredRole}`)
                        const embed = await MakeEmbed({title: "Missing Role", description: `Cannot find the role **${requiredRole}**.`, color: "RED"})
                        message.channel.send({embeds: [embed]})
                        hasRole = false
                        return;
                    }
                    if(!member.roles.cache.has(role.id)){
                        console.log(`${member.id} doesn't have role ${requiredRole}.`)
                        hasRole = false
                    }
                    if(member.roles.cache.has(role.id)){
                        console.log(`${member.id} does have role ${requiredRole}.`)
                        hasRole = true
                        break;
                    }
                }
                let hasPerm = false
                  //Ensure required permissions
                  for(const permission of permissions){
                    if(!member.permissions.has(permission)){
                        console.log(`${member.id} doesn't have ${permission}.`)
                        hasPerm = false
                    }   
                    if(member.permissions.has(permission)){
                        console.log(`${member.id} does has ${permission}`)
                        hasPerm = true
                        break;
                    }
                }
                console.log(hasRole)
                if(hasRole != true && hasPerm != true){
                    const embed = await MakeEmbed({title: "Permissions Error", description: permissionError, color: "RED"})
                    message.delete();
                    message.channel.send({embeds: [embed]}).then(msg => {
                        setTimeout(() => {
                            msg.delete();
                        },5000)
                    })
                    return;
                }
              
                const args = content.split(" ")
                args.shift()
                console.log(args.length)
                //Ensure correct number of args.
                if(args.length < minArgs){
                    const embed = await MakeEmbed({title: "Missing Arguments", description: `You're missing a few arguments. Use \`${prefix}${alias} ${expectedArgs}\`.`, color: "RED"})
                 
                    message.channel.send({embeds: [embed]})
                    return;
                }else if(
                    maxArgs !== null && args.length > maxArgs
                ){
                    const embed = await MakeEmbed({title: "Missing Arguments", description: `You have a few too many arguments. Use \`${prefix}${alias} ${expectedArgs}\`.`, color: "RED"})
                 
                    message.channel.send({embeds: [embed]})
                    return;
                }
              
                callback(message,args,args.join(" "),prefix,alias)
                return;
            }
        }
    })
}