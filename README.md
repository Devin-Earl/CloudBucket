# S3 Tools

This program is intended to make it easy to interact with S3 buckets regardless of service used.

## Setup

Before running the program, you need to create a `.env` file with the following variables:

`AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AZURE_STORAGE_CONNECTION_STRING=your_azure_storage_connection_string
GOOGLE_APPLICATION_CREDENTIALS=your_google_application_credentials`

You can also pass these values as environment variables instead of using a `.env` file.

### Usage

To use the program, run `node index.js` followed by the desired options. You can also run `node index.js` without options to be prompted for the necessary information.

#### Options

- `--service <service>`: The cloud storage service you are using (`aws`, `azure`, or `google`).
- `--action <action>`: The action you want to perform (`upload` or `download`).
- `--file <file>`: The path to the file you want to upload or download.
- `--folder <folder>`: The path to the folder you want to upload or download.
- `--bucket <bucket>`: The name of the AWS S3 bucket.

##### Examples

Upload a file to an AWS S3 bucket:

`node index.js --service aws --action upload --file path/to/file --bucket your-bucket-name`

Download a file from an AWS S3 bucket:

`node index.js --service aws --action download --file path/to/file --bucket your-bucket-name`

Upload a file to Azure Blob Storage:

`node index.js --service azure --action upload --file path/to/file`

Download a file from Azure Blob Storage:

`node index.js --service azure --action download --file path/to/file`

Upload a file to Google Cloud Storage:

`node index.js --service google --action upload --file path/to/file`

Download a file from Google Cloud Storage:

`node index.js --service google --action download --file path/to/file`

Prompt for information:

`node index.js`

This will prompt you for the cloud storage service, action, and any other necessary information.
