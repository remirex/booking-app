import { Document, Model } from 'mongoose';
import { IItem } from '@/interfaces/IItem';
import { IRoom } from "@/interfaces/IRoom";

declare global {
  namespace Models {
    export type ItemModel = Model<IItem & Document>;
    export type RoomModel = Model<IRoom & Document>;
  }
}
