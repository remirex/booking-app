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
  };
}
