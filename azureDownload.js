require("dotenv").config();
const { BlobServiceClient } = require("@azure/storage-blob");
const fs = require("fs");
const path = require("path");

const connectStr = process.env.AZURE_STORAGE_CONNECTION_STRING;

const blobServiceClient = BlobServiceClient.fromConnectionString(connectStr);

const outputDir = "./output";
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

const downloadBlob = async (container, blobName, outputFileName) => {
  const containerClient = blobServiceClient.getContainerClient(container);
  const blobClient = containerClient.getBlobClient(blobName);

  try {
    const response = await blobClient.download();

    const outputFilePath = path.join(outputDir, outputFileName);
    await response.readableStreamBody.pipe(
      fs.createWriteStream(outputFilePath)
    );
    console.log(`File downloaded to ${outputFilePath}`);
  } catch (err) {
    console.error(`Error downloading file ${blobName}: ${err.message}`);
  }
};

const downloadFolder = async (container, prefix) => {
  const containerClient = blobServiceClient.getContainerClient(container);
  const blobs = containerClient.listBlobsByHierarchy("/", { prefix: prefix });

  for await (const blob of blobs) {
    if (blob.kind === "blob") {
      const outputFileName = path.basename(blob.name);
      const outputFilePath = path.join(outputDir, outputFileName);
      await downloadBlob(container, blob.name, outputFileName);
    }
  }

  console.log(`Folder downloaded to ${outputDir}`);
};

const downloadContainer = async (container) => {
  const containerClient = blobServiceClient.getContainerClient(container);
  const blobs = containerClient.listBlobsFlat();

  for await (const blob of blobs) {
    const outputFileName = path.basename(blob.name);
    const outputFilePath = path.join(outputDir, outputFileName);
    await downloadBlob(container, blob.name, outputFileName);
  }

  console.log(`Container downloaded to ${outputDir}`);
};

const azureDownload = async (program) => {
  try {
    const container =
      program.container || (await ask("Please enter the container name: "));
    const type = program.file
      ? "file"
      : program.folder
      ? "folder"
      : "container";

    switch (type) {
      case "file": {
        const blobName = program.file;
        const outputFileName = path.basename(blobName);
        await downloadBlob(container, blobName, outputFileName);
        break;
      }
      case "folder": {
        const prefix = program.folder;
        await downloadFolder(container, prefix);
        break;
      }
      default: {
        await downloadContainer(container);
      }
    }
  } catch (err) {
    console.error(`Error downloading from Azure: ${err.message}`);
  }
};

const ask = (question) => {
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
};

module.exports = azureDownload;
