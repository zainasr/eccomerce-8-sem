export const deleteImage = async (imageUrl: string): Promise<void> => {
  try {
    // Extract file key from URL
    const fileKey = imageUrl.split("/").pop();
    if (fileKey) {
      // You can implement deletion logic here if needed
      // For now, we'll just log it
      console.log(`Would delete image: ${fileKey}`);
    }
  } catch (error) {
    console.error("Delete failed:", error);
    throw new Error("Failed to delete image");
  }
};
