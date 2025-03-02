

import React, { useState } from "react";

interface FileInputWithPreviewProps {
  onChange: (url: string) => void;  // Déclarez la prop onChange
}

const FileInputWithPreview: React.FC<FileInputWithPreviewProps> = ({ onChange }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };
  return (
    <div className="flex items-center space-x-4">
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      {preview && (
        <img
          src={preview}
          alt="Preview"
          className="w-10 h-10 object-cover rounded-full border border-gray-300"
        />
      )}
    </div>
  );
};

export default FileInputWithPreview;

