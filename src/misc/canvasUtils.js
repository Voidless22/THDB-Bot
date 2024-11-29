const { createCanvas, Image } = require('canvas');
const { AttachmentBuilder } = require('discord.js')
const { readFile } = require('fs/promises');


function drawFilledRect(context, posX, posY, sizeX, sizeY, color) {
    let priorFillStyle = context.fillStyle;
    console.log(priorFillStyle);
    context.fillStyle = color;
    context.fillRect(posX, posY, sizeX, sizeY);
    context.fillStyle = priorFillStyle;

}

function drawStrokedRect(context, posX, posY, sizeX, sizeY, color, lineWidth) {
    let priorStrokeStyle = context.strokeStyle;
    let priorLineWidth = context.lineWidth;
    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    context.strokeRect(posX, posY, sizeX, sizeY);
    context.strokeStyle = priorStrokeStyle;
    context.lineWidth = priorLineWidth;
}

async function drawTexture(context, xPos, yPos, sizeX, sizeY, texName) {
    const texture = new Image();
    texture.onload = async () => {
        context.drawImage(texture, xPos, yPos, sizeX, sizeY);

    };
    texture.onerror = async () => {
        console.log("error loading image");
    };

    texture.src = `./textures/${texName}.png`;

}
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

function drawText(canvas, text, fontSize, fontName, alignment, xPos, yPos, color, scaleToCanvas, scaleRatio) {
    // ctx.textAlign = "center";
    let context = canvas.getContext('2d');
    context.textAlign = alignment;
    context.font = `${fontSize}px ${fontName}`;
    context.fillStyle = color;
    // let fontSize = 64;
    //let font = `${fontSize}px Times New Roman`
    //ctx.font = font;

    if (scaleToCanvas && context.measureText(text).width >= canvas.width) {
        context.font = `${fontSize - scaleRatio}px ${fontName}`;
    }
    context.fillText(text, xPos, yPos);
}
module.exports = {
    drawFilledRect: drawFilledRect,
    drawStrokedRect: drawStrokedRect,
    drawTexture: drawTexture,
    drawCornerTriangles: drawCornerTriangles,
    drawText: drawText
};