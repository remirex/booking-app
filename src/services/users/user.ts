import { Inject, Service } from 'typedi';
import { unlink } from 'fs';
import { Put, Security, Request, Route, Tags, Path, UploadedFile } from 'tsoa';

import Generic from '../generic';

@Tags('User')
@Route('/user')
@Service()
export default class UserService extends Generic {
  constructor(@Inject('userModel') private userModel: Models.UserModel, @Inject('logger') private logger) {
    super(userModel);
  }

  /**
   * Upload User Avatar
   * @param fileName
   * @param userId
   * @param basePath
   * @param avatar
   */
  @Security('jwt')
  @Put('/avatar/{userId}')
  public async uploadAvatar(
    @Request() fileName: any,
    @Path() userId: string,
    @Request() basePath: string,
    @UploadedFile() avatar: Express.Multer.File,
  ) {
    const user = await this.getById(userId);
    // unlink old file
    const img = user.avatar ? user.avatar : '';
    const separator = '/';
    const oldFile = splitString(img, separator);
    unlink(`public/uploads/images/resized/${oldFile}`, err => {
      if (err) this.logger.error(err);
      this.logger.info(`Deleted file: ${oldFile}`);
    });

    const toUpdate = { avatar: basePath + '/' + fileName };
    await this.update(userId, toUpdate, false, false);

    return true;
  }

  /**
   * Upload file (pdf, csv, xlsx)
   * @param fileName
   * @param userId
   * @param basePath
   * @param file
   */
  @Security('jwt')
  @Put('/upload/file/{userId}')
  public async uploadFile(
    @Request() fileName: any,
    @Path() userId: string,
    @Request() basePath: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const user = await this.getById(userId);
    const toUpdate = { file: basePath + '/' + fileName };
    await this.update(userId, toUpdate, false, false);
    // unlink old file
    const docs = user.file ? user.file : '';
    const separator = '/';
    const oldFile = splitString(docs, separator);
    console.log('oldFile: ', oldFile);
    unlink(`public/uploads/${oldFile}`, err => {
      if (err) this.logger.error(err);
      this.logger.info(`Deleted file: ${oldFile}`);
    });

    return true;
  }
}

function splitString(str: string, separator: string) {
  const string = str.split(separator);

  return string[string.length - 1];
}
