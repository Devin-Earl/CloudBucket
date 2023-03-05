require('dotenv').config();
const { BlobServiceClient } = require('@azure/storage-blob');
const fs = require('fs');
const path = require('path');

const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);

const uploadAzureBlob = async (containerName, blobName, inputFilePath) => {
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    try { 
        await blockBlobClient.uploadFile(inputFilePath);
        console.log(`File Uploaded to https://${process.env.AZURE_STORAGE_ACCOUNT}.blob.core.windows.net/${containerName}/${blobName}`);
    } catch (err) {
        console.error(`Error uploading file ${blobName}:${err.message}`);
    } 
};
const uploadAzureBlobFolder = async (containerName, prefix, inputDirPath) => {
    try {
        const files = fs.readdirSync(inputDirPath);
        for (const file of files) {
            const inputFilePath = path.join(inputDirPath, file);
            const blobName = prefix + '/' + file;
            await uploadAzureBlob(containerName, blobName, inputFilePath);
        }
        console.log(`Folder uploaded to https://${process.env.AZURE_STORAGE_ACCOUNT}.blob.core.windows.net/${containerName}/${prefix}`);
    } catch (err) {
        console.error(`Error uploading folder ${prefix}: ${err.message}`);
    }
};
async function azureUpload(program) {
    try {
        const containerName = program.container || (await ask('Please enter the container name: '));
        const type = program.file ? 'file' : program.folder ? 'folder' : 'container';
        const inputPath = program.input || (await ask('Please enter the input file or folder path: '));

        switch (type) {
            case 'file': {
                const blobName = program.file;
                await uploadAzureBlob(containerName, blobName, inputPath);
                break;
            }
            case 'folder': {
                const prefix = program.folder;
                await uploadAzureBlobFolder(containerName, prefix, inputPath);
                break;
            }
            default: {
                console.log(`Invalid type: ${type}`);
                break;
            }
        }
    } catch (err) {
        console.error(`Error uploading to Azure Storage: ${err.message}`);
    }
}

function ask(question) {
    return new Promise((resolve, reject) => {
        const readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        readline.question(question, (answer) => {
            readline.close();
            resolve(answer);
        });
    });
}

module.exports = azureUpload;
