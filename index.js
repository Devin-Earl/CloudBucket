const { Command } = require("commander");
const program = new Command();
const prompt = require("prompt-sync")();

program
  .description(
    "This program is intended to make it easy to interact with S3 buckets regardless of service used."
  )
  .option(
    "-s --service <service>",
    "The cloud storage service you are using",
    /^(aws|azure|google)$/i
  )
  .option(
    "-a --action <action>",
    "The action you want to perform",
    /^(upload|download)$/i
  )
  .option("-f --file <file>", "The filename want to upload or download")
  .option(
    "-f3 --folder <folder>",
    "The name of the folder you want to upload or download"
  )
  .option("-b --bucket <bucket>", "The name of the AWS S3 bucket");

program.parse(process.argv);

const options = program.opts();
if (!options.service || !options.action) {
  console.log("Welcome to S3 Tools!");
  options.service = prompt(
    "Which cloud storage service are you using? (aws/azure/google) "
  ).toLowerCase();
  options.action = prompt(
    "What do you want to do? (upload/download) "
  ).toLowerCase();
  if (options.action === "upload") {
    const fileType = prompt(
      "Are you uploading a file or a folder? (file/folder) "
    ).toLowerCase();
    if (fileType === "file") {
      options.file = prompt("Enter the filename: ");
    } else if (fileType === "folder") {
      options.folder = prompt("Enter folder name: ");
    } else {
      console.log("Invalid file type.");
      process.exit(1);
    }
  } else if (options.action === "download") {
    options.bucket = prompt("Enter the name of the S3 bucket: ");
    const fileType = prompt(
      "Are you downloading a file or a folder? (file/folder) "
    ).toLowerCase();
    if (fileType === "file") {
      options.file = prompt("Enter the filename: ");
    } else if (fileType === "folder") {
      options.folder = prompt("Enter the folder name : ");
    } else {
      console.log("Invalid file type.");
      process.exit(1);
    }
  }
}

switch (options.service) {
  case "aws":
    if (options.action === "upload") {
      const awsUpload = require("./awsUpload");
      if (options.file) {
        awsUpload(options.file);
      } else if (options.folder) {
        awsUpload(options.folder, true);
      }
    } else if (options.action === "download") {
      const awsDownload = require("./awsDownload");
      if (options.file) {
        awsDownload(options.file, options.folder, options.bucket);
      } else if (options.folder) {
        awsDownload(options.folder, options.folder, options.bucket, true);
      }
    }
    break;
  case "azure":
    if (options.action === "upload") {
      const azureUpload = require("./azureUpload");
      if (options.file) {
        azureUpload(options.file);
      } else if (options.folder) {
        azureUpload(options.folder, true);
      }
    } else if (options.action === "download") {
      const azureDownload = require("./azureDownload");
      if (options.file) {
        azureDownload(options.file);
      } else if (options.folder) {
        azureDownload(options.folder, options.folder, true);
      }
      break;
    }
  case "google":
    if (options.action === "upload") {
      const googleUpload = require("./googleUpload");
      if (options.file) {
        googleUpload(options.file);
      } else if (options.folder) {
        googleUpload(options.folder, true);
      }
    } else if (options.action === "download") {
      const googleDownload = require("./googleDownload");
      if (options.file) {
        googleDownload(options.file, options.folder, options.bucket);
      } else if (options.folder) {
        googleDownload(options.folder, options.folder, options.bucket, true);
      }
    }
    break;

  default:
    console.log(`Invalid service "${options.service}".`);
}
