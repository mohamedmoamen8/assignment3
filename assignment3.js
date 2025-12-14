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

readStream1.on("data", (chunk) => {
  writeStream.write(chunk);
});

readStream1.on("end", () => {
  writeStream.end();
  console.log("File copy is done");
});

readStream1.on("error", (err) => {
  console.error(err);
});
/* task3 */
const writeZipStream = fs.createWriteStream(fileZipPath);
readStream1.pipe(zip).pipe(writeZipStream);
readStream1.pipe(writeStream);
/*  essay questions */
/* 1 event loop is mechanism in node.js perform non blocking operations even if it running in single thread and it enables node js to handle many requests */
/* 2 the libuv is a c library used by node to handle async opraetions like file system abd help node to work across diffrent os async */
/* 3 send the files to libuv than excute it in the thread or the os and palce it in the event queue than exucute the callback when the stack is empty
/* 4 call stack excute synchorous java script code --- event queue store the callback to be eceute like waiting place--event loop move the call back form the queue to the stack*/
/* 5 the thread pool is used by libuv and it like control how many thread work even if node is single thread the defult is 4  UV-THREADPOOL_SIZE=8 main.js */
/* 6 the blocking stop the event loop to delay exceution --- the non blocking is runs asynchronously */