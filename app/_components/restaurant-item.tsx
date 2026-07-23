import { Restaurant } from "@prisma/client";
import { BikeIcon, HeartIcon, StarIcon, TimerIcon } from "lucide-react";
import Image from "next/image";
import { formatCurrency } from "../_helpers/price";
import { Button } from "./ui/button";

interface RestaurantItemProps {
  restaurant: Restaurant;
}

const RestaurantItem = ({ restaurant }: RestaurantItemProps) => {
  return (
    <div className="max-w-66.5 min-w-66.5 space-y-3">
      <div className="relative h-34 w-full">
        <Image
          src={restaurant.imageUrl}
          fill
          className="rounded-lg object-cover"
          alt={restaurant.name}
        />

        <div className="absolute top-2 left-2 flex items-center gap-0.5 rounded-full bg-white px-2 py-0.5">
          <StarIcon size={12} className="fill-yellow-500 text-yellow-400" />
          <span className="text-xs font-semibold">5.0</span>
        </div>

        <Button
          size="icon"
          className="absolute top-2 right-2 h-7 w-7 rounded-full bg-gray-700"
        >
          <HeartIcon size={16} className="fill-white" />
        </Button>
      </div>

      <div>
        <h3 className="text-sm font-semibold">{restaurant.name}</h3>
        {/* INFORMAÇÕES DE ENTREGA */}
        <div className="flex gap-3">
          {/* ENTREGA */}
          <div className="flex items-center gap-1">
            <BikeIcon className="text-primary text-xs" size={14} />
            <span className="text-muted-foreground text-xs">
              {Number(restaurant.deliveryFee) === 0
                ? "Entrega grátis"
                : formatCurrency(Number(restaurant.deliveryFee))}
            </span>
          </div>
          {/* TEMPO DE ENTREGA */}
          <div className="flex items-center gap-1">
            <TimerIcon className="text-primary" size={14} />
            <span className="text-muted-foreground text-xs">
              {restaurant.deliveryTimeMinutes} min
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantItem;
