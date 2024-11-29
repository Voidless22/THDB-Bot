const { createCanvas, Image } = require('canvas');
const { AttachmentBuilder } = require('discord.js')
const { readFile } = require('fs/promises');
const utils = require('../utils')
function drawCornerTriangles(canvas, size, color) {
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    // Set a fill style
    ctx.fillStyle = color;

    // Top-left corner
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(size, 0);
    ctx.lineTo(0, size);
    ctx.closePath();
    ctx.fill();

    // Top-right corner
    ctx.beginPath();
    ctx.moveTo(width, 0);
    ctx.lineTo(width - size, 0);
    ctx.lineTo(width, size);
    ctx.closePath();
    ctx.fill();

    // Bottom-left corner
    ctx.beginPath();
    ctx.moveTo(0, height);
    ctx.lineTo(0, height - size);
    ctx.lineTo(size, height);
    ctx.closePath();
    ctx.fill();

    // Bottom-right corner
    ctx.beginPath();
    ctx.moveTo(width, height);
    ctx.lineTo(width - size, height);
    ctx.lineTo(width, height - size);
    ctx.closePath();
    ctx.fill();
}
function drawTitlebar(canvas, yPos, title) {
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;
    ctx.strokeStyle = '#c9bd85';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(0, yPos);
    ctx.lineTo(width, yPos)
    ctx.closePath();
    ctx.stroke();

    ctx.textAlign = "center";


    let fontSize = 64;
    let font = `${fontSize}px Times New Roman`
    ctx.font = font;

    if (ctx.measureText(title).width >= width) {
        fontSize -= 10;
        font = `${fontSize}px Times New Roman`
    }
    ctx.font = font;
    ctx.fillText(title, (width / 2), 56);

}

