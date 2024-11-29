const { TextInputBuilder, EmbedBuilder, ModalBuilder, ButtonBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const mysql = require('mysql2/promise');

function textInput(label, id, style, required, maxLength) {
    return new TextInputBuilder()
        .setLabel(label)
        .setCustomId(id)
        .setStyle(style)
        .setRequired(required)
        .setMaxLength(maxLength)
}

const dbConfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
}
const dbPool = mysql.createPool(dbConfig);


async function SQLQuery(sql, values) {
    const connection = await dbPool.getConnection();
    try {
        const [results, fields] = await connection.query(sql, values);
        return results;
    } catch (error) {
        console.error('Query Execution Error:', error);
        throw error;
    } finally {
        connection.release();
    }
}
let ipExemptionEmbedDescription = [];
ipExemptionEmbedDescription[1] = '# **Hey, I can help you with an IP exemption!**\n';
ipExemptionEmbedDescription[2] = '## **Make sure you have the following:**\n';
ipExemptionEmbedDescription[3] = `- Both Account Names\n- Both In-Game Character Names\n- Your Public IPv4 address (*this can be found at [whatsmyip.com](https://whatsmyip.com/)*).`;
ipExemptionEmbedDescription[4] = "### **to submit this information, click the Ready button below to fill the form out.**\n";
ipExemptionEmbedDescription[5] = "After you've sent this, we can go ahead and give you a temporary IP exemption. **It can take anywhere between 2 minutes to a few hours for the temporary to take effect - please be patient.**\n### After that, please go to this [calendar](https://docs.google.com/spreadsheets/d/1sWGC6Y76dhBdbRmRBfXpSQVGjcWFHArwlTZSZXxBk6w/edit?gid=0#gid=0) and find a day/time that works for you.\n"
ipExemptionEmbedDescription[6] = "### In order for your temporary exemption to be made permanent, you and your partner will both need to be present on discord and in game for your IP exemption interview.\n";
ipExemptionEmbedDescription[7] = '### Please note that your temporary exemption will expire in 7 days.\n';
ipExemptionEmbedDescription[8] = '### If you have any questions, please let us know.';

