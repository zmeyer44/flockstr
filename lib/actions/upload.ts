import { s3Client } from "@/lib/clients/s3";

export async function generateV4UploadSignedUrl(
  fileName: string,
  fileType: string,
) {
  const preSignedUrl = await s3Client.getSignedUrl("putObject", {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileName,
    ContentType: fileType,
    Expires: 5 * 60,
  });

  console.log("PresignedUrl", preSignedUrl);

  return { url: preSignedUrl };
}

export default generateV4UploadSignedUrl;
