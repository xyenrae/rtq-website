export const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

export const getCloudinaryUrl = (
  publicId: string,
  transformations: string = "f_auto,q_auto,c_fill"
): string => {
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}/${encodeURIComponent(
    publicId
  )}`;
};
