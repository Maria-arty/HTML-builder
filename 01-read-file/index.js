const fs = require("fs");
const path = require("path");
const fileName = path.basename("text.txt");
const fileDir = path.dirname(__filename)
const filePath = path.join(fileDir, fileName)

const stream = fs.createReadStream(filePath, "utf-8");

let data = "";

stream.on("data", (chunk) => (data += chunk));
stream.on("end", () => console.log(data));
stream.on("error", (error) => console.log("Error", error.message));




