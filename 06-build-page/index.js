const fs = require("fs");
const path = require("path");

const projectDirPath = path.join(__dirname, "project-dist");
const templateFilePath = path.join(__dirname, "template.html");
const indexFilePath = path.join(projectDirPath, "index.html");
const stylesDirPath = path.join(path.dirname(__filename), "styles");
const stylesFilePath = path.join(projectDirPath, "style.css");
const oldDirPath = path.join(__dirname, "assets");
const newDirPath = path.join(__dirname, "project-dist", "assets");

async function removeDirectory(dirPath) {
  try {
    await fs.promises.rm(dirPath, { recursive: true, force: true });
    console.log(`Directory ${dirPath} was removed`);
  } catch (err) {
    console.error(`Error removing directory ${dirPath}:`, err.message);
  }
}
async function makeDirectory(newDirectoryPath) {
  const newDirCreation = await fs.promises.mkdir(newDirectoryPath, { recursive: true });
  console.log(`Directory ${newDirectoryPath} was created`);
  return newDirCreation;
};

async function processTemplate() {
  try {
    const templateContent = await fs.promises.readFile(templateFilePath, "utf-8");
    let data = templateContent;
    const pattern = /\{\{(.*?)\}\}/g;
    let match;

    while ((match = pattern.exec(data)) !== null) {
      const tagName = match[1];
      const componentFilePath = path.join(__dirname, 'components', `${tagName}.html`);
      try {
        const componentContent = await fs.promises.readFile(componentFilePath, "utf-8");
        data = data.replace(`{{${tagName}}}`, componentContent);
      } catch (err) {
        console.error(`Error reading component file ${componentFilePath}:`, err.message);
      }
    }

    await fs.promises.writeFile(indexFilePath, data);
    console.log(`Successfully created ${indexFilePath}`);
  } catch (err) {
    console.error("Error processing template:", err.message);
  }
}


// ------------- Compiles styles from the `styles` folder into a single file and places it in `project-dist/style.css`------------//

async function compileStyles() {
  try {
    const files = await fs.promises.readdir(stylesDirPath, { withFileTypes: true});
    const writeStream = fs.createWriteStream(stylesFilePath);
    for (const file of files) {
      if (!file.isDirectory() && path.extname(file.name) === ".css") {
        const sourceFilePath = path.join(stylesDirPath, file.name);
        const content = await fs.promises.readFile(sourceFilePath, "utf-8");
        writeStream.write(content);
      };
    };  
    writeStream.end();
    console.log(`Successfully created ${stylesFilePath}`); 
  } catch (err) {
    console.error("Error compiling styles:", err.message);
  }
};


// ---------------- Copies the `assets` folder into `project-dist/assets`---------------------//

async function copyFiles(sourceDir, destDir) {
  try {
    const items = await fs.promises.readdir(sourceDir, { withFileTypes: true });
    for (const item of items) {
      
      const sourceItemPath = path.join(sourceDir, item.name);
      const destItemPath = path.join(destDir, item.name);
      if (item.isDirectory()) {
        await fs.promises.mkdir(destItemPath, { recursive: true });
        console.log(`Directory ${item.name} was created`);
        await copyFiles(sourceItemPath, destItemPath); 
      } else if (item.isFile()) {
          await fs.promises.copyFile(sourceItemPath, destItemPath);
          console.log(`File ${item.name} was copied`);
      }
    }
  } catch (err) {
    console.error(`Error reading 'file' directory`, err.message);
  }
};


async function main() {
  try {
    await removeDirectory(projectDirPath);
    await makeDirectory(projectDirPath);
    await makeDirectory(newDirPath);
    await copyFiles(oldDirPath, newDirPath);
    await compileStyles();
    await processTemplate()
  } catch (err) {
      console.error("Error during project setup:", err.message);
  }
}
  
main().catch(console.error);



