const mysql = require('mysql2/promise');
const canvasUtils = require('./misc/canvasUtils');

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


function getSectionObject(sectionName, data) {

    let section;
    switch (sectionName.toLowerCase()) {
        case 'generic':
            section = [
                { label: "AC:", value: data.ac },
                { label: "HP:", value: data.hp },
                { label: "Mana:", value: data.mana },
                { label: "End:", value: data.endur },
                { label: "Haste:", value: `${data.haste}%` }
            ].filter(entry => entry.value !== 0 && entry.value !== '0%' && entry !== null);
            break;
        case 'stats':
            section = [
                { label: "Strength:", value: data.astr, heroic: `+${data.heroic_str}` },
                { label: "Stamina:", value: data.asta, heroic: `+${data.heroic_sta}` },
                { label: "Intelligence:", value: data.aint, heroic: `+${data.heroic_int}` },
                { label: "Wisdom:", value: data.awis, heroic: `+${data.heroic_wis}` },
                { label: "Agility:", value: data.aagi, heroic: `+${data.heroic_agi}` },
                { label: "Dexterity:", value: data.adex, heroic: `+${data.heroic_dex}` },
                { label: "Charisma:", value: data.acha, heroic: `+${data.heroic_cha}` },
            ].filter(entry => entry.value !== 0 && entry !== null);
            break;
        case 'resists':
            section = [
                { label: "Magic:", value: data.mr, heroic: `+${data.heroic_mr}` },
                { label: "Fire:", value: data.fr, heroic: `+${data.heroic_fr}` },
                { label: "Cold:", value: data.cr, heroic: `+${data.heroic_cr}` },
                { label: "Disease:", value: data.dr, heroic: `+${data.heroic_dr}` },
                { label: "Poison:", value: data.pr, heroic: `+${data.heroic_pr}` },
                { label: "Corruption:", value: data.svcorruption, heroic: `+${data.heroic_svcorrup}` }
            ].filter(entry => entry.value !== 0 && entry !== null);
            break;
        case 'modstats':
            section = [
                { label: "Attack:", value: data.attack },
                { label: "Accuracy:", value: data.accuracy },
                { label: "Heal Amount:", value: data.healamt },
                { label: "Spell Damage:", value: data.spelldmg },
                { label: "HP Regen:", value: data.regen },
                { label: "Mana Regen:", value: data.manaregen },
                { label: "End Regen:", value: data.enduranceregen },
                { label: "Avoidance:", value: data.avoidance },
                { label: "Shielding:", value: data.shielding },
                { label: "DoT Shielding:", value: data.dotshielding },
                { label: "Stun Resist:", value: data.stunresist },
                { label: "Spell Shield:", value: data.spellshield },
                { label: "Damage Shield:", value: data.damageshield },
                { label: "DS Mitigation:", value: data.dsmitigation },
                { label: "clairvoyance:", value: data.clairvoyance },
                { label: "Strikethrough:", value: data.strikethrough },
                { label: "Combat Effects:", value: data.combateffects },
            ].filter(entry => entry.value !== 0 && entry.value !== '0' && entry !== null);
            break;
        case 'size':
            let itemSize = getItemSize(data.size);
            let itemWeight = getItemWeight(data.weight);
            section = [
                { label: "Size:", value: itemSize },
                { label: "Weight:", value: itemWeight },

            ].filter(entry => entry.value !== 0 && entry !== null);
            break;
        case 'weapon':
            section = [
                { label: "Damage:", value: data.damage },
                { label: "Delay:", value: data.delay },
                { label: "Range:", value: data.range },

            ].filter(entry => entry.value !== 0 && entry !== null);
            break;
        case 'augs':
            section = [
                { visible: data.augslot1visible, augtype: data.augslot1type },
                { visible: data.augslot2visible, augtype: data.augslot2type },
                { visible: data.augslot3visible, augtype: data.augslot3type },
                { visible: data.augslot4visible, augtype: data.augslot4type },
                { visible: data.augslot5visible, augtype: data.augslot5type },
                { visible: data.augslot6visible, augtype: data.augslot6type },

            ].filter(entry => entry.visible !== 0 && entry !== null);
            break;
    }
    return section;
}

