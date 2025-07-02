import { useRef, useState } from 'react';

export default function ImageUpload({
  selectedFile,
  setSelectedFile,
  imagePreview,
  setImagePreview,
  editId
}) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setSelectedFile(null);
      setImagePreview(null);
      return;
    }

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
      setSelectedFile(null);
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    try {
      const previewUrl = URL.createObjectURL(file);
      setSelectedFile(file);
      setImagePreview(previewUrl);
    } catch (error) {
      console.error('Error generating preview:', error);
      setSelectedFile(null);
      setImagePreview(null);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-semibold text-gray-700">Upload Image</label>

      {!imagePreview ? (
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="border-3 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-blue-400 hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 group">
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="h-8 w-8 text-blue-500"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="text-gray-600">
                <span className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                  Click to upload
                </span>
                <span className="text-gray-500"> or drag and drop</span>
              </div>
              <p className="text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-lg inline-block">
                📁 PNG, JPG
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative inline-block group">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-48 h-48 object-contain rounded-2xl border-4 border-white shadow-xl group-hover:shadow-2xl transition-all duration-300"
              style={{ backgroundColor: '#f0f0f0' }}
              onError={(e) => {
                e.target.style.display = 'none';
                console.error('Image preview failed to load.');
              }}
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-red-600 hover:scale-110 transition-all duration-200 shadow-lg"
              title="Remove image"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center space-x-3 text-green-700">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <span className="font-medium">
                {selectedFile
                  ? `🆕 New image selected: ${selectedFile.name}`
                  : editId
                  ? '📷 Current image (no changes made)'
                  : '✅ Image selected'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRemoveImage}
            className="text-blue-600 hover:text-blue-800 font-semibold bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-all duration-200"
          >
            {editId ? '🔄 Change image' : '🔄 Choose different image'}
          </button>
        </div>
      )}
    </div>
  );
}
