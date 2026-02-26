const fs = require("fs").promises;
const path = require("path");
const pngToIco = require("png-to-ico");
const sharp = require("sharp");

async function build() {
  console.log("🏗️  Building html360...");

  const srcPath = path.join(__dirname, "../src");
  const distPath = path.join(__dirname, "../dist");
  const svgPath = path.join(__dirname, "../src/html360.svg");
  const icoPath = path.join(distPath, "html360.ico");
  const libPath = path.dirname(require.resolve("pannellum"));

  const [favicon, icoBuffer, pannellumJs, pannellumCss, rawTemplate] =
    await Promise.all([
      getSvgDataUri(svgPath),
      createIcoBufferFromSvg(svgPath),
      fs.readFile(path.join(libPath, "pannellum.js"), "utf8"),
      fs.readFile(path.join(libPath, "pannellum.css"), "utf8"),
      fs.readFile(path.join(srcPath, "template.html"), "utf8"),
    ]);

  const compiledTemplate = rawTemplate
    .replace("{{FAVICON}}", favicon)
    .replace("{{PANNELLUM_JS}}", pannellumJs)
    .replace("{{PANNELLUM_CSS}}", pannellumCss);

  await fs.rm(distPath, { recursive: true, force: true });

  await fs.mkdir(distPath);

  await fs.writeFile(path.join(distPath, "template.html"), compiledTemplate);

  await copyJsFiles(srcPath, distPath);

  await fs.copyFile(
    path.join(srcPath, "menu.bat"),
    path.join(distPath, "menu.bat"),
  );

  await fs.writeFile(icoPath, icoBuffer);

  console.log("✅ Build complete.");
}

async function getSvgDataUri(svgPath) {
  const svgRaw = await fs.readFile(svgPath, "utf8");
  const svgMinified = svgRaw.replace(/\s+/g, " ").trim();
  return `data:image/svg+xml,${encodeURIComponent(svgMinified)}`;
}

async function createIcoBufferFromSvg(svgPath) {
  const pngBuffer = await sharp(svgPath).resize(256, 256).png().toBuffer();
  return await pngToIco(pngBuffer);
}

async function copyJsFiles(sourceDir, destDir) {
  const files = await fs.readdir(sourceDir);

  for (const file of files) {
    if (path.extname(file) === ".js") {
      const sourcePath = path.join(sourceDir, file);
      const destPath = path.join(destDir, file);
      await fs.copyFile(sourcePath, destPath);
    }
  }
}

build();
