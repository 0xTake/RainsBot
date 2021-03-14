module.exports.run = async (client, message, args, data) => {
    if(!data.plugins.economy.enabled) return message.channel.send(`⚠️ Le système d'économie n'est pas activé sur ce serveur. Activez-le avec la commande \`${data.prefix}enable economy\``);

    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(u => u.user.username.toLowerCase().includes(args[0]?.toLowerCase())) || message.guild.member(message.author);

    let user = await client.findOrCreateUser(member.user);
    if(!user) user = {
        money: 0,
        bank: 0
    }

    const rank = (await require('../../models/User').find({}))
        .map(user => { return { total: user.money + user.bank, ...user } })
        .sort((a, b) => b.total - a.total)
        .findIndex(user => user._doc.id === message.author.id);

    message.channel.send({
        embed: {
            color: client.config.embed.color,
            author: {
                name: member.user.tag,
                icon_url: member.user.displayAvatarURL({ dynamic: true })
            },
            description: `**Rang**: ${(rank + 1) === 1 ? "1er" : `${rank + 1}ème`}`,
            fields: [
                {
                    name: 'Argent:',
                    value: `${client.formatNumber(user.money)}${data.plugins.economy.currency}`,
                    inline: true
                },
                {
                    name: 'Banque:',
                    value: `${client.formatNumber(user.bank)}${data.plugins.economy.currency}`,
                    inline: true
                },
                {
                    name: 'Total:',
                    value: `${client.formatNumber(user.money + user.bank)}${data.plugins.economy.currency}`,
                    inline: true
                }
            ],
            footer: {
                text: client.config.embed.footer,
                icon_url: client.user.displayAvatarURL()
            }
        }
    });
}

module.exports.help = {
    name: "balance",
    aliases: ["balance", "money", "bal", "bl"],
    category: "Economy",
    description: "Voir l'argent d'un utilisateur ou de soit-même",
    usage: "[membre]",
    cooldown: 5,
    memberPerms: [],
    botPerms: ["EMBED_LINKS"],
    args: false
}