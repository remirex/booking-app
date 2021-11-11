import { Document, Model } from 'mongoose';
import { IItem } from '@/interfaces/IItem';

declare global {
  namespace Models {
    export type ItemModel = Model<IItem & Document>;
  }
}
