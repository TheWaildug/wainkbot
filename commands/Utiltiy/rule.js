const MakeEmbed = require("../../makeembed")
const RequiredRoles = require("../../values/roles")
const RuleSchema = require("../../ruleschema")
module.exports = {
    commands: ["rule", "r"],
    description: "Shows a rule.",
    requiredRoles: RequiredRoles,
    minArgs: 1,
    maxArgs: null,
    expectedArgs: "<rule #>",
    Category: "Utility",
    permissionError: "You must be a Staff Member to run this command.",
    callback: async (message,args,text,prefix,alias) => {
        const rule = text
        if(isNaN(rule)){
            const embed = await MakeEmbed({title: "Missing Arguments", description: `You're missing a few arguments. Use \`${prefix}${alias} <rule #>\`.`, color: "RED"})
                 
                    message.reply({embeds: [embed]})
                    return;
        }
        const rulem = await RuleSchema.findOne({number: rule})
        if(rule < 1){
            const embed = await MakeEmbed({title: "Error", description: `Unknown Rule.`, color: "RED"})
            message.reply({embeds: [embed]})
            return;
        }
        if(!rulem){
            const embed = await MakeEmbed({title: "Error", description: `Unknown Rule.`, color: "RED"})
            message.reply({embeds: [embed]})
            return;
        }
        
        const embed = await MakeEmbed({title: `Rule #**${rule}**`, description: rulem.rule, color: "ff00f3"})
        message.channel.send({embeds: [embed]})
    }
}