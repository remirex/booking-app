import { Document, Model } from 'mongoose';
import { IItem } from '../../interfaces/IItem';
import { IRoom } from '../../interfaces/IRoom';
import { IUser } from '../../interfaces/IUser';

declare global {
  namespace Models {
    export type ItemModel = Model<IItem & Document>;
    export type RoomModel = Model<IRoom & Document>;
    export type UserModel = Model<IUser & Document>;
  }
}