async function getTicketPreset(guildId, presetName) {
    let ticket_types = await SQLQuery("SELECT * FROM `ticket-types` WHERE guild_id=? AND name=?", [guildId, presetName]);
    //   console.log(ticket_types);
    return ticket_types
}
async function getAllTicketPresets(guildId) {
    let ticket_types = await SQLQuery("SELECT * FROM `ticket-types` WHERE guild_id=?", [guildId]);
    return ticket_types
}
async function genTicketPresets(guildId) {
    let ipExemption = []
    ipExemption['typeId'] = 1;
    ipExemption['preset'] = 1;
    ipExemption['enabled'] = 0;
    ipExemption['name'] = 'IP Exemption';
    ipExemption['sendEmbed'] = 1;
    ipExemption['embedText'] = ipExemptionEmbedDescription.join();

    ipExemption['modal_input_1_name'] = 'Account Name 1';
    ipExemption['modal_input_1_type'] = 1;

    ipExemption['modal_input_2_name'] = 'Character Name 1';
    ipExemption['modal_input_2_type'] = 1;

    ipExemption['modal_input_3_name'] = 'Account Name 2';
    ipExemption['modal_input_3_type'] = 1;

    ipExemption['modal_input_4_name'] = 'Character Name 2';
    ipExemption['modal_input_4_type'] = 1;

    ipExemption['modal_input_5_name'] = 'IP Address';
    ipExemption['modal_input_5_type'] = 1;


    await SQLQuery(
        "INSERT INTO `ticket-types` (ticket_type_id, preset, enabled, name, send_embed, embed_text, modal_input_1,modal_input_1_type, modal_input_2,modal_input_2_type, modal_input_3,modal_input_3_type, \
         modal_input_4, modal_input_4_type, modal_input_5,modal_input_5_type, guild_id) \
         SELECT ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?,? WHERE NOT EXISTS (SELECT 1 FROM `ticket-types` WHERE ticket_type_id = ?);",
        [ipExemption['typeId'], ipExemption['preset'], ipExemption['enabled'], ipExemption['name'], ipExemption['sendEmbed'], ipExemption['embedText'],
        ipExemption['modal_input_1_name'], ipExemption['modal_input_1_type'], ipExemption['modal_input_2_name'], ipExemption['modal_input_2_type'],
        ipExemption['modal_input_3_name'], ipExemption['modal_input_3_type'], ipExemption['modal_input_4_name'], ipExemption['modal_input_4_type'],
        ipExemption['modal_input_5_name'], ipExemption['modal_input_5_type'], guildId, ipExemption['typeId']]
    );

}
async function generateModal(data) {
    let categoryData = await getTicketPreset(1302694166266118175, data);
    let modal = new ModalBuilder()
        .setCustomId('generated-ticket-modal')
        .setTitle(categoryData[0].name)

    let actionRows = [];

    if (categoryData[0].modal_input_1 != null) {
        let firstInput = textInput(categoryData[0].modal_input_1, 'modal-input-1', categoryData[0].modal_input_1_type, true, 15);
        actionRows.push(new ActionRowBuilder().addComponents(firstInput));

    }
    if (categoryData[0].modal_input_2 != null) {
        let secondInput = textInput(categoryData[0].modal_input_2, 'modal-input-2', categoryData[0].modal_input_2_type, true, 20);
        actionRows.push(new ActionRowBuilder().addComponents(secondInput));

    }
    if (categoryData[0].modal_input_3 != null) {
        let thirdInput = textInput(categoryData[0].modal_input_3, 'modal-input-3', categoryData[0].modal_input_3_type, true, 20);
        actionRows.push(new ActionRowBuilder().addComponents(thirdInput));

    }
    if (categoryData[0].modal_input_4 != null) {
        let fourthInput = textInput(categoryData[0].modal_input_4, 'modal-input-4', categoryData[0].modal_input_4_type, true, 20);
        actionRows.push(new ActionRowBuilder().addComponents(fourthInput));

    }
    if (categoryData[0].modal_input_5 != null) {
        let fifthInput = textInput(categoryData[0].modal_input_5, 'modal-input-5', categoryData[0].modal_input_5_type, true, 20);
        actionRows.push(new ActionRowBuilder().addComponents(fifthInput));

    }


    for (const row of actionRows) {
        modal.addComponents(row);
    }
    console.log('Generated Modal.')
    return modal;
}

async function genEmbed(title, description) {
    return new EmbedBuilder()
        .setTitle(title)
        .setDescription(description);
}

function genContinueButton() {
    let readyButton = new ButtonBuilder()
        .setCustomId('continue-button')
        .setLabel("Ready!")
        .setStyle(1);

    const row = new ActionRowBuilder().addComponents(readyButton);
    return row;

}

