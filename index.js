const { Command } = require('commander');
const program = new Command();

program
  .description('This program is intended to make it easy to interact with S3 buckets regardless of service used.')
  .option('-s --service <service>', 'The cloud storage service you are using', /^(aws|azure|google)$/i)
  .option('-a --action <action>', 'The action you want to perform', /^(upload|download)$/i)
  .option('-f --file <file>', 'The path to the file you want to upload or download')
  .option('-f3 --folder <file>', 'The path to the file you want to upload or download');
program.parse(process.argv);

const service = program.service.toLowerCase();
const action = program.action.toLowerCase();

switch (service) {
  case 'aws':
    if (action === 'upload') {
      const awsUpload = require('./aws-Upload');
      awsUpload(program.file);
    } else if (action === 'download') {
      const awsDownload = require('./awsDownload');
      awsDownload(program.file);
    }
    break;
  case 'azure':
    if (action === 'upload') {
      const azureUpload = require('./azureUpload');
      azureUpload(program.file);
    } else if (action === 'download') {
      const azureDownload = require('./azureDownload');
      azureDownload(program.file);
    }
    break;
  case 'google':
    if (action === 'upload') {
      const googleUpload = require('./googleUpload');
      googleUpload(program.file);
    } else if (action === 'download') {
      const googleDownload = require('./googleDownload');
      googleDownload(program.file);
    }
    break;
}
