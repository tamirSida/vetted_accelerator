import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl.searchParams.get('url');
    const filename = request.nextUrl.searchParams.get('filename') || 'download.pdf';

    if (!url) {
      return NextResponse.json({ error: 'URL parameter required' }, { status: 400 });
    }

    // Handle local files from the public directory
    if (url.startsWith('/')) {
      try {
        const filePath = join(process.cwd(), 'public', url);
        const fileBuffer = await readFile(filePath);
        
        // Determine content type based on file extension
        const contentType = url.endsWith('.pdf') ? 'application/pdf' : 'application/octet-stream';
        
        // Convert Buffer to ArrayBuffer
        const arrayBuffer = new ArrayBuffer(fileBuffer.length);
        const view = new Uint8Array(arrayBuffer);
        for (let i = 0; i < fileBuffer.length; i++) {
          view[i] = fileBuffer[i];
        }
        
        return new NextResponse(arrayBuffer, {
          headers: {
            'Content-Type': contentType,
            'Content-Disposition': `attachment; filename="${filename}"`,
            'Content-Length': fileBuffer.length.toString(),
          },
        });
      } catch (error) {
        console.error('Local file read error:', error);
        return NextResponse.json({ error: 'Local file not found' }, { status: 404 });
      }
    }

    // Handle external URLs (like Cloudinary)
    const response = await fetch(url);
    
    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch file' }, { status: response.status });
    }

    const fileBuffer = await response.arrayBuffer();

    // Return the file with proper download headers
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': fileBuffer.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error('Download proxy error:', error);
    return NextResponse.json({ error: 'Download failed' }, { status: 500 });
  }
}