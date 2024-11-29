const { SlashCommandBuilder, ChannelType, ChannelSelectMenuBuilder, ActionRowBuilder, EmbedBuilder } = require('discord.js');
const { drawBG } = require('../../misc/imageGen');
const utils = require('../../utils');



module.exports = {
    name: 'lookup',
    structure: new SlashCommandBuilder()
        .setName('lookup')
        .setDescription('Look an item up from the database.')
        .addStringOption(option =>
            option.setName('itemname')
                .setDescription('Item Name')),
    run: async (client, interaction, args) => {
        let suppliedName = interaction.options.getString('itemname');
        let queryInfo;
        try {
            queryInfo = await utils.SQLQuery("SELECT * FROM `items` WHERE UPPER(name) LIKE UPPER(?)", suppliedName)
        } catch (e) {
            console.error(e);
        }
        const filtered = Object.fromEntries(
            Object.entries(queryInfo[0]).filter(([_, value]) => value != 0 && value != -1)
        );
        console.log(filtered);
        let reply = drawBG(interaction, queryInfo);
    }
}