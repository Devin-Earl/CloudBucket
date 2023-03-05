require("dotenv").config();
const AWS = require("aws-sdk");
const fs = require("fs");
const path = require("path");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const outputDir = "./output";
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

async function downloadS3File(bucket, key, outputFileName) {
  const params = {
    Bucket: bucket,
    Key: key,
  };
  try {
    const response = await s3.getObject(params).promise();

    const outputFilePath = path.join(outputDir, outputFileName);
    fs.writeFileSync(outputFilePath, response.Body);
    console.log(`File downloaded to ${outputFilePath}`);
  } catch (err) {
    console.error(`Error downloading file ${key}: ${err.message}`);
  }
}

async function downloadS3Folder(bucket, prefix) {
  const params = {
    Bucket: bucket,
    Prefix: prefix,
  };

  try {
    const response = await s3.listObjectsV2(params).promise();

    const keys = response.Contents.map((obj) => obj.Key);

    for (const key of keys) {
      const outputFileName = key.split("/").pop();
      const outputFilePath = path.join(outputDir, outputFileName);
      await downloadS3File(bucket, key, outputFileName);
    }
    console.log(`Folder downloaded to ${outputDir}`);
  } catch (err) {
    console.error(`Error downloading folder ${prefix}: ${err.message}`);
  }
}

async function downloadS3Bucket(bucket) {
  const params = {
    Bucket: bucket,
  };
  try {
    const response = await s3.listObjectsV2(params).promise();

    const keys = response.Contents.map((obj) => obj.Key);

    for (const key of keys) {
      const outputFileName = key.split("/").pop();
      const outputFilePath = path.join(outputDir, outputFileName);
      await downloadS3File(bucket, key, outputFileName);
    }
    console.log(`Bucket downloaded to ${outputDir}`);
  } catch (err) {
    console.error(`Error downloading bucket ${bucket}: ${err.message}`);
  }
}

async function awsDownload(program) {
  try {
    const bucket =
      program.bucket || (await ask("Please enter the S3 bucket name: "));
    const type = program.file ? "file" : program.folder ? "folder" : "bucket";

    switch (type) {
      case "file": {
        const key = program.file;
        const outputFileName = path.basename(key);
        await downloadS3File(bucket, key, outputFileName);
        break;
      }
      case "folder": {
        const prefix = program.folder;
        await downloadS3Folder(bucket, prefix);
        break;
      }
      default: {
        await downloadS3Bucket(bucket);
      }
    }
  } catch (err) {
    console.error(`Error downloading from S3: ${err.message}`);
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

module.exports = awsDownload;
