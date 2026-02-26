const { red, bgCyan, cyan } = require("ansi-colors");
const cliProgress = require("cli-progress");
const fs = require("fs").promises;
const path = require("path");
const sharp = require("sharp");
const { logger } = require("./logger");

async function buildHtml360(imgPaths) {
  try {
    await build(imgPaths);
  } catch (err) {
    logger.error(err);
  }
}

async function build(imgPaths) {
  const errors = [];
  const templateHtml = await fs.readFile(path.join(__dirname, "template.html"), "utf8");
  const progressBar = buildProgressBar();

  progressBar.start(imgPaths.length, 0, { errors: 0 });

  for (const imgPath of imgPaths) {
    const fileName = path.basename(imgPath);

    try {
      await processImage(imgPath, templateHtml);
    } catch (error) {
      errors.push({ fileName, error });
    } finally {
      progressBar.increment({ errors: errors.length });
    }
  }

  progressBar.stop();

  errors.forEach(({ fileName, error }) => {
    logger.error(`Failed to process ${fileName}: ${error.message}`);
  });
}

async function processImage(imgPath, templateHtml) {
  const absoluteImgPath = path.resolve(imgPath);

  const webpBuffer = await sharp(absoluteImgPath)
    .resize(8192, 4096, { fit: "inside", transform: true })
    .webp({ quality: 85 })
    .toBuffer();

  const base64Image = `data:image/webp;base64,${webpBuffer.toString("base64")}`;

  const html = templateHtml.replace("{{PANORAMA_DATA}}", base64Image);

  const resultFileName = getResultFileName(absoluteImgPath);
  await fs.writeFile(resultFileName, html);
}

function getResultFileName(absoluteImgPath) {
  const outputDir = path.dirname(absoluteImgPath);
  const outputFileName = path.parse(absoluteImgPath).name + ".html";
  const finalPath = path.join(outputDir, outputFileName);
  return finalPath;
}

function buildProgressBar() {
  return new cliProgress.SingleBar({
    format: `${bgCyan.black(" html360 ")} |${cyan("{bar}")}| ${cyan("{percentage}%")} | ${cyan("{value}/{total} Files")} | ${red("{errors} Errors")}`,
    barCompleteChar: "\u2588",
    barIncompleteChar: "\u2591",
    hideCursor: true,
  });
}

module.exports = {
  buildHtml360,
};
