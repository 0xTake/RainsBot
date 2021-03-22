module.exports.run = async (client, message, args, data) => {
    if(!data.plugins.economy.enabled) return message.channel.send(`⚠️ Le système d'économie n'est pas activé sur ce serveur. Activez-le avec la commande \`${data.prefix}enable economy\``);

    function formatRank(r) {
        switch (r) {
            case 1: r = '🥇'; break;
            case 2: r = '🥈'; break;
            case 3: r = '🥉'; break;
            default: r = r + '.';
        }

        return r;
    }

    const allUsers = (await require('../../models/User').find({}))
        .map(user => {
            return { total: user.money + user.bank, ...user }
        })
        .sort((a, b) => b.total - a.total);

    const userPosition = allUsers.findIndex(user => user._doc.id === message.author.id);

    const embed = {
        color: client.config.embed.color,
        title: 'Top 10 des utilisateurs de RainsBot les plus riches',
        description: userPosition < 10 ? `GG ! Vous faites parti du top 10 !` : `Vous êtes ${userPosition + 1}ème du classement.`,
        author: {
            icon_url: message.author.displayAvatarURL({ dynamic: true }),
            name: message.author.username
        },
        fields: [],
        footer: {
            text: client.config.embed.footer,
            icon_url: client.user.displayAvatarURL()
        }
    }

    allUsers.splice(0, 10).forEach((user, i) => {
        const rUser = client.users.cache.get(user._doc.id);

        embed.fields.push({ name: rUser ? `${formatRank(i + 1)} ${rUser.username}`: `${formatRank(i + 1)} Utilisateur inconnu`, value: `**${client.formatNumber(user.total)}$**` });
    });

    message.channel.send({ embed: embed })
}

module.exports.help = {
    name: "top-money",
    aliases: ["top-money", "moneyleaderboard", "money-leaderboard", "top"],
    category: "Economy",
    description: "Voir le top 10 des utilisateurs de RainsBot avec le plus d'argent",
    usage: "",
    cooldown: 5,
    memberPerms: [],
    botPerms: ["EMBED_LINKS"],
    args: false
}
