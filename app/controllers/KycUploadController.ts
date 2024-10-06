import { Request, Response } from "express";
import multer, { FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";

/**
 * A disk storage configuration created to upload the kyc docs
 */
const storage = multer.diskStorage({
  destination: function (req: Request, file, cb) {
    // Extract smId from request body
    const smId = req.body.smId;

    if (!smId) {
      return cb(new Error("smId is required"), null as unknown as string);
    }

    // Create a directory based on smId if it does not exist
    const dir = path.join("upload/kyc-docs", smId);
    fs.mkdir(dir, { recursive: true }, (err) => {
      if (err) return cb(err, null as unknown as string);
      cb(null, dir);
    });
  },

  filename: (req, file, cb) => {
    console.log(file);
    return cb(
      null,
      `${file.fieldname}_${req.body.idType}_${req.body.smId}${path.extname(
        file.originalname
      )}`
    );
  },
});

/**
 * Middleware function to verify if the file is an image format
 * @param req
 * @param file
 * @param cb
 */
const fileFilter = (req: Request, file: Express.Multer.File, cb: any) => {
  // Accept only image files
  const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid_file_type"), false);
  }
};

/**
 * Multer instance to upload the images
 */
export const upload: multer.Multer = multer({
  storage: storage,
  limits: {
    fileSize: 1000000, // 1 MB limit
  },
  fileFilter: fileFilter,
});

/**
 * Last funcion after file upload, verifies the file upload and send response to client
 * @param request
 * @param response
 * @returns If file upload is successful, sends the image url to client
 */
export const uploadKycDocs = async (request: Request, response: Response) => {
  if (!request.file) {
    return response.status(400).json({ success: false });
  }
  response.json({
    success: 1,
    image_url: `https://shooramall.com/api/kyc-docs/${request.body.smId}/${request.file?.filename}`,
    idType: request.body.idType,
  });
};
