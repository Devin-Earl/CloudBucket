require("dotenv").config();
const { Storage } = require("@google-cloud/storage");
const fs = require("fs");
const path = require("path");

const storage = new Storage({
  projectId: process.env.GCLOUD_PROJECT_ID,
  keyFilename: process.env.GCLOUD_KEYFILE_PATH,
});

const uploadGCSFile = async (bucketName, key, inputFilePath) => {
  const bucket = storage.bucket(bucketName);
  const file = bucket.file(key);
  try {
    await file.save(fs.createReadStream(inputFilePath));
    console.log(`File uploaded to gs://${bucketName}/${key}`);
  } catch (err) {
    console.error(`Error uploading file ${key}: ${err.message}`);
  }
};

const uploadGCSFolder = async (bucketName, prefix, inputDirPath) => {
  const bucket = storage.bucket(bucketName);
  try {
    const files = fs.readdirSync(inputDirPath);
    for (const file of files) {
      const inputFilePath = path.join(inputDirPath, file);
      const key = prefix + "/" + file;
      await uploadGCSFile(bucketName, key, inputFilePath);
    }
    console.log(`Folder uploaded to gs://${bucketName}/${prefix}`);
  } catch (err) {
    console.error(`Error uploading folder ${prefix}: ${err.message}`);
  }
};

async function gcsUpload(program) {
  try {
    const bucketName =
      program.bucket || (await ask("Please enter the GCS bucket name: "));
    const type = program.file ? "file" : program.folder ? "folder" : "bucket";
    const inputPath =
      program.input ||
      (await ask("Please enter the input file or folder path: "));

    switch (type) {
      case "file": {
        const key = program.file;
        await uploadGCSFile(bucketName, key, inputPath);
        break;
      }
      case "folder": {
        const prefix = program.folder;
        await uploadGCSFolder(bucketName, prefix, inputPath);
        break;
      }
      default: {
        const key = path.basename(inputPath);
        await uploadGCSFile(bucketName, key, inputPath);
      }
    }
  } catch (err) {
    console.error(`Error uploading to GCS: ${err.message}`);
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

module.exports = googleUpload;
