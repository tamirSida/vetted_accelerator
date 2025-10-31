'use client';

import { useState, useEffect } from 'react';
import { useAdmin } from '@/lib/cms/admin-context';

interface CloudinaryFile {
  public_id: string;
  secure_url: string;
  original_filename: string;
  format: string;
  bytes: number;
  created_at: string;
}

export default function AdminFilesPage() {
  const { isAdminMode, cmsUser } = useAdmin();
  const [files, setFiles] = useState<CloudinaryFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [renamingFile, setRenamingFile] = useState<string | null>(null);
  const [newFilename, setNewFilename] = useState('');
  const [uploadFilename, setUploadFilename] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [justUploaded, setJustUploaded] = useState<string | null>(null);

  const isAdmin = Boolean(cmsUser); // Any authenticated user is admin

  // Redirect if not admin
  useEffect(() => {
    if (!isAdmin) {
      window.location.href = '/';
    }
  }, [isAdmin]);

  // Load files from Cloudinary
  const loadFiles = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/files');
      if (response.ok) {
        const data = await response.json();
        setFiles(data.files || []);
      }
    } catch (error) {
      console.error('Failed to load files:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadFiles();
    }
  }, [isAdmin]);

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      const file = droppedFiles[0];
      setSelectedFile(file);
      setUploadFilename(file.name);
    }
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setUploading(true);
      const formData = new FormData();
      
      // Use custom filename if provided, otherwise use original
      const finalFilename = uploadFilename.trim() || selectedFile.name;
      const fileToUpload = new File([selectedFile], finalFilename, { type: selectedFile.type });
      
      formData.append('file', fileToUpload);
      formData.append('folder', 'alpha-bet/documents');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setSelectedFile(null);
        setUploadFilename('');
        setJustUploaded(result.file.url);
        setTimeout(() => setJustUploaded(null), 5000); // Clear after 5 seconds
        await loadFiles(); // Refresh the file list
      } else {
        const error = await response.json();
        alert(`Upload failed: ${error.error}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  // Handle file delete
  const handleDelete = async (publicId: string, filename: string) => {
    if (!confirm(`Are you sure you want to delete "${filename}"?`)) return;

    try {
      const response = await fetch('/api/upload', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicId }),
      });

      if (response.ok) {
        await loadFiles(); // Refresh the file list
      } else {
        const error = await response.json();
        alert(`Delete failed: ${error.error}`);
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Delete failed');
    }
  };

  // Handle file rename
  const handleRename = async (publicId: string) => {
    if (!newFilename.trim()) return;

    try {
      const response = await fetch('/api/upload', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicId, newFilename: newFilename.trim() }),
      });

      if (response.ok) {
        setRenamingFile(null);
        setNewFilename('');
        await loadFiles(); // Refresh the file list
      } else {
        const error = await response.json();
        alert(`Rename failed: ${error.error}`);
      }
    } catch (error) {
      console.error('Rename error:', error);
      alert('Rename failed');
    }
  };

  // Copy URL to clipboard
  const copyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!isAdmin) {
    return <div>Access denied</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-white via-white to-gray-200 relative">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(120,119,198,0.15),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.05),transparent_50%)]"></div>
      
      <div className="max-w-6xl mx-auto relative z-10 p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <i className="fas fa-cloud text-white text-xl"></i>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-black" style={{ fontFamily: "'Black Ops One', cursive" }}>
                File Manager
              </h1>
              <p className="text-gray-700">Manage Cloudinary files for Alpha-Bet CMS</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <a
              href="/admin"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <i className="fas fa-arrow-left"></i>
              Back to Admin
            </a>
          </div>
        </div>

        {/* Upload Section */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 mb-8 border border-gray-200 shadow-xl">
          <h2 className="text-xl font-bold text-black mb-4 flex items-center gap-2">
            <i className="fas fa-upload"></i>
            Upload New File
          </h2>
          
          {/* Drag and Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
              dragOver 
                ? 'border-blue-500 bg-blue-50/50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <div className="flex flex-col items-center gap-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
                dragOver ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
              }`}>
                <i className={`fas text-2xl ${dragOver ? 'fa-cloud-arrow-up' : 'fa-cloud-upload-alt'}`}></i>
              </div>
              
              <div>
                <p className={`font-medium ${dragOver ? 'text-blue-700' : 'text-gray-700'}`}>
                  {dragOver ? 'Drop your file here' : 'Drag and drop your file here'}
                </p>
                <p className="text-sm text-gray-500 mt-1">or click to browse</p>
              </div>
              
              <input
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setSelectedFile(file);
                  if (file) {
                    setUploadFilename(file.name);
                  }
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                accept="*/*"
              />
            </div>
          </div>
          
          {selectedFile && (
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
                  <i className="fas fa-file text-blue-600"></i>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{selectedFile.name}</p>
                  <p className="text-sm text-gray-600">{formatFileSize(selectedFile.size)}</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setUploadFilename('');
                  }}
                  className="w-8 h-8 bg-gray-600 hover:bg-gray-700 text-white rounded flex items-center justify-center transition-colors"
                  title="Remove file"
                >
                  <i className="fas fa-times text-xs"></i>
                </button>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filename (optional - leave blank to use original)
                </label>
                <input
                  type="text"
                  value={uploadFilename}
                  onChange={(e) => setUploadFilename(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={selectedFile.name}
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center gap-2 cursor-pointer"
                >
                  {uploading ? (
                    <>
                      <i className="fas fa-spinner animate-spin"></i>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-cloud-upload-alt"></i>
                      Upload File
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setUploadFilename('');
                  }}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg font-medium transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Files List */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-gray-200 overflow-hidden shadow-xl">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-black flex items-center gap-2">
              <i className="fas fa-files"></i>
              Uploaded Files ({files.length})
            </h2>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <i className="fas fa-spinner animate-spin text-blue-600 text-2xl mb-4"></i>
              <p className="text-gray-700">Loading files...</p>
            </div>
          ) : files.length === 0 ? (
            <div className="p-8 text-center">
              <i className="fas fa-folder-open text-gray-500 text-4xl mb-4"></i>
              <p className="text-gray-600">No files uploaded yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-4 text-gray-700 font-medium">File</th>
                    <th className="text-left p-4 text-gray-700 font-medium">Size</th>
                    <th className="text-left p-4 text-gray-700 font-medium">Format</th>
                    <th className="text-left p-4 text-gray-700 font-medium">URL</th>
                    <th className="text-left p-4 text-gray-700 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {files.map((file, index) => (
                    <tr key={file.public_id} className={`border-t border-gray-200 ${index % 2 === 0 ? 'bg-gray-50/50' : ''}`}>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
                            <i className="fas fa-file text-blue-400"></i>
                          </div>
                          <div className="flex-1">
                            {renamingFile === file.public_id ? (
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={newFilename}
                                  onChange={(e) => setNewFilename(e.target.value)}
                                  className="px-2 py-1 bg-white border border-gray-300 rounded text-gray-900 text-sm flex-1"
                                  placeholder="New filename"
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      handleRename(file.public_id);
                                    } else if (e.key === 'Escape') {
                                      setRenamingFile(null);
                                      setNewFilename('');
                                    }
                                  }}
                                  autoFocus
                                />
                                <button
                                  onClick={() => handleRename(file.public_id)}
                                  className="w-6 h-6 bg-green-600 hover:bg-green-700 text-white rounded flex items-center justify-center"
                                  title="Save"
                                >
                                  <i className="fas fa-check text-xs"></i>
                                </button>
                                <button
                                  onClick={() => {
                                    setRenamingFile(null);
                                    setNewFilename('');
                                  }}
                                  className="w-6 h-6 bg-gray-600 hover:bg-gray-700 text-white rounded flex items-center justify-center"
                                  title="Cancel"
                                >
                                  <i className="fas fa-times text-xs"></i>
                                </button>
                              </div>
                            ) : (
                              <div>
                                <div className="text-gray-900 font-medium">
                                  {file.original_filename || file.public_id.split('/').pop()}
                                </div>
                                <div className="text-gray-400 text-sm">
                                  {new Date(file.created_at).toLocaleDateString()}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-gray-700">
                        {formatFileSize(file.bytes)}
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs uppercase">
                          {file.format}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <code className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded max-w-xs truncate">
                            {file.secure_url}
                          </code>
                          <button
                            onClick={() => copyUrl(file.secure_url)}
                            className="w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center justify-center transition-colors"
                            title="Copy URL"
                          >
                            <i className={`fas ${copiedUrl === file.secure_url ? 'fa-check' : 'fa-copy'} text-xs`}></i>
                          </button>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <a
                            href={file.secure_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 bg-green-600 hover:bg-green-700 text-white rounded flex items-center justify-center transition-colors"
                            title="Open file"
                          >
                            <i className="fas fa-external-link-alt text-xs"></i>
                          </a>
                          <button
                            onClick={() => {
                              setRenamingFile(file.public_id);
                              setNewFilename(file.original_filename || file.public_id.split('/').pop() || '');
                            }}
                            className="w-8 h-8 bg-yellow-600 hover:bg-yellow-700 text-white rounded flex items-center justify-center transition-colors"
                            title="Rename file"
                          >
                            <i className="fas fa-edit text-xs"></i>
                          </button>
                          <button
                            onClick={() => handleDelete(file.public_id, file.original_filename || 'file')}
                            className="w-8 h-8 bg-red-600 hover:bg-red-700 text-white rounded flex items-center justify-center transition-colors"
                            title="Delete file"
                          >
                            <i className="fas fa-trash text-xs"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50/80 backdrop-blur-md rounded-2xl p-6 border border-blue-200 shadow-lg">
          <h3 className="text-lg font-bold text-black mb-3 flex items-center gap-2">
            <i className="fas fa-info-circle text-blue-600"></i>
            How to Use
          </h3>
          <div className="text-gray-700 space-y-2 text-sm">
            <p>• Upload files here to make them available for download in your CMS</p>
            <p>• Click the copy button next to any file URL to copy it to your clipboard</p>
            <p>• Use these URLs in your CMS forms where you need downloadable files</p>
            <p>• Files are stored securely in Cloudinary and accessible without authentication</p>
          </div>
        </div>

        {/* Quick copy notification for newly uploaded files */}
        {justUploaded && (
          <div className="fixed bottom-4 right-4 bg-green-600 text-white p-4 rounded-lg shadow-xl border border-green-500">
            <div className="flex items-center gap-3 mb-3">
              <i className="fas fa-check-circle text-lg"></i>
              <span className="font-medium">File uploaded successfully!</span>
            </div>
            <button
              onClick={() => copyUrl(justUploaded)}
              className="w-full bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <i className="fas fa-copy"></i>
              Copy Link
            </button>
          </div>
        )}

        {/* Copy confirmation */}
        {copiedUrl && (
          <div className="fixed bottom-4 left-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg animate-bounce">
            <i className="fas fa-check mr-2"></i>
            URL copied to clipboard!
          </div>
        )}
      </div>
    </div>
  );
}