require("dotenv").config();
const AWS = require("aws-sdk");
const fs = require("fs");
const path = require("path");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS,
});

const uploadS3File = async (bucket, key, inputFilePath) => {
  const params = {
    bucket: bucket,
    key: key,
    body: fs.readFile(inputFilePath),
  };
  try {
    await s3.putObject(params).promise();
    console.log(`File Uploaded to s3://${bucket}/${key}`);
  } catch (err) {
    console.error(`Error uploading file ${key}:${err.message}`);
  }
};
const uploadS3Folder = async (bucket, prefix, inputDirPath) => {
  try {
    const files = fs.readdirSync(inputDirPath);
    for (const file of files) {
      const inputFilePath = path.join(inputDirPath, file);
      const key = prefix + "/" + file;
      await uploadS3File(bucket, key, inputFilePath);
    }
    console.log(`Folder uploaded to s3://${bucket}/${prefix}`);
  } catch (err) {
    console.error(`Error uploading folder ${prefix}: ${err.message}`);
  }
};
async function awsUpload(program) {
  try {
    const bucket =
      program.bucket || (await ask("Please enter the S3 bucket name: "));
    const type = program.file ? "file" : program.folder ? "folder" : "bucket";
    const inputPath =
      program.input ||
      (await ask("Please enter the input file or folder path: "));

    switch (type) {
      case "file": {
        const key = program.file;
        await uploadS3File(bucket, key, inputPath);
        break;
      }
      case "folder": {
        const prefix = program.folder;
        await uploadS3Folder(bucket, prefix, inputPath);
        break;
      }
      default: {
        await uploadS3File(bucket, key, inputPath);
      }
    }
  } catch (err) {
    console.error(`Error uploading to S3: ${err.message}`);
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

module.exports = awsUpload;
