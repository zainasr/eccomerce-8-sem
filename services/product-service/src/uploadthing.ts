import { createUploadthing, type FileRouter } from "uploadthing/express";

const f = createUploadthing();

export const uploadRouter = {
  // Product image uploader
  productImage: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  }).onUploadComplete((data) => {
    console.log("Product image upload completed", data);
    return { url: data.file.ufsUrl };
  }),

  // Multiple product images uploader
  productImages: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 10,
    },
  }).onUploadComplete((data) => {
    console.log("Product images upload completed", data);
    return { url: data.file.ufsUrl };
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter;
