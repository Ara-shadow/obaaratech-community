import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'node:stream';
import type { MultipartFile } from '@fastify/multipart';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export interface UploadResult {
    secure_url: string;
    public_id: string;
    width: number;
    height: number;
    format: string;
}

/**
 * Upload an image to Cloudinary
 */
export async function uploadImage(file: MultipartFile): Promise<UploadResult> {
    // Convert file to buffer
    const buffer = await file.toBuffer();
    
    // Upload to Cloudinary
    const result = await new Promise<any>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: 'obaaratech/listings',
                allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
                transformation: [
                    { width: 1200, height: 1200, crop: 'limit' },
                    { quality: 'auto' }
                ]
            },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
        
        // Write buffer to stream
        const readable = Readable.from(buffer);
        readable.pipe(uploadStream);
    });
    
    return {
        secure_url: result.secure_url,
        public_id: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format
    };
}

/**
 * Delete an image from Cloudinary
 */
export async function deleteImage(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId);
}

/**
 * Get image URL with transformations
 */
export function getImageUrl(publicId: string, options?: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: number;
}): string {
    const transforms: string[] = [];
    
    if (options?.width) transforms.push(`w_${options.width}`);
    if (options?.height) transforms.push(`h_${options.height}`);
    if (options?.crop) transforms.push(`c_${options.crop}`);
    if (options?.quality) transforms.push(`q_${options.quality}`);
    
    const transformString = transforms.length > 0 ? `${transforms.join(',')}/` : '';
    
    return cloudinary.url(publicId, {
        transformation: transformString || undefined
    });
}

export default cloudinary;