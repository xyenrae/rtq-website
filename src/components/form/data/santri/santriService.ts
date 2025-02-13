// src/components/form/data/santri/santriService.ts
export const uploadFileToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
    );
  
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
      { method: "POST", body: formData }
    );
    const cloudData = await res.json();
    if (cloudData.error) {
      throw new Error(cloudData.error.message);
    }
    return cloudData.secure_url;
  };
  