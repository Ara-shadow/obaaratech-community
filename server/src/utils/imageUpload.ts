import { MultipartFile } from '@fastify/multipart';
import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

const UPLOAD_DIR = path.join(process.cwd(), 'uploads');
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif'
];
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export interface UploadResult {
    url: string;
    filename: string;
    size: number;
    mimeType: string;
}

/**
 * Validate file is an image (not video)
 */
export function validateImageFile(file: MultipartFile): { valid: boolean; error?: string } {
    const mimeType = file.mimetype || '';
    const filename = file.filename || '';
    const ext = path.extname(filename).toLowerCase();
    
    // Check MIME type
    if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
        return {
            valid: false,
            error: `File type "${mimeType}" is not allowed. Please upload an image (JPG, PNG, WEBP, or GIF).`
        };
    }
    
    // Check file extension
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
        return {
            valid: false,
            error: `File extension "${ext}" is not allowed. Please upload an image (JPG, PNG, WEBP, or GIF).`
        };
    }
    
    return { valid: true };
}

/**
 * Upload an image to local storage
 */
export async function uploadImage(file: MultipartFile): Promise<UploadResult> {
    // Validate file is an image
    const validation = validateImageFile(file);
    if (!validation.valid) {
        throw new Error(validation.error);
    }
    
    // Check file size (5MB limit)
    if (file.file.bytesRead > MAX_FILE_SIZE) {
        throw new Error(`File size exceeds 5MB limit. Current size: ${(file.file.bytesRead / 1024 / 1024).toFixed(2)}MB`);
    }
    
    const buffer = await file.toBuffer();
    const ext = path.extname(file.filename || 'image.jpg').toLowerCase();
    const filename = `${randomUUID()}${ext}`;
    const filepath = path.join(UPLOAD_DIR, filename);
    
    fs.writeFileSync(filepath, buffer);
    
    return {
        url: `/uploads/${filename}`,
        filename,
        size: buffer.length,
        mimeType: file.mimetype || 'image/jpeg'
    };
}

/**
 * Delete an image from local storage
 */
export async function deleteImage(url: string): Promise<void> {
    // Extract filename from URL
    const filename = url.replace('/uploads/', '');
    const filepath = path.join(UPLOAD_DIR, filename);
    
    if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
    }
}

/**
 * Get file size in MB
 */
export function getFileSizeInMB(bytes: number): string {
    return (bytes / 1024 / 1024).toFixed(2);
}