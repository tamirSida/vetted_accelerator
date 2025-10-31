import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { getFileUrl } from '@/lib/cloudinary';

export async function GET(request: NextRequest) {
  console.log('Files API called');
  
  try {
    // Check if Cloudinary is configured
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    console.log('Environment check:', {
      cloudName: cloudName ? 'exists' : 'missing',
      apiKey: apiKey ? 'exists' : 'missing',
      apiSecret: apiSecret ? 'exists' : 'missing'
    });

    if (!cloudName || !apiKey || !apiSecret) {
      console.warn('Cloudinary not configured - missing environment variables');
      return NextResponse.json({
        success: true,
        files: [],
        warning: 'Cloudinary not configured'
      });
    }

    // Configure Cloudinary
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });

    console.log('Attempting to fetch from Cloudinary...');

    // Get files from Cloudinary using admin API
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'alpha-bet/',
      max_results: 100
    });

    console.log(`Found ${result.resources?.length || 0} files`);

    // Transform the files to use correct URLs
    const files = (result.resources || []).map((file: any) => ({
      ...file,
      secure_url: getFileUrl(file.public_id, file.format)
    }));

    return NextResponse.json({
      success: true,
      files,
    });
  } catch (error) {
    console.error('Files API error:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
    
    return NextResponse.json(
      { 
        error: 'Failed to list files', 
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}