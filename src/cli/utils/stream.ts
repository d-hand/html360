import fs from "node:fs";
import { once } from 'events';

export async function writeAsync(stream: fs.WriteStream, chunk: string | Buffer) {
  const canContinue = stream.write(chunk);

  if (!canContinue) {
    await Promise.race([
      once(stream, 'drain'),
      once(stream, 'error').then(([err]) => { throw err; })
    ]);
  }
}