import { Document, Model } from 'mongoose';
import { IItem } from '../../interfaces/IItem';
import { IRoom } from '../../interfaces/IRoom';
import { IUser, IRefreshToken } from '../../interfaces/IUser';
import { IUpload } from '../../interfaces/IUpload';

declare global {
  namespace Models {
    export type ItemModel = Model<IItem & Document>;
    export type RoomModel = Model<IRoom & Document>;
    export type UserModel = Model<IUser & Document>;
    export type RefreshTokenModel = Model<IRefreshToken & Document>;
    export type UploadModel = Model<IUpload & Document>;
  }

  namespace Express {
    export interface Request {
      currentUser: IUser & Document;
    }
  }
}
