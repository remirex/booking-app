import { Request } from 'express';
import multer, { StorageEngine, Multer } from 'multer';
import { resolve } from 'path';
import * as crypto from 'crypto';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

const diskStorageForImages: StorageEngine = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, done): void => {
    if (!file) {
      done(new Error('Upload file error.'), null!);
    } else {
      done(null, resolve(process.cwd(), `public/uploads/images`));
    }
  },
  filename: (req: any, file: Express.Multer.File, done) => {
    const fileName = `${Date.now()}-${crypto.randomBytes(2).toString('hex')}-${file.originalname}`;
    done(null, fileName);
  },
});

const diskStorageForOtherFile: StorageEngine = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, done): void => {
    if (!file) {
      done(new Error('Upload file error.'), null!);
    } else {
      done(null, resolve(process.cwd(), `public/uploads`));
    }
  },
  filename: (req: any, file: Express.Multer.File, done) => {
    const fileName = `${Date.now()}-${crypto.randomBytes(2).toString('hex')}-${file.originalname}`;
    done(null, fileName);
  },
});

const imageFileValidator = (req: any, file: Express.Multer.File, done) => {
  const extFile = file.originalname.replace('.', '');
  const extPattern = /(jpg|jpeg|png|gif|svg|doc)/gi.test(extFile);

  if (!extPattern) {
    done(new TypeError('File format is not valid'), null);
  } else {
    done(null, true);
  }
};

const fileValidator = (req: any, file: Express.Multer.File, done) => {
  const extFile = file.originalname.replace('.', '');
  const extPattern = /(pdf|csv|xlsx)/gi.test(extFile);

  if (!extPattern) {
    done(new TypeError('File format is not valid'), null);
  } else {
    done(null, true);
  }
};

export const imageUpload = multer({
  storage: diskStorageForImages,
  limits: { fileSize: 1000000 },
  fileFilter: imageFileValidator,
}) as Multer;

export const fileUpload = multer({
  storage: diskStorageForOtherFile,
  limits: { fileSize: 1000000 },
  fileFilter: fileValidator,
}) as Multer;

// export const resizeImage = async (
//   req: Request
//   // filePath: string | undefined,
//   // fileName: string | undefined,
//   // destination: string | undefined,
// ) => {
//   await sharp(req.file?.path)
//     .resize(200, 200)
//     .toFormat('png')
//     .png({ quality: 90 })
//     .toFile(path.resolve(<string>req.file?.destination, 'resized', <string>req.file?.filename));
//   fs.unlinkSync(<string>req.file?.path);
// };

export function resizeImage() {
  console.log('test ulaz');
  return async (req: Request) => {
    await sharp(req.file?.path)
      .resize(200, 200)
      .toFormat('png')
      .png({ quality: 90 })
      .toFile(path.resolve(<string>req.file?.destination, 'resized', <string>req.file?.filename));
    fs.unlinkSync(<string>req.file?.path);
  }
}
