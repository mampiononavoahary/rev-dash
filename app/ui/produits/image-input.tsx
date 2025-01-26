
import React, { useState } from "react";

const FileInputWithPreview: React.FC = () => {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
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

