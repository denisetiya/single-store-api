import multer from 'multer';
import dotenv from "dotenv";
import { v2 as cloudinary } from 'cloudinary';
dotenv.config();
import sharp from "sharp";
import streamifier from 'streamifier';

export const configureCloudinary = () => {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
      api_key: process.env.CLOUDINARY_API_KEY as string,
      api_secret: process.env.CLOUDINARY_API_SECRET as string,
    });
  };
  
const multerStorage = multer.memoryStorage();
  
export const upload = multer({ storage: multerStorage });

export const compressAndUploadImage = async (fileBuffer: Buffer, folder: string): Promise<string> => {
    const compressedImage = await sharp(fileBuffer).jpeg({ quality: 80 }).toBuffer();

    const uploadResult = await new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream({
        folder,
        format: "jpeg",
        resource_type: "image"
    }, (error, result) => {
        if (error) return reject(error);
        resolve(result);
    });

    streamifier.createReadStream(compressedImage).pipe(uploadStream);
    });

    return (uploadResult as any).secure_url;
}


export const compressAndUploadMultipleImages = async (files: Express.Multer.File[], folder: string) => {
    let images: string[] = [];
    if (files && Array.isArray(files)) {
      // Compress images
      const compressedImages = await Promise.all(files.map(async (file) => {
        return await sharp(file.buffer).jpeg({ quality: 80 }).toBuffer();
      }));

      const uploadResults = await Promise.all(compressedImages.map(async (imageBuffer) => {
        return new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream({
            folder,
            format: "jpeg",
            resource_type: "image"
          }, (error, result) => {
            if (error) return reject(error);
            resolve(result);
          });

          streamifier.createReadStream(imageBuffer).pipe(uploadStream);
        });
      }));

      images = uploadResults.map((result) => (result as any).secure_url);
    }
    return images;
  };


  export const deleteImageMulter = async (publicId: string) => {
    try {
        const deletedImage = await cloudinary.uploader.destroy(publicId);
        return deletedImage.result === 'ok';
    } catch (error) {
        console.error(error);
        return false;
    }
  };