function drawAugSlots(canvas, data, textureX, textureY, textX, lineHeight, fontSize) {
    let context = canvas.getContext('2d');
    data.forEach((item, index) => {
        const y = textureY + index * lineHeight;
        if (item.visible != null && item.visible != 0 && item.augtype != 0) {
            canvasUtils.drawTexture(context, textureX, y, 72, 72, "augslot");
            canvasUtils.drawText(canvas, `Augment Type: ${item.augtype}`, fontSize, "Times New Roman", "left", (textureX + 84), y + 52, "#FFFFFF");

        }
    })

}

function drawLabelsAndValues(canvas, data, xLeft, xRight, startY, lineHeight, normalFontSize, heroicFontSize) {
    data.forEach((item, index) => {
        const y = startY + index * lineHeight;
        if (item.label != null) {
            canvasUtils.drawText(canvas, item.label, normalFontSize, "Times New Roman", "left", xLeft, y, "#FFFFFF");
        }
        if (item.value != null) {
            canvasUtils.drawText(canvas, item.value, normalFontSize, "Times New Roman", "right", xRight, y, "#FFFFFF");
        }
        if (item.heroic != null) {
            canvasUtils.drawText(canvas, item.heroic, heroicFontSize, "Times New Roman", "left", (xRight + 10), (y - 4), "#c9bd85");
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
function getItemDiety(bitmask) {
    const diety = ["Agnostic", "Bertoxxulous", "Brell Serilis", "Cazic Thule", "Erollsi Marr", "Bristlebane", "Innoruuk", "Karana",
        "Mithaniel Marr", "Prexus", "Quellious", "Rallos Zek", "Rodcet Nife", "Solusek Ro", "The Tribunal", "Tunare", "Veeshan"];

    const itemBitmaskSum = bitmask;
    const attacheddiety = new Set();

    for (let i = 0; i < diety.length; i++) {
        if ((itemBitmaskSum & (1 << i)) !== 0) {
            attacheddiety.add(diety[i]);
        }

    }
    return Array.from(attacheddiety);
}
function getItemType(type) {
    let typeString;
    switch (type) {
        case 0: typeString = '1H Slashing'; break;
        case 1: typeString = '2H Slashing'; break;
        case 3: typeString = '1H Blunt'; break;
        case 4: typeString = '2H Blunt'; break;
        case 5: typestring = 'Archery'; break;

        case 7:
        case 19: typeString = 'Throwing'; break;

        case 8: typeString = 'Shield'; break;
        case 10: typeString = 'Armor'; break;
        case 11: typeString = 'Tradeskill'; break;
        case 12: typeString = 'Lockpicking'; break;
        case 14: typeString = 'Food'; break;
        case 15: typeString = 'Drink'; break;

        case 16:
        case 17:
        case 34:
        case 40:
        case 18: typeString = 'Item'; break;

        case 20: typeString = 'Scroll'; break;
        case 21: typeString = 'Potion'; break;
        case 22: typeString = 'Arrow'; break;
        case 23: typeString = 'Wind Instruments'; break;
        case 24: typeString = 'Stringed Instruments'; break;
        case 25: typeString = 'Brass Instruments'; break;
        case 26: typeString = 'Percussion Instruments'; break;
        case 27: typeString = 'Ammo'; break;
        case 29: typeString = 'Jewelry'; break;

        case 31:
        case 32: typeString = 'Book'; break;

        case 33:
        case 39: typeString = 'Key'; break;

        case 42: typeString = 'Poison'; break;
        case 45: typeString = 'Hand to Hand';
        case 52: typeString = 'Charm'; break;
        case 53: typeString = 'Dye'; break;
        case 54: typeString = 'Augment'; break;
        case 55: typeString = 'Augment Solvent'; break;
        case 56: typeString = 'Augment Distiller'; break;
        case 58: typeString = 'Fellowship Banner Materials'; break;
        case 63: typeString = 'Alt Currency'; break;
    }
    return typeString
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
    SQLQuery: SQLQuery,
    getItemClasses: getItemClasses,
    getItemRaces: getItemRaces,
    getItemSlots: getItemSlots,
    getItemSize: getItemSize,
    getItemWeight: getItemWeight,
    drawLabelsAndValues: drawLabelsAndValues,
    getSectionObject: getSectionObject,
    getItemDiety: getItemDiety,
    drawAugSlots: drawAugSlots,
    getItemType: getItemType
}