async function genDB() {
    await SQLQuery("CREATE TABLE IF NOT EXISTS `guilds` (guild_id BIGINT, owner_id BIGINT, create_ticket_channel BIGINT)");
    await SQLQuery("CREATE TABLE IF NOT EXISTS `ticket-types` ( \
        `guild_id` BIGINT , \
        `ticket_type_id` INT , \
        `preset` INT, \
        `enabled` INT, \
        `name` TEXT, \
        `send_embed` INT , \
        `embed_text` TEXT,  \
        `modal_input_1` TEXT, \
        `modal_input_1_type` TEXT, \
        `modal_input_2` TEXT, \
        `modal_input_2_type` TEXT, \
        `modal_input_3` TEXT, \
        `modal_input_3_type` TEXT, \
        `modal_input_4` TEXT, \
        `modal_input_4_type` TEXT, \
        `modal_input_5` TEXT, \
        `modal_input_5_type` TEXT, \
        `modal_recieve_channel_id` BIGINT  \
    )");
}
function drawLabelsAndValues(ctx, data, xLeft, xRight, startY, lineHeight) {
    //  ctx.font = "16px Arial";
    ctx.textBaseline = "top";
  

    data.forEach((item, index) => {
        const y = startY + index * lineHeight;

        if (item.label != null) {
            // Draw label (left aligned)
            ctx.textAlign = "left";
            ctx.fillText(item.label, xLeft, y);
        }
        if (item.value != null) {
            // Draw value (right aligned)
            ctx.textAlign = "right";
            ctx.fillText(item.value, xRight, y);
        }

    });
}
function getItemClasses(bitmask) {
    const classes = ["WAR", "CLR", "PAL", "RNG", "SHD", "DRU", "MNK", "BRD",
        "ROG", "SHM", "NEC", "WIZ", "MAG", "ENC", "BST", "BER"];

    const itemBitmaskSum = bitmask;
    const attachedClasses = [];

    for (let i = 0; i < classes.length; i++) {
        if ((itemBitmaskSum & (1 << i)) !== 0) {
            attachedClasses.push(classes[i]);
        }
    }
    return attachedClasses;
}
function getItemClasses(bitmask) {
    const classes = ["WAR", "CLR", "PAL", "RNG", "SHD", "DRU", "MNK", "BRD",
        "ROG", "SHM", "NEC", "WIZ", "MAG", "ENC", "BST", "BER"];

    const itemBitmaskSum = bitmask;
    const attachedClasses = [];
    if (bitmask === 65535) {
        attachedClasses.push('ALL');

        return attachedClasses;

    }
    for (let i = 0; i < classes.length; i++) {
        if ((itemBitmaskSum & (1 << i)) !== 0) {
            attachedClasses.push(classes[i]);
        }
    }
    return attachedClasses;
}
function getItemRaces(bitmask) {
    const races = ["HUM", "BAR", "ERU", "ELF", "HIE", "DEF", "HEF", "DWF", "TRL",
        "OGR", "HFL", "GNM", "IKS", "VAH", "FRG", "DRK"];

    const itemBitmaskSum = bitmask;
    const attachedRaces = [];

    if (bitmask === 65535) {
        attachedRaces.push('ALL');

        return attachedRaces;

    }
    for (let i = 0; i < races.length; i++) {
        if ((itemBitmaskSum & (1 << i)) !== 0) {
            attachedRaces.push(races[i]);
        }
    }

    return attachedRaces;
}
function getItemSlots(bitmask) {
    const slots = ["Charm", "Ear", "Head", "Face", "Ear", "Neck", "Shoulders", "Arms",
        "Back", "Wrist", "Wrist", "Range", "Hands", "Primary", "Secondary", "Ring", "Ring", "Chest", "Legs", "Feet", "Waist", "Powersource", "Ammo"];

    const itemBitmaskSum = bitmask;
    const attachedSlots = new Set();

    for (let i = 0; i < slots.length; i++) {
        if ((itemBitmaskSum & (1 << i)) !== 0) {
            attachedSlots.add(slots[i]);
        }

    }
    return Array.from(attachedSlots);
}
function getItemSize(size) {
    let sizeString;

    switch (size) {
        case 0:
            sizeString = "Tiny";
            break;
        case 1:
            sizeString = "Small";
            break;
        case 2:
            sizeString = 'Medium';
            break;
        case 3:
            sizeString = 'Large';
            break;
        case 4:
            sizeString = 'Giant';
            break;
        case 5:
            sizeString = 'Gigantic';
            break;
        default:
            sizeString = "Average";
            break;
    }

    return sizeString

}
function getItemWeight(weight) {
    return (weight / 10).toFixed(1);

}
module.exports = {
    textInput: textInput,
    SQLQuery: SQLQuery,
    genDB: genDB,
    genTicketPresets: genTicketPresets,
    getTicketPreset: getTicketPreset,
    getAllTicketPresets: getAllTicketPresets,
    generateModal: generateModal,
    genEmbed: genEmbed,
    genContinueButton: genContinueButton,
    getItemClasses: getItemClasses,
    getItemRaces: getItemRaces,
    getItemSlots: getItemSlots,
    getItemSize: getItemSize,
    getItemWeight: getItemWeight,
    drawLabelsAndValues: drawLabelsAndValues
}