import c from "ansi-colors";
import { toMB } from "./utils";

const INFO = c.cyan("[INFO]:");
const OK = c.green.bold("[OK]:");
const ERROR = c.red.bold("[ERROR]:");

export const logger = {
  info: (msg: string) => console.log(`${INFO} ${c.cyan(msg)}`),

  success: (msg: string) => console.log(`${OK} ${c.green(msg)}`),

  error: (err: any) => {
    if (typeof err === "string") {
      console.error(`${ERROR} ${c.red(err)}`);
    } else {
      console.error(`${ERROR}\n`, err);
    }
  },

  logMemory: (label: string) => {
    const memory = process.memoryUsage();
    console.log(`\n--- ${label} ---`);

    // RSS (Resident Set Size) — Общий объем памяти, выделенный процессом в системе. Это именно то, что видно в диспетчере задач.
    console.log(`RSS: ${toMB(memory.rss)} MB`);

    // HeapUsed - сколько реально занято объектами в JS
    console.log(`Heap Used: ${toMB(memory.heapUsed)} MB`);

    // Внутренние буферы Node.js (ArrayBuffers). Живут отдельно, в куче только ссылки, НО ВХОДЯТ В ЛИМИТЫ КУЧИ 
    console.log(`ArrayBuffers: ${toMB(memory.arrayBuffers)} MB`);

    // Память "вне кучи" (C++ объекты, Sharp, нативные буферы)
    console.log(`External: ${toMB(memory.external)} MB`);
  },
};
