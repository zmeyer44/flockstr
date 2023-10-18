import S3 from "aws-sdk/clients/s3";
const s3Client = new S3({
  signatureVersion: "v4",
  region: process.env.REGION,
  accessKeyId: process.env.MY_AWS_ACCESS_KEY,
  secretAccessKey: process.env.MY_AWS_SECRET_KEY,
});

export { s3Client };
