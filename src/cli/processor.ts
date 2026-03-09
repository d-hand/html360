import os from "node:os";
import path from "node:path";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { pipeline, finished } from "node:stream/promises";
import pLimit from "p-limit";
import { Base64Encode } from "base64-stream";
import sharp from "sharp";
import { logger } from "./logger";
import { startProgressBar } from "./progress-bar";
import { silent } from "./utils";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function buildHtml360(imgPaths: string[]) {
  const errors: FileError[] = [];
  const templateInfo = await getTemplateHtmlInfo();

  const cpuCount = os.cpus().length;
  const threads = Math.max(1, cpuCount - 1);
  const limit = pLimit(threads);

  await startProgressBar(imgPaths.length, threads, async (incProgressBar) => {
    const tasks = imgPaths.map((imgPath) =>
      limit(async () => {
        const fileName = path.basename(imgPath);

        try {
          await processImage(imgPath, templateInfo);
        } catch (error) {
          errors.push({ fileName, error });
        } finally {
          incProgressBar(errors.length);
        }
      }),
    );
    await Promise.all(tasks);
  });

  errors.forEach(logFileError);
}

async function processImage(imgPath: string, template: TemplateHtmlInfo) {
  const htmlPath = getHtmlPath(imgPath);

  const fileHandle = await fs.open(htmlPath, "w");
  try {
    const writeStream = fileHandle.createWriteStream();

    // Нюанс template.prefix и data:image/webp;base64 очень маленький. Они точно попадут во внутренний буфер стрима.
    writeStream.write(template.prefix);
    writeStream.write("data:image/webp;base64,");

    const transformer = sharp(imgPath)
      .resize(8192, 4096, { fit: "inside" })
      .webp({ quality: 85 });

    await pipeline(transformer, new Base64Encode(), writeStream, {
      end: false,
    });

    writeStream.end(template.suffix);
    await finished(writeStream);
    await fileHandle.close();
  } catch (error) {
    await silent(() => fileHandle.close());
    await silent(() => fs.unlink(htmlPath));
    throw error;
  }
}

async function getTemplateHtmlInfo(): Promise<TemplateHtmlInfo> {
  const source = await fs.readFile(
    path.join(__dirname, "template.html"),
    "utf8",
  );
  const [prefix, suffix] = source.split("{{PANORAMA_DATA}}");

  return {
    source,
    prefix,
    suffix,
  };
}

function getHtmlPath(absoluteImgPath: string) {
  const outputDir = path.dirname(absoluteImgPath);
  const outputFileName = path.parse(absoluteImgPath).name + ".html";
  const finalPath = path.join(outputDir, outputFileName);
  return finalPath;
}

function logFileError({ fileName, error }: FileError) {
  const message = error instanceof Error ? error.message : String(error);
  logger.error(`Failed to process ${fileName}: ${message}`);
}

type FileError = {
  fileName: string;
  error: any;
};

type TemplateHtmlInfo = {
  source: string;
  prefix: string;
  suffix: string;
};
