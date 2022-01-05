import { Service } from 'typedi';
import { Request } from 'express';
import multer, { StorageEngine, Multer } from 'multer';
import { resolve } from 'path';
import * as crypto from 'crypto';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

@Service()
export default class Upload {
  public uploadImage(isMultiple = false, size?: number) {
    const diskStorage: StorageEngine = multer.diskStorage({
      destination: (req: Request, file: Express.Multer.File, done): void => {
        if (!file) {
          done(new Error('Upload file error.'), null!);
        } else {
          done(null, 'public/uploads/images/');
        }
      },
      filename: (req: any, file: Express.Multer.File, done) => {
        const fileName =
          file.fieldname +
          '-' +
          Date.now() +
          '-' +
          crypto.randomBytes(2).toString('hex') +
          path.extname(file.originalname);
        done(null, fileName);
      },
    });

    const fileValidator = (req: any, file: Express.Multer.File, done) => {
      const extFile = file.originalname.replace('.', '');
      const extPattern = /(jpg|jpeg|png|gif|svg|doc)/gi.test(extFile);
      if (!extPattern) {
        done(new TypeError('File format is not valid.'), null);
      } else if (isMultiple && size && size > 3) {
        done(new TypeError('To many files to upload.'), null);
      } else {
        done(null, true);
      }
    };

    return multer({
      storage: diskStorage,
      limits: { fileSize: 1000000 },
      fileFilter: fileValidator,
    }) as Multer;
  }

  public uploadFile(isMultiple = false, size?: number) {
    const diskStorage: StorageEngine = multer.diskStorage({
      destination: (req: Request, file: Express.Multer.File, done): void => {
        if (!file) {
          done(new Error('Upload file error.'), null!);
        } else {
          done(null, 'public/uploads/');
        }
      },
      filename: (req: any, file: Express.Multer.File, done) => {
        const fileName =
          file.fieldname +
          '-' +
          Date.now() +
          '-' +
          crypto.randomBytes(2).toString('hex') +
          path.extname(file.originalname);
        done(null, fileName);
      },
    });

    const fileValidator = (req: any, file: Express.Multer.File, done) => {
      const extFile = file.originalname.replace('.', '');
      const extPattern = /(pdf|csv|xlsx)/gi.test(extFile);

      if (!extPattern) {
        done(new TypeError('File format is not valid'), null);
      } else {
        done(null, true);
      }
    };

    return multer({
      storage: diskStorage,
      limits: { fileSize: 1000000 },
      fileFilter: fileValidator,
    }) as Multer;
  }

  public async resizeImage(
    filePath: string | undefined,
    fileName: string | undefined,
    destination: string | undefined,
  ) {
    await sharp(filePath)
      .resize(200, 200)
      .jpeg({ quality: 90 })
      .toFile(path.resolve(destination!, 'resized', fileName!));
    fs.unlinkSync(filePath!);
  }
}
