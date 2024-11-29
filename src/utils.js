const mysql = require('mysql2/promise');

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
    SQLQuery: SQLQuery,
    getItemClasses: getItemClasses,
    getItemRaces: getItemRaces,
    getItemSlots: getItemSlots,
    getItemSize: getItemSize,
    getItemWeight: getItemWeight,
    drawLabelsAndValues: drawLabelsAndValues
}