"use client";

import { useState } from "react";

const ImageUploader = () => {
  const [image, setImage] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {image && (
        <img
          src={image}
          alt="Uploaded"
          style={{ width: "200px", marginTop: "10px" }}
        />
      )}
    </div>
  );
};

export default ImageUploader;
