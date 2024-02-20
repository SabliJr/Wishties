"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.onDeleteImage = exports.onUploadImage = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const constants_1 = require("../constants");
const crypto_1 = __importDefault(require("crypto"));
const s3Client = new client_s3_1.S3Client({
    region: constants_1.S3_REGION,
    credentials: {
        accessKeyId: constants_1.S3_ACCESS_KEY,
        secretAccessKey: constants_1.S3_SECRET_ACCESS_KEY,
    },
});
const generateFileName = (fileName) => {
    const fileExtension = fileName.split('.')[1];
    const randomString = crypto_1.default.randomBytes(16).toString('hex');
    const generatedFileName = `${randomString}.${fileExtension}`;
    return generatedFileName;
};
const onUploadImage = (file, folder_name) => __awaiter(void 0, void 0, void 0, function* () {
    const imgFileName = generateFileName(file === null || file === void 0 ? void 0 : file.originalname);
    const fileType = file === null || file === void 0 ? void 0 : file.mimetype;
    const fileContent = file === null || file === void 0 ? void 0 : file.buffer;
    const params = {
        Bucket: constants_1.S3_BUCKET_NAME,
        Key: `${folder_name}/${imgFileName}`,
        Body: fileContent,
        ContentType: fileType,
    };
    try {
        const command = new client_s3_1.PutObjectCommand(params);
        yield s3Client.send(command);
        return {
            status: true,
            message: 'Image uploaded successfully.',
            imageUrl: `${constants_1.S3_URL}/${folder_name}/${imgFileName}`
        };
    }
    catch (err) {
        console.error(err);
        return {
            status: false,
            message: 'An error occurred while uploading the image.'
        };
    }
});
exports.onUploadImage = onUploadImage;
const onDeleteImage = (fileName) => __awaiter(void 0, void 0, void 0, function* () {
    const params = {
        Bucket: constants_1.S3_BUCKET_NAME,
        Key: fileName,
    };
    try {
        yield s3Client.send(new client_s3_1.DeleteObjectCommand(params));
        return {
            status: true,
            message: 'Image deleted successfully.'
        };
    }
    catch (err) {
        console.error(err);
        return {
            status: false,
            message: 'An error occurred while deleting the image.'
        };
    }
});
exports.onDeleteImage = onDeleteImage;
