import { Inject, Service } from 'typedi';
import { Route, Tags, Request, Path, UploadedFiles, Security, Post } from 'tsoa';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

import Generic from '../generic';

@Tags('Files')
@Route('/')
@Service()
export default class FileService extends Generic {
  constructor(
    @Inject('userModel') private userModel: Models.UserModel,
    @Inject('uploadModel') private uploadModel: Models.UploadModel,
    @Inject('logger') private logger,
  ) {
    super(userModel);
  }

  @Security('jwt')
  @Post('/user/upload/files/{userId}')
  public async uploadFiles(
    @Path() userId: string,
    @Request() host: string,
    @UploadedFiles() files: { [p: string]: Express.Multer.File[] } | Express.Multer.File[] | undefined,
  ) {
    const propertyValues = Object.values(files!);
    for (const file of propertyValues) {
      await sharp(file.path)
        .resize(200, 200)
        .jpeg({ quality: 90 })
        .toFile(path.resolve(file.destination, 'resized', file.filename));
      fs.unlinkSync(file.path);
      // save img into db
      await this.uploadModel.create({
        owner: userId,
        path: host + '/' + file.path,
      });
    }
  }
}

function splitString(str: string, separator: string) {
  const string = str.split(separator);

  return string[string.length - 1];
}
