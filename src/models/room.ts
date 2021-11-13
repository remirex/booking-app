import mongoose from 'mongoose';
import { IRoom } from '../interfaces/IRoom';

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      index: true,
      required: true,
    },
    floor: {
      type: Number,
      required: true,
    },
    capacity: Number,
    assets: {
      kitchenAndDining: {
        kitchen: {
          type: Boolean,
          default: false,
        },
        refrigerator: {
          type: Boolean,
          default: false,
        },
        microwave: {
          type: Boolean,
          default: false,
        },
        dishesAndSilverware: {
          type: Boolean,
          default: false,
        },
        freezer: {
          type: Boolean,
          default: false,
        },
        dishwasher: {
          type: Boolean,
          default: false,
        },
        stove: {
          type: Boolean,
          default: false,
        },
        hotWaterKettle: {
          type: Boolean,
          default: false,
        },
        coffeeMaker: {
          type: Boolean,
          default: false,
        },
        wineGlasses: {
          type: Boolean,
          default: false,
        },
        toaster: {
          type: Boolean,
          default: false,
        },
        trashCompactor: {
          type: Boolean,
          default: false,
        },
        diningTable: {
          type: Boolean,
          default: false,
        },
        cookingBasics: {
          type: Boolean,
          default: false,
        },
        oven: {
          type: Boolean,
          default: false,
        },
        barbecueUtensils: {
          type: Boolean,
          default: false,
        },
      },
      bathroom: {
        bathtub: {
          type: Boolean,
          default: false,
        },
        hairDryer: {
          type: Boolean,
          default: false,
        },
        shampoo: {
          type: Boolean,
          default: false,
        },
        conditioner: {
          type: Boolean,
          default: false,
        },
        bodySoap: {
          type: Boolean,
          default: false,
        },
        hotWater: {
          type: Boolean,
          default: false,
        },
        showerGel: {
          type: Boolean,
          default: false,
        },
        cleaningProducts: {
          type: Boolean,
          default: false,
        },
      },
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IRoom & mongoose.Document>('Room', schema);
