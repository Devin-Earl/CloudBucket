require("dotenv").config();
const { Storage } = require("@google-cloud/storage");
const fs = require("fs");
const path = require("path");

const storage = new Storage({
  projectId: process.env.GCP_PROJECT_ID,
  keyFilename: process.env.GCP_KEYFILE_PATH,
});

const outputDir = "./output";
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

async function downloadGCSFile(bucket, key, outputFileName) {
  const file = storage.bucket(bucket).file(key);
  try {
    const [response] = await file.download();

    const outputFilePath = path.join(outputDir, outputFileName);
    fs.writeFileSync(outputFilePath, response);
    console.log(`File downloaded to ${outputFilePath}`);
  } catch (err) {
    console.error(`Error downloading file ${key}: ${err.message}`);
  }
}

async function downloadGCSFolder(bucket, prefix) {
  const options = {
    prefix: prefix,
  };

  try {
    const [files] = await storage.bucket(bucket).getFiles(options);

    for (const file of files) {
      const outputFileName = file.name.split("/").pop();
      const outputFilePath = path.join(outputDir, outputFileName);
      await downloadGCSFile(bucket, file.name, outputFileName);
    }
    console.log(`Folder downloaded to ${outputDir}`);
  } catch (err) {
    console.error(`Error downloading folder ${prefix}: ${err.message}`);
  }
}

async function downloadGCSBucket(bucket) {
  const [files] = await storage.bucket(bucket).getFiles();

  for (const file of files) {
    const outputFileName = file.name.split("/").pop();
    const outputFilePath = path.join(outputDir, outputFileName);
    await downloadGCSFile(bucket, file.name, outputFileName);
  }
  console.log(`Bucket downloaded to ${outputDir}`);
}

async function gcpDownload(program) {
  try {
    const bucket =
      program.bucket || (await ask("Please enter the GCS bucket name: "));
    const type = program.file ? "file" : program.folder ? "folder" : "bucket";

    switch (type) {
      case "file": {
        const key = program.file;
        const outputFileName = path.basename(key);
        await downloadGCSFile(bucket, key, outputFileName);
        break;
      }
      case "folder": {
        const prefix = program.folder;
        await downloadGCSFolder(bucket, prefix);
        break;
      }
      default: {
        await downloadGCSBucket(bucket);
      }
    }
  } catch (err) {
    console.error(`Error downloading from GCS: ${err.message}`);
  }
}

function ask(question) {
  return new Promise((resolve, reject) => {
    const readline = require("readline").createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    readline.question(question, (answer) => {
      readline.close();
      resolve(answer);
    });
  });
}

module.exports = googleDownload;
