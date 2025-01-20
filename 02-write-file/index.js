const fs = require("fs");
const path = require("path");
const {stdin, stdout, exit, stderr} = process;
const fileName = path.basename("text.txt");
const fileDir = path.dirname(__filename);
const filePath = path.join(fileDir, fileName);

const output = fs.createWriteStream(filePath);
output.on('error', (err) => {
  console.error("Error writing to file:", err.message);
  exit(1);
});


stdout.write("Hello! Please, input your text and press ENTER. To exit input 'exit' of press CTRL + C\n");
stdin.on("data", (chunk) => {
  if (chunk.toString().trim() === 'exit') {
    exit(0);
  } else {
    output.write(chunk);
  }
});
process.on("exit", (code) => {
  if (code === 0) {
    stdout.write("Thank you! Good luck!");
  } else {
    stderr.write(`Something went wrong. The program exited with code ${code}`);
  }
});
process.on('SIGINT', () => exit(0));