export interface IRoom {
  name: string;
  floor: number;
  capacity: number;
}

export interface IRoomInputDTO {
  name: string;
  floor: number;
  capacity?: number;
  assets?: {
    kitchenAndDining?: {
      kitchen?: boolean;
      refrigerator?: boolean;
      microwave?: boolean;
      dishesAndSilverware?: boolean;
      freezer?: boolean;
      dishwasher?: boolean;
      stove?: boolean;
      hotWaterKettle?: boolean;
      coffeeMaker?: boolean;
      wineGlasses?: boolean;
      toaster?: boolean;
      trashCompactor?: boolean;
      diningTable?: boolean;
      cookingBasics?: boolean;
      oven?: boolean;
      barbecueUtensils?: boolean;
    };
    bathroom?: {
      bathtub?: boolean;
      hairDryer?: boolean;
      shampoo?: boolean;
      conditioner?: boolean;
      bodySoap?: boolean;
      hotWater?: boolean;
      showerGel?: boolean;
      cleaningProducts?: boolean;
    };
    heatingAndCooling?: {
      airConditioning?: boolean;
      portableFans?: boolean;
      heating?: boolean;
      indoorFireplace?: boolean;
      ceilingFan?: boolean;
      radiantHeating?: boolean;
    };
    bedroomAndLaundry?: {
      washer?: boolean;
      dryer?: boolean;
      essentials?: boolean;
      hangers?: boolean;
      bedLinens?: boolean;
      extraPillowsAndBlankets?: boolean;
      roomDarkeningShades?: boolean;
      iron?: boolean;
      clothingStorage?: boolean;
    };
    internetAndOffice?: {
      wiFi?: boolean;
      dedicatedWorkspace?: boolean;
    };
    entertainment?: {
      tv?: boolean;
      gameConsole?: boolean;
      booksAndReadingMaterial?: boolean;
      bluetoothSoundSystem?: boolean;
      exerciseEquipment?: boolean;
    };
    parkingAndFacilities?: {
      elevator?: boolean;
      gym?: boolean;
      privateGym?: boolean;
      evCharger?: boolean;
      paidParkingGarageOnPremises?: boolean;
      paidParkingGarageOffPremises?: boolean;
    };
  };
}
