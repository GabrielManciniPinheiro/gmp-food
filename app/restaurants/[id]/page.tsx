import { db } from "@/app/_lib/prisma";
import { notFound } from "next/navigation";
import RestaurantImage from "./_components/restaurant-image";
import Image from "next/image";
import { StarIcon } from "lucide-react";
import DeliveryInfo from "@/app/_components/delivery-info";

interface RestaurantPageProps {
  // 1. Define o params como uma Promise
  params: Promise<{
    id: string;
  }>;
}

// 2. Recebe o params inteiro sem desestruturar o id diretamente
const RestaurantPage = async ({ params }: RestaurantPageProps) => {
  // 3. Aguarda a Promise ser resolvida para extrair o id
  const { id } = await params;

  const restaurant = await db.restaurant.findUnique({
    where: {
      id,
    },
    include: {
      categories: true,
    },
  });

  if (!restaurant) {
    return notFound();
  }

  return (
    <div>
      <RestaurantImage restaurant={restaurant} />

      <div className="flex items-center justify-between px-5 pt-5">
        {/* Titulo */}
        <div className="flex items-center gap-1.5">
          <div className="relative h-8 w-8">
            <Image
              src={restaurant.imageUrl}
              alt={restaurant.name}
              fill
              className="rounded-full object-cover"
            />
          </div>
          <h1 className="text-xl font-semibold">{restaurant.name}</h1>
        </div>

        <div className="bg-foreground flex items-center gap-0.75 rounded-full px-2 py-0.5 text-white">
          <StarIcon size={12} className="fill-yellow-500 text-yellow-400" />
          <span className="text-xs font-semibold">5.0</span>
        </div>
      </div>

      <div className="px-5">
        <DeliveryInfo restaurant={restaurant} />
      </div>

      <div className="mt-3 flex gap-4 overflow-x-scroll px-5 [&::-webkit-scrollbar]:hidden">
        {restaurant.categories.map((category) => (
          <div
            key={category.id}
            className="min-w-41.75 rounded-lg bg-[#F4F4F4] text-center"
          >
            <span className="text-muted-foreground text-xs">
              {category.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RestaurantPage;
