import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface FileUploadResult {
  url: string;
  publicId: string;
  originalFilename: string;
  format: string;
  bytes: number;
}

export async function uploadFile(
  file: Buffer,
  filename: string,
  folder: string = 'alpha-bet/curriculum'
): Promise<FileUploadResult> {
  try {
    const result = await cloudinary.uploader.upload(
      `data:application/octet-stream;base64,${file.toString('base64')}`,
      {
        resource_type: 'image', // Use image resource type for PDFs to enable delivery
        public_id: `${folder}/${filename.replace(/\.[^/.]+$/, '')}`,
        use_filename: true,
        unique_filename: false,
        overwrite: true,
      }
    );

    return {
      url: result.secure_url,
      publicId: result.public_id,
      originalFilename: filename,
      format: result.format,
      bytes: result.bytes,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload file to Cloudinary');
  }
}

export async function deleteFile(publicId: string): Promise<void> {
  try {
    console.log('Deleting file from Cloudinary:', publicId);
    
    // Ensure Cloudinary is configured
    const config = cloudinary.config();
    if (!config.cloud_name || !config.api_key || !config.api_secret) {
      throw new Error('Cloudinary not properly configured');
    }
    
    // Based on documentation: PDFs uploaded as resource_type: 'image' must be deleted as 'image'
    // Our upload function uses resource_type: 'image' for PDFs
    const result = await cloudinary.uploader.destroy(publicId, { 
      resource_type: 'image',
      invalidate: true // Clear CDN cache
    });
    
    console.log('Cloudinary delete result:', result);
    
    if (result.result === 'ok') {
      console.log('File deleted successfully from Cloudinary');
      return;
    } else if (result.result === 'not found') {
      throw new Error(`File not found: ${publicId}`);
    } else {
      throw new Error(`Delete failed with result: ${result.result}`);
    }
    
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
    throw new Error(`Failed to delete file from Cloudinary: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export function getOptimizedUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    quality?: 'auto' | number;
    format?: 'auto' | string;
  } = {}
): string {
  return cloudinary.url(publicId, {
    secure: true,
    quality: options.quality || 'auto',
    format: options.format || 'auto',
    width: options.width,
    height: options.height,
  });
}

export function getFileUrl(publicId: string, format?: string): string {
  // For PDFs, force the extension to ensure proper delivery
  if (format === 'pdf') {
    return cloudinary.url(publicId, {
      secure: true,
      format: 'pdf'
    });
  }
  
  // For other document formats, use secure URL as-is
  const documentFormats = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'csv', 'zip', 'rar'];
  if (format && documentFormats.includes(format.toLowerCase())) {
    return cloudinary.url(publicId, {
      secure: true,
      format: format
    });
  }
  
  // For images and other media, use standard transformation
  return cloudinary.url(publicId, { secure: true });
}

export default cloudinary;