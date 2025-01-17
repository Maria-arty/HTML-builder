const fs = require("fs");
const path = require("path");
const dirName = path.basename("secret-folder");
const dirDir = path.dirname(__filename)
const dirPath = path.join(dirDir, dirName)

fs.readdir(dirPath, 
  { withFileTypes: true },
  (err, files) => {
  // console.log("\nCurrent directory files:");
  if (err)
    console.log(err);
  else {
    files.forEach(file => {
      if (!file.isDirectory()) {
        const filePath = path.join(dirPath, file.name)
        fs.stat(filePath, (err, stats) => {
          if (err) {
            console.error(err);
          } else { 
            const fileSize = stats.size / 1000
            const fileName = path.parse(filePath).name
            const fileExt = path.extname(filePath).slice(1)
            console.log(`${fileName} - ${fileExt} - ${fileSize}kb`)
          }
        })
      }
    })
  }
})


