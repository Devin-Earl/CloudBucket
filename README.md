# S3 Tools

This program is intended to make it easy to interact with S3 buckets regardless of service used.

## Setup

Before running the program, you need to create a `.env` file with the following variables:

- `AWS_ACCESS_KEY_ID`: Your AWS access key ID.
- `AWS_SECRET_ACCESS_KEY`: Your AWS secret access key.
- `AZURE_STORAGE_CONNECTION_STRING`: Your Azure storage connection string.
- `AZURE_STORAGE_ACCOUNT`: Your Azure storage account name.
- `GCLOUD_KEYFILE_PATH`: The path to your Google Cloud service account key file.
- `GCP_PROJECT_ID`: Your Google Cloud project ID.

You can also pass these values as environment variables instead of using a `.env` file.

### Usage

To use the program, run `node index.js` followed by the desired options. You can also run `node index.js` without options to be prompted for the necessary information.

#### Options

- `--service <service>`: The cloud storage service you are using (`aws`, `azure`, or `google`).
- `--action <action>`: The action you want to perform (`upload` or `download`).
- `--file <file>`: The name of the file you want to upload or download. For uploading, you can also specify the full path to the file.
- `--folder <folder>`: The path to the folder you want to upload. This option is not used for downloading.
- `--bucket <bucket>`: The name of the AWS S3 bucket.

##### Examples

Upload a file to an AWS S3 bucket:

`node index.js --service aws --action upload --file path/to/file.txt --bucket your-bucket-name`

Download a file from an AWS S3 bucket:

`node index.js --service aws --action download --file file.txt --bucket your-bucket-name`

Upload a file to Azure Blob Storage:

`node index.js --service azure --action upload --file path/to/file.txt`

Download a file from Azure Blob Storage:

`node index.js --service azure --action download --file file.txt`

Upload a file to Google Cloud Storage:

`node index.js --service google --action upload --file path/to/file.txt`

Download a file from Google Cloud Storage:

`node index.js --service google --action download --file file.txt`

Prompt for information:

`node index.js`

This will prompt you for the cloud storage service, action, and any other necessary information. The program will guide you through the process of selecting the appropriate service and action, and entering any required parameters such as the bucket or file name.
