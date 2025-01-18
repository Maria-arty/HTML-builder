
const fs = require("fs");
const path = require("path");
const stylesDirPath = path.join(path.dirname(__filename), "styles");
const projectDirPath = path.join(path.dirname(__filename), "project-dist");
const bundleFilePath = path.join(projectDirPath, "bundle.css");

const writeStream = fs.createWriteStream(bundleFilePath);


fs.readdir(stylesDirPath, { withFileTypes: true},(err, files) => {
  if (err) {
    console.error("Error reading directory:", err);
    return;
  } 
  files.forEach(file => {
    if (!file.isDirectory() && path.extname(file.name) === ".css") {
      const sourceFilePath = path.join(stylesDirPath, file.name);
      const readStream = fs.createReadStream(sourceFilePath, "utf-8");
      readStream.on("data", (chunk) => {
        writeStream.write(chunk);
      });
      readStream.on("end", () => {
        console.log(`Finished reading ${file.name}`);
      });
      readStream.on("error", (error) => {
        console.log(`Finished reading ${file.name}`, error.message);
      });
    } 
  });
});
writeStream.on("finish", () => {
  console.log("Finished writing bundle.css");
});

writeStream.on("error", error => {
  console.error("Error writing to bundle.css:", error.message);
});


