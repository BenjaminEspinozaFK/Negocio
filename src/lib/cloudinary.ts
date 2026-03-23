import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(base64Image: string): Promise<string> {
    const result = await cloudinary.uploader.upload(base64Image, {
        folder: 'productos',
        transformation: [
            { width: 400, height: 400, crop: 'limit' },
            { quality: 'auto' },
            { fetch_format: 'auto' },
        ],
    });
    return result.secure_url;
}

export async function deleteImage(url: string): Promise<void> {
    const parts = url.split('/');
    const filename = parts[parts.length - 1];
    const publicId = `productos/${filename.split('.')[0]}`;
    await cloudinary.uploader.destroy(publicId);
}