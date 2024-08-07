import multer, { DiskStorageOptions, FileFilterCallback } from "multer";
import { Request } from "express";
import path from "path";

// Set up storage engine
const storage = multer.diskStorage({
  destination: function (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void,
  ) {
    const projectBasePath = path.resolve(__dirname, "../../../");
    cb(null, `${projectBasePath}/RentRipple-Frontend/src/assets/`); // Upload directory
  },
  filename: function (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void,
  ) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
} as DiskStorageOptions);

// File filter to accept only certain file types
const imageFilter = function (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(null, false);
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: imageFilter,
});

export default upload;
