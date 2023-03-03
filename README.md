# S3 Tools

This program is intended to make it easy to interact with S3 buckets regardless of service used.

## Author

Devin Earl\
GitHub: [Devin-Earl](https://github.com/Devin-Earl)

## Prerequisites

- Node.js version 10 or higher
- NPM (Node Package Manager)

## Installation

1. Clone or download the repository
2. Install dependencies by running `npm install` in the project directory

## Usage

`node index.js -s <service> -a <action> -f <file> [-f3 <folder>]`

### Options

- `-s, --service <service>`: The cloud storage service you are using. Valid options are `aws`, `azure`, or `google`.
- `-a, --action <action>`: The action you want to perform. Valid options are `upload` or `download`.
- `-f, --file <file>`: The path to the file you want to upload or download.
- `-f3, --folder <folder>` (optional): The path to the folder you want to upload.

## Example

To upload a file to an AWS S3 bucket, run:

`node index.js -s aws -a upload -f path/to/file.txt`

## License

This project is licensed under the MIT License.
