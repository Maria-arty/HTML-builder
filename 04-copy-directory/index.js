const { error } = require("console");
const fs = require("fs");
const path = require("path");
const oldDirPath = path.join(__dirname, "files")
const newDirPath = path.join(__dirname, "files-copy")

async function makeDirectory() {
  const newDirCreation = await fs.promises.mkdir(newDirPath, { recursive: true });
  return newDirCreation;
}

makeDirectory().catch(console.error)

async function copyFiles() {
  try {
    const files = await fs.promises.readdir(oldDirPath)
    for (const file of files) {
      const sourceFilePath = path.join(oldDirPath, file)
      const destFilePath = path.join(newDirPath, file)
      try {
        await fs.promises.copyFile(sourceFilePath, destFilePath, fs.constants.COPYFILE_FICLONE)
        console.log(`The file ${file} was copied`)
      } catch (err) {
        console.error(`The file ${file} could not be copied`, err.message)
      }
    }
  } catch (err) {
    console.error(`Error reading 'file' directory`, err.message)
  }
}

copyFiles().catch(console.error)

async function newDirItemsCheck() {
  const newDirItems = await fs.promises.readdir(newDirPath, { withFileTypes: true })
  const oldDirItems = await fs.promises.readdir(oldDirPath, { withFileTypes: true });
  for (const item of newDirItems) {
    const newItemPath = path.join(newDirPath, item.name)
    const oldItemPath = path.join(oldDirPath, item.name)
    if (!oldDirItems.some((i) => i.name === item.name)) {
      fs.promises.unlink(newItemPath)
    }
  }
}

newDirItemsCheck().catch(console.error)




