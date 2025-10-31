import { NextRequest, NextResponse } from 'next/server';
import { uploadFile, deleteFile, getFileUrl } from '@/lib/cloudinary';
import { v2 as cloudinary } from 'cloudinary';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'alpha-bet/documents';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const result = await uploadFile(buffer, file.name, folder);

    return NextResponse.json({
      success: true,
      file: {
        ...result,
        url: getFileUrl(result.publicId, result.format)
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  console.log('Delete API called');
  
  try {
    const body = await request.json();
    console.log('Delete request body:', body);
    
    const { publicId } = body;

    if (!publicId) {
      console.error('No public ID provided in delete request');
      return NextResponse.json({ error: 'No public ID provided' }, { status: 400 });
    }

    console.log('Attempting to delete file:', publicId);
    
    // Check if Cloudinary is configured
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      console.error('Cloudinary not configured for delete operation');
      return NextResponse.json({ error: 'Cloudinary not configured' }, { status: 500 });
    }

    await deleteFile(publicId);
    console.log('File deleted successfully:', publicId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    console.error('Delete error stack:', error instanceof Error ? error.stack : 'No stack');
    
    return NextResponse.json(
      { 
        error: 'Failed to delete file',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { publicId, newFilename } = await request.json();

    if (!publicId || !newFilename) {
      return NextResponse.json({ error: 'Public ID and new filename required' }, { status: 400 });
    }

    // Rename file in Cloudinary by copying to new public_id and deleting old one
    const folder = publicId.split('/').slice(0, -1).join('/');
    const newPublicId = `${folder}/${newFilename.replace(/\.[^/.]+$/, '')}`;

    const result = await cloudinary.uploader.upload(
      `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/raw/upload/${publicId}`,
      {
        public_id: newPublicId,
        resource_type: 'auto',
        overwrite: true,
      }
    );

    // Delete the old file
    await deleteFile(publicId);

    return NextResponse.json({
      success: true,
      file: {
        url: getFileUrl(result.public_id, result.format),
        publicId: result.public_id,
        originalFilename: newFilename,
        format: result.format,
        bytes: result.bytes,
      },
    });
  } catch (error) {
    console.error('Rename error:', error);
    return NextResponse.json(
      { error: 'Failed to rename file' },
      { status: 500 }
    );
  }
}