async function drawItemInfo(canvas, data) {
    const ctx = canvas.getContext("2d");

    let itemClasses = utils.getItemClasses(data.classes);
    let itemRaces = utils.getItemRaces(data.races);
    let itemSlots = utils.getItemSlots(data.slots);
    let itemSize = utils.getItemSize(data.size);
    let itemWeight = utils.getItemWeight(data.weight);

    let descriptorText = '';

    const sizeSectionXLeft = 150;
    const sizeSectionXRight = 455;
    const sizeSectionStartY = 465;

    const genStatsXLeft = 555;
    const genStatsXRight = 870;
    const genStatsStartY = 465;

    const statsXLeft = 150;
    const statsXRight = 455;
    const statsStartY = 740;

    const heroicStatsXLeft = 465;

    const resistsXLeft = 555;
    const resistsXRight = 870;
    const resistsStartY = 800;

    const heroicResistsXLeft = 875;

    const modStatsXLeft = 1100;
    const modStatsXRight = 1415;
    const modStatsStartY = 740;
    const weaponInfoSection = {
        
    }
    const sizeSection = [
        { label: "Size:", value: itemSize },
        { label: "Weight:", value: itemWeight },

    ].filter(entry => entry.value !== 0);
    const genericStats = [
        { label: "AC:", value: data.ac },
        { label: "HP:", value: data.hp },
        { label: "Mana:", value: data.mana },
        { label: "End:", value: data.endur },
        { label: "Haste:", value: data.haste }
    ].filter(entry => entry.value !== 0);
    const statSection = [
        { label: "Strength:", value: data.astr },
        { label: "Stamina:", value: data.asta },
        { label: "Intelligence:", value: data.aint },
        { label: "Wisdom:", value: data.awis },
        { label: "Agility:", value: data.aagi },
        { label: "Dexterity:", value: data.adex },
        { label: "Charisma:", value: data.acha },
    ].filter(entry => entry.value !== 0);
    const heroicStatSection = [
        { label: `+${data.heroic_str}` },
        { label: `+${data.heroic_sta}` },
        { label: `+${data.heroic_int}` },
        { label: `+${data.heroic_wis}` },
        { label: `+${data.heroic_agi}` },
        { label: `+${data.heroic_dex}` },
        { label: `+${data.heroic_cha}` },
    ].filter(entry => entry.label !== '+0');
    const resists = [
        { label: "Magic:", value: data.mr },
        { label: "Fire:", value: data.fr },
        { label: "Cold:", value: data.cr },
        { label: "Disease:", value: data.dr },
        { label: "Poison:", value: data.pr },
        { label: "Corruption:", value: data.svcorruption },
    ].filter(entry => entry.value !== 0);
    const heroicResists = [
        { label: `+${data.heroic_mr}` },
        { label: `+${data.heroic_fr}` },
        { label: `+${data.heroic_cr}` },
        { label: `+${data.heroic_dr}` },
        { label: `+${data.heroic_pr}` },
        { label: `+${data.heroic_svcorrup}` }
    ].filter(entry => entry.label !== '+0');

    const modStats = [
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
    ].filter(entry => entry.value !== 0 && entry.value !== '0');

    ctx.strokeStyle = '#c9bd85';
    ctx.lineWidth = 6;
    ctx.strokeRect(50, 420, canvas.width - 100, canvas.height - 460);

    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = "left";
    ctx.font = `48px Times New Roman`;

    ctx.fillText(data.Name, 235, 180);

    ctx.font = `40px Times New Roman`;
    if (data.magic === 1) descriptorText = descriptorText + 'Magic |';
    if (data.attuneable === 1) descriptorText = descriptorText + ' Attunable |';
    if (data.questitemflag === 1) descriptorText = descriptorText + ' Quest Item |';

    ctx.fillText(descriptorText, 240, 230)

    ctx.fillText(`Classes: ${itemClasses.join(' ')}`, 240, 275);
    ctx.fillText(`Races: ${itemRaces.join(' ')}`, 240, 320);
    ctx.fillText(`${itemSlots.join(' ')}`, 240, 365);

    utils.drawLabelsAndValues(ctx, sizeSection, sizeSectionXLeft, sizeSectionXRight, sizeSectionStartY, 50)
    utils.drawLabelsAndValues(ctx, genericStats, genStatsXLeft, genStatsXRight, genStatsStartY, 60);
    utils.drawLabelsAndValues(ctx, statSection, statsXLeft, statsXRight, statsStartY, 60);
    utils.drawLabelsAndValues(ctx, resists, resistsXLeft, resistsXRight, resistsStartY, 60);
    utils.drawLabelsAndValues(ctx, modStats, modStatsXLeft, modStatsXRight, modStatsStartY, 60);

    ctx.fillStyle = '#c9bd85';
    ctx.font = `34px Times New Roman`;

    utils.drawLabelsAndValues(ctx, heroicStatSection, heroicStatsXLeft, null, (statsStartY + 4), 60);
    utils.drawLabelsAndValues(ctx, heroicResists, heroicResistsXLeft, null, (resistsStartY + 4), 60);


    ctx.fillStyle = '#FFFFFF';
    ctx.font = `40px Times New Roman`;

}

async function drawItemIcon(canvas, xPos, yPos, iconId) {
    const context = canvas.getContext('2d');
    const itemIcon = new Image();
    itemIcon.onload = async () => {
        console.log('image loaded');
        context.drawImage(itemIcon, 64, 128, 160, 160);

    };
    itemIcon.onerror = async () => {
        console.log("error loading image");
    };

    itemIcon.src = `./textures/${iconId}.png`;

}
async function drawBG(interaction, queryInfo) {
    const canvas = createCanvas(1600, 2560);
    const context = canvas.getContext('2d');
    context.fillStyle = "#111421";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = '#c9bd85';
    context.lineWidth = 12;
    context.strokeRect(0, 0, canvas.width, canvas.height);

    drawCornerTriangles(canvas, 64, "#998d00")
    drawTitlebar(canvas, 72, queryInfo[0].Name);
    drawItemIcon(canvas, 0, 0, queryInfo[0].icon);
    drawItemInfo(canvas, queryInfo[0]);
    const attachment = new AttachmentBuilder(canvas.toBuffer('image/png'), { name: 'profile-image.png' });
    interaction.reply({ files: [attachment] });
}

module.exports = {
    drawBG: drawBG
}