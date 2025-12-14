const fs = require("node:fs");
const path = require("node:path");
const { createGzip } = require("node:zlib");
const { pipeline } = require("node:stream");
const filePath = path.resolve("./test.txt");
const fileZipPath = path.resolve("./test.txt.gz");
const destPath = path.resolve("./dest.txt");
const zip = createGzip();
/* /* task1 */
const readStream1 = fs.createReadStream(filePath, {
  encoding: "utf-8",
  highWaterMark: 12,
});

readStream1.on("data", (chunk) => {
  console.log({ chunk });
  readStream1.read(chunk);
  console.log("----------------------");
});

readStream1.on("close", () => {
  console.log("----------------------");
  console.log("finsh reading file");
  console.log("----------------------");
});
readStream1.on("error", (err) => {
  console.error(err);
});

/* /* /* task2 */
const writeStream = fs.createWriteStream(destPath);

readStream1.pipe(writeStream);
writeStream.on("finish", () => {
  console.log("the copy is done");
});

/* task3 */
const writeZipStream = fs.createWriteStream(fileZipPath);
readStream1.pipe(zip).pipe(writeZipStream);
