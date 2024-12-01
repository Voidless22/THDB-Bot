const { createCanvas, Image } = require('canvas');
const { AttachmentBuilder } = require('discord.js')
const { readFile } = require('fs/promises');
const utils = require('../utils')
const canvasUtils = require('./canvasUtils')

function drawTitlebar(canvas, yPos, title) {
    const context = canvas.getContext("2d");
    const width = canvas.width;
    context.strokeStyle = '#c9bd85';
    context.lineWidth = 6;
    context.beginPath();
    context.moveTo(0, yPos);
    context.lineTo(width, yPos)
    context.closePath();
    context.stroke();

    canvasUtils.drawText(canvas, title, "64", "Times New Roman", "center", (width / 2), 56, "#998d00", true, 10);
}

async function drawItemInfo(canvas, data) {
    const context = canvas.getContext("2d");
    let itemClasses = utils.getItemClasses(data.classes);
    let itemRaces = utils.getItemRaces(data.races);
    let itemSlots = utils.getItemSlots(data.slots);
    let itemDeities = utils.getItemDiety(data.deity);
    let normalFontSize = 48;
    let heroicFontSize = 42

    let descriptorText = '';
    const midColumnY = 920;
    const topColumnY = 500;
    const leftColumnX = 150;
    const leftColumnWidth = 455;
    const centerColX = 650;
    const centerColWidth = 915;
    const rightColumnX = 1100;
    const rightColumnWidth = 1460;

    let flagTxt = [];
    if (data.magic === 1) flagTxt.push('Magic'); 
    if (data.attuneable === 1) flagTxt.push('Attunable');
    if (data.questitemflag === 1) flagTxt.push('Quest'); 

    if (data.deity != 0) {
         flagTxt.push(itemDeities.join('')); 
    } 
    flagTxt.push(utils.getItemType(data.itemtype))

    canvasUtils.drawStrokedRect(context, 50, 420, (canvas.width - 100), (canvas.height - 460), "#c9bd85", 6);
    canvasUtils.drawText(canvas, data.Name, 52, "Times New Roman", "left", 235, 180, "#FFFFFF");

    canvasUtils.drawText(canvas, flagTxt.join(' | '), normalFontSize, "Times New Roman", "left", 240, 230, "#FFFFFF");
    canvasUtils.drawText(canvas, `Classes: ${itemClasses.join(' ')}`, normalFontSize, "Times New Roman", "left", 240, 275, "#FFFFFF");
    canvasUtils.drawText(canvas, `Races: ${itemRaces.join(' ')}`, normalFontSize, "Times New Roman", "left", 240, 320, "#FFFFFF");
    canvasUtils.drawText(canvas, `${itemSlots.join(' ')}`, normalFontSize, "Times New Roman", "left", 240, 365, "#FFFFFF");

    utils.drawLabelsAndValues(canvas, utils.getSectionObject("Size", data), leftColumnX, leftColumnWidth, topColumnY, 60, normalFontSize, heroicFontSize)
    utils.drawLabelsAndValues(canvas, utils.getSectionObject("Stats", data), leftColumnX, leftColumnWidth, midColumnY, 60, normalFontSize, heroicFontSize);
    utils.drawLabelsAndValues(canvas, utils.getSectionObject("Weapon", data), rightColumnX, rightColumnWidth, topColumnY, 60, normalFontSize, heroicFontSize)

    utils.drawLabelsAndValues(canvas, utils.getSectionObject("Generic", data), centerColX, centerColWidth, topColumnY, 60, normalFontSize, heroicFontSize);
    utils.drawLabelsAndValues(canvas, utils.getSectionObject("Resists", data), centerColX, centerColWidth, midColumnY, 60, normalFontSize, heroicFontSize);
    utils.drawLabelsAndValues(canvas, utils.getSectionObject("modStats", data), rightColumnX, rightColumnWidth, midColumnY, 60, normalFontSize, heroicFontSize);
    utils.drawAugSlots(canvas, utils.getSectionObject("Augs", data), 128, 1325, 48, 90);

}


function drawBG(context, width, height) {
    canvasUtils.drawFilledRect(context, 0, 0, width, height, "#111421");
    canvasUtils.drawStrokedRect(context, 0, 0, width, height, "#c9bd85", 12);
}

async function drawItemImage(interaction, data) {
    const canvas = createCanvas(1600, 2560);
    const context = canvas.getContext('2d');

    drawBG(context, canvas.width, canvas.height);
    canvasUtils.drawCornerTriangles(canvas, 64, "#998d00")
    drawTitlebar(canvas, 72, data.Name);
    canvasUtils.drawTexture(context, 64, 128, 128, 128, data.icon)
    drawItemInfo(canvas, data);

    const attachment = new AttachmentBuilder(await canvas.toBuffer('image/png'), { name: 'profile-image.png' });
    await interaction.reply({ files: [attachment] });
}


module.exports = {
    drawItemImage: drawItemImage
}