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

    let descriptorText = '';
    const leftColumnX = 150;
    const leftColumnWidth = 455;
    const topLeftColumnY = 465;
    const midLeftColumnY = 740;

    const centerColX = 580;
    const centerColY = 465;
    const centerColWidth = 905;

    const rightColumnX = 1100;
    const rightColumnWidth = 1415;
    const rightColumnY = 740;


    canvasUtils.drawStrokedRect(context, 50, 420, (canvas.width - 100), (canvas.height - 460), "#c9bd85", 6);
    canvasUtils.drawText(canvas, data.Name, "48", "Times New Roman", "left", 235, 180, "#FFFFFF");

    canvasUtils.drawText(canvas, descriptorText, "40", "Times New Roman", "left", 240, 230, "#FFFFFF");
    canvasUtils.drawText(canvas, `Classes: ${itemClasses.join(' ')}`, "40", "Times New Roman", "left", 240, 275, "#FFFFFF");
    canvasUtils.drawText(canvas, `Races: ${itemRaces.join(' ')}`, "40", "Times New Roman", "left", 240, 320, "#FFFFFF");
    canvasUtils.drawText(canvas, `${itemSlots.join(' ')}`, "40", "Times New Roman", "left", 240, 365, "#FFFFFF");

    utils.drawLabelsAndValues(canvas, utils.getSectionObject("Size", data), leftColumnX, leftColumnWidth, topLeftColumnY, 50)
    utils.drawLabelsAndValues(canvas, utils.getSectionObject("Stats", data), leftColumnX, leftColumnWidth, midLeftColumnY, 60);
    utils.drawLabelsAndValues(canvas, utils.getSectionObject("Generic", data), centerColX, centerColWidth, centerColY, 60);
    utils.drawLabelsAndValues(canvas, utils.getSectionObject("Resists", data), centerColX, centerColWidth, centerColY, 60);
    utils.drawLabelsAndValues(canvas, utils.getSectionObject("modStats", data), rightColumnX, rightColumnWidth, rightColumnY, 60);

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

    const attachment = new AttachmentBuilder(canvas.toBuffer('image/png'), { name: 'profile-image.png' });
    interaction.reply({ files: [attachment] });
}


module.exports = {
    drawItemImage: drawItemImage
}