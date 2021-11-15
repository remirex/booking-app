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
      heatingAndCooling: {
        airConditioning: {
          type: Boolean,
          default: false,
        },
        portableFans: {
          type: Boolean,
          default: false,
        },
        heating: {
          type: Boolean,
          default: false,
        },
        indoorFireplace: {
          type: Boolean,
          default: false,
        },
        ceilingFan: {
          type: Boolean,
          default: false,
        },
        radiantHeating: {
          type: Boolean,
          default: false,
        },
      },
      bedroomAndLaundry: {
        washer: {
          type: Boolean,
          default: false,
        },
        dryer: {
          type: Boolean,
          default: false,
        },
        essentials: {
          type: Boolean,
          default: false,
        },
        hangers: {
          type: Boolean,
          default: false,
        },
        bedLinens: {
          type: Boolean,
          default: false,
        },
        extraPillowsAndBlankets: {
          type: Boolean,
          default: false,
        },
        roomDarkeningShades: {
          type: Boolean,
          default: false,
        },
        iron: {
          type: Boolean,
          default: false,
        },
        clothingStorage: {
          type: Boolean,
          default: false,
        },
      },
      internetAndOffice: {
        wiFi: {
          type: Boolean,
          default: false,
        },
        dedicatedWorkspace: {
          type: Boolean,
          default: false,
        },
      },
      entertainment: {
        tv: {
          type: Boolean,
          default: false,
        },
        gameConsole: {
          type: Boolean,
          default: false,
        },
        booksAndReadingMaterial: {
          type: Boolean,
          default: false,
        },
        bluetoothSoundSystem: {
          type: Boolean,
          default: false,
        },
        exerciseEquipment: {
          type: Boolean,
          default: false,
        },
      },
      parkingAndFacilities: {
        elevator: {
          type: Boolean,
          default: false,
        },
        gym: {
          type: Boolean,
          default: false,
        },
        privateGym: {
          type: Boolean,
          default: false,
        },
        evCharger: {
          type: Boolean,
          default: false,
        },
        paidParkingGarageOnPremises: {
          type: Boolean,
          default: false,
        },
        paidParkingGarageOffPremises: {
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
