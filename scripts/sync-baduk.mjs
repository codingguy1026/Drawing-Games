import { copyFile, mkdir, readFile } from "node:fs/promises";

const files = ["index.html", "engine.js", "ui.js", "style.css"];
const check = process.argv.includes("--check");
const source = new URL("../games/baduk-park/", import.meta.url);
const destination = new URL("../public/baduk-park/", import.meta.url);
if (!check) await mkdir(destination, { recursive: true });
for (const file of files) {
  if (check) {
    const [original, served] = await Promise.all([readFile(new URL(file, source)), readFile(new URL(file, destination))]);
    if (!original.equals(served)) throw new Error(`Baduk public copy is stale: ${file}. Run npm run baduk:sync.`);
  } else await copyFile(new URL(file, source), new URL(file, destination));
}
console.log(check ? "Baduk served assets match source." : "Baduk assets synced (legacy untouched).");
