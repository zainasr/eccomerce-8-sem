import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();


// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({
    image: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete");
      console.log("file url", file.ufsUrl);
      return { fileUrl: file.ufsUrl };
    }),
  
  // Multiple images uploader for products
  productImageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 10, // Allow up to 10 images per product
    },
  })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Product image upload complete");
      console.log("file url", file.ufsUrl);
      return { fileUrl: file.ufsUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
