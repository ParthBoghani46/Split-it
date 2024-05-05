/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Armchair,
  Baby,
  Banknote,
  Bike,
  Bus,
  Car,
  CarTaxiFront,
  Cat,
  Clapperboard,
  CupSoda,
  Dices,
  Dumbbell,
  Eraser,
  FerrisWheel,
  Fuel,
  Gift,
  Home,
  Hotel,
  Lamp,
  Landmark,
  LibraryBig,
  Martini,
  Music,
  ParkingMeter,
  Phone,
  PiggyBank,
  Plane,
  Plug,
  PlugZap,
  Shirt,
  ShoppingCart,
  Stethoscope,
  ThermometerSun,
  Train,
  Trash,
  Utensils,
  Wine,
  Wrench,
} from "lucide-react";

const categoryIconMapping: any[] = [
  Banknote, // 0
  Banknote, // 1
  FerrisWheel, // 2
  Dices, // 3
  Clapperboard, // 4
  Music, // 5
  Dumbbell, // 6
  Utensils, // 7
  Martini, // 8
  ShoppingCart, // 9
  Wine, // 10
  Home, // 11
  Plug, // 12
  Armchair, // 13
  Lamp, // 14
  Wrench, // 15
  Landmark, // 16
  Cat, // 17
  PiggyBank, // 18
  Wrench, // 19
  Baby, // 20
  Shirt, // 21
  LibraryBig, // 22
  Gift, // 23
  Landmark, // 24
  Stethoscope, // 25
  Banknote, // 26
  Bus, // 27
  Bike, // 28
  Train, // 29
  Car, // 30
  Fuel, // 31
  Hotel, // 32
  ParkingMeter, // 33
  Plane, // 34
  CarTaxiFront, // 35
  Banknote, // 36
  Eraser, // 37
  PlugZap, // 38
  ThermometerSun, // 39
  Trash, // 40
  Phone, // 41
  CupSoda, // 42
];

function CategoryIcon({ categoryId }: { categoryId: number }) {
  const Icon = categoryIconMapping[categoryId - 1] || Banknote; // Default to Banknote if no matching icon found

  return <Icon className="h-5 w-5 m-2" />;
}

export default CategoryIcon;
