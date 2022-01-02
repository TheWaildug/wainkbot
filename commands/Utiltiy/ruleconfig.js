const MakeEmbed = require("../../makeembed");
const RuleSchema = ruleschema = require("../../ruleschema")
module.exports = {
    commands: ["ruleconfig", "rconfig", "rc"],
    description: "Add or remove rules from WainkBot's system.",
    requiredRoles: "832747239809613834",
    expectedArgs: "<add/remove> <rule #>",
    minArgs: 2,
    maxArgs: null,
    Category: "Utility",
    permissionError: "You cannot run this command.",
    callback: async (message,args,text,prefix,alias) => {
        console.log(`${prefix}${alias}`)
        const ar = args[0].toLowerCase();
        if(ar != "add" && ar != "remove"){
            const embed = await MakeEmbed({title: "Missing Arguments", description: `You're missing a few arguments. Use \`${prefix}${alias} <add/remove> <rule #>\`.`, color: "RED"})
                 
            message.channel.send(embed)
            return;
        }
        if(isNaN(args[1])){
            const embed = await MakeEmbed({title: "Missing Arguments", description: `You're missing a few arguments. Use \`${prefix}${alias} <add/remove> <rule #>\`.`, color: "RED"})
                 
            message.channel.send(embed)
            return;
        }
        const rulenum = Number(args[1])
        if(rulenum < 1){
            const embed = await MakeEmbed({title: "Rule Configuration", description: `The rule number must be greater than or equal to 1.`,color: "RED"})
            message.channel.send(embed)
            return;
        }
        if(ar == "remove"){
            const findrule = await RuleSchema.findOne({number: rulenum})
            console.log(findrule)
            if(!findrule){
                const embed = await MakeEmbed({title: "Rule Configuration", description: `Rule \`${rulenum}\` is not in the database. Use \`${prefix}${alias} add ${rulenum}\` to add the rule.`,color: "RED"})
                message.channel.send(embed)
                return;
            }
            const confirmembed = await MakeEmbed({title: "Rule Configuration", description: `Removing rule \`${rulenum}\` from the database.`, color: "ff00f3"})
            message.channel.send(confirmembed)
            await ruleschema.deleteOne({number: rulenum})
        }
        if(ar == "add"){
            const findrule = await RuleSchema.findOne({number: rulenum})
            console.log(findrule)
            if(findrule){
                const embed = await MakeEmbed({title: "Rule Configuration", description: `Rule \`${rulenum}\` is in the database already. Use \`${prefix}${alias} remove ${rulenum}\` to remove the rule.`, color: "RED"})
                message.channel.send(embed)
                return;
            }
            const sendembed = await MakeEmbed({title: "Rule Configuration", description: `Please reply with the rule. Using asterisks or other symbols is accepted.`, color :"ff00f3"})
            message.channel.send(sendembed)
            const filter = msg => msg.author.id === message.author.id;
            const collector = message.channel.createMessageCollector(filter, {time: 30000})
            collector.on("end", async (collected,reason) => {
                console.log(reason)
                if(reason == "time"){
                    const timeoutembed = await MakeEmbed({title: "Rule Configuration", description: "Timed out after 30 seconds.", color: "RED"})
            return message.channel.send(timeoutembed)
                }
            })
            collector.on("collect", async msg => {
                if(msg.author.bot){
                    return;
                }
                console.log(`Collected ${msg.content}`)
                collector.stop(`Collected ${msg.content}`)
                if(msg.content.toLowerCase() == "cancel"){
                    const embed = await MakeEmbed({title: "Rule Configuration", description: `Prompt cancelled`, color: "ff00f3"})
                    message.channel.send(embed)
                    return;
                }
                const confirmembed = await MakeEmbed({title: "Rule Configuration", description: `Adding rule \`${rulenum}\` to the database.`,color: "ff00f3"})
                message.channel.send(confirmembed)
                const newrule = new ruleschema({
                    rule: msg.content,
                    number: rulenum
                })
                await newrule.save();
            })
        }
    }
}