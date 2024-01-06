import {
  S3Client,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { S3_BUCKET_NAME, S3_REGION, S3_ACCESS_KEY, S3_SECRET_ACCESS_KEY, S3_URL, WISHES_IMAGES_FOLDER } from '../constants';
import crypto from 'crypto';

const s3Client = new S3Client({
  region: S3_REGION as string,
  credentials: {
    accessKeyId: S3_ACCESS_KEY as string,
    secretAccessKey: S3_SECRET_ACCESS_KEY as string,
  },
});

const generateFileName = (fileName: string): string => {
  const fileExtension = fileName.split('.')[1];
  const randomString = crypto.randomBytes(16).toString('hex');
  const generatedFileName = `${randomString}.${fileExtension}`;
  return generatedFileName;
}

const onUploadImage = async (file: Express.Multer.File | undefined) => {
  console.log(file);
  const fileName = generateFileName(file?.originalname as string);
  const fileType = file?.mimetype;
  const fileContent = file?.buffer;

  const params = {
    Bucket: S3_BUCKET_NAME,
    Key: `${WISHES_IMAGES_FOLDER}/${fileName}`,
    Body: fileContent,
    ContentType: fileType,
  };

  try {
    const command = new PutObjectCommand(params as any);
    await s3Client.send(command);
    return {
      status: true,
      message: 'Image uploaded successfully.',
      imageUrl: `${S3_URL}/${WISHES_IMAGES_FOLDER}/${fileName}`
    };
  } catch (err: any) {
    console.error(err);
    return {
      status: false,
      message: 'An error occurred while uploading the image.'
    };
  }
}

export { onUploadImage };