const { SlashCommandBuilder, ChannelType, ChannelSelectMenuBuilder, ActionRowBuilder, EmbedBuilder } = require('discord.js');
const { drawBG, drawItemImage } = require('../../misc/imageGen');
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

        let reply = await drawItemImage(interaction, queryInfo[0]);
    }
}