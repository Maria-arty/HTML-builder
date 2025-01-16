const fs = require("fs")
const path = require("path")
const {stdin, stdout, exit, stderr} = process
const fileName = path.basename("text.txt");
const fileDir = path.dirname(__filename)
const filePath = path.join(fileDir, fileName)
const output = fs.createWriteStream(filePath)
