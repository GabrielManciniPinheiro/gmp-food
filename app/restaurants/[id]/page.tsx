import { db } from "@/app/_lib/prisma";
import { notFound } from "next/navigation";
import RestaurantImage from "./_components/restaurant-image";
import Image from "next/image";
import { StarIcon } from "lucide-react";
import DeliveryInfo from "@/app/_components/delivery-info";
import ProductList from "@/app/_components/product-list";
import { Prisma } from "@prisma/client"; // Não esqueça desse import!

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
      categories: {
        include: {
          products: {
            where: {
              restaurantId: id, // Filtra os produtos pelo ID do restaurante
            },
            include: {
              restaurant: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
      products: {
        take: 10,
        include: {
          restaurant: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  if (!restaurant) {
    return notFound();
  }

  // CORREÇÃO 2: Convertemos a taxa de entrega e TODOS os preços dos produtos para Número normal!
  const sanitizedRestaurant = {
    ...restaurant,
    deliveryFee: Number(restaurant.deliveryFee) as unknown as Prisma.Decimal,
    products: restaurant.products.map((p) => ({
      ...p,
      price: Number(p.price) as unknown as Prisma.Decimal,
    })),
    categories: restaurant.categories.map((c) => ({
      ...c,
      products: c.products.map((p) => ({
        ...p,
        price: Number(p.price) as unknown as Prisma.Decimal,
      })),
    })),
  };

  return (
    <div>
      {/* Agora passamos o objeto limpo para todos os componentes */}
      <RestaurantImage restaurant={sanitizedRestaurant} />

      <div className="relative z-50 mt-[-6] flex items-center justify-between rounded bg-white px-5 pt-5">
        {/* Titulo */}
        <div className="flex items-center gap-1.5">
          <div className="relative h-8 w-8">
            <Image
              src={sanitizedRestaurant.imageUrl}
              alt={sanitizedRestaurant.name}
              fill
              className="rounded-full object-cover"
            />
          </div>
          <h1 className="text-xl font-semibold">{sanitizedRestaurant.name}</h1>
        </div>

        <div className="bg-foreground flex items-center gap-0.75 rounded-full px-2 py-0.5 text-white">
          <StarIcon size={12} className="fill-yellow-500 text-yellow-400" />
          <span className="text-xs font-semibold">5.0</span>
        </div>
      </div>

      <div className="px-5">
        <DeliveryInfo restaurant={sanitizedRestaurant} />
      </div>

      <div className="mt-3 flex gap-4 overflow-x-scroll px-5 [&::-webkit-scrollbar]:hidden">
        {sanitizedRestaurant.categories.map((category) => (
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

      <div className="mt-6 space-y-4">
        {/* TODO: mostrar produtos mais pedidos quando implementarmos realizacao de pedidos */}
        <h2 className="px-5 font-semibold">Mais Pedidos</h2>
        <ProductList products={sanitizedRestaurant.products} />
      </div>

      {sanitizedRestaurant.categories.map((category) => (
        <div className="mt-6 space-y-4" key={category.id}>
          <h2 className="px-5 font-semibold">{category.name}</h2>
          <ProductList products={category.products} />
        </div>
      ))}
    </div>
  );
};

export default RestaurantPage;
