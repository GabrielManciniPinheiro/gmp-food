"use server";

import { db } from "@/app/_lib/prisma";
import { Prisma } from "@prisma/client";

export const searchRestaurants = async (search: string) => {
  const restaurants = await db.restaurant.findMany({
    where: {
      name: {
        contains: search,
        mode: "insensitive",
      },
    },
  });

  // Aqui fazemos a conversão do Decimal para Number antes de devolver os dados para o Client Component
  return restaurants.map((restaurant) => ({
    ...restaurant,
    deliveryFee: Number(restaurant.deliveryFee) as unknown as Prisma.Decimal,
  }));
};
