import { db } from "@/app/_lib/prisma";
import { notFound } from "next/navigation";
import ProductImage from "./_components/product-image";
import ProductDetails from "./_components/product-details";
import { Prisma } from "@prisma/client";

interface ProductPageProps {
  // 1. Tipamos o params como uma Promise (Regra do Next.js 15)
  params: Promise<{
    id: string;
  }>;
}

// 2. Recebemos apenas 'params' sem desestruturar direto na função
const ProductPage = async ({ params }: ProductPageProps) => {
  // 3. Aguardamos a Promise ser resolvida para pegar o 'id'
  const { id } = await params;

  const product = await db.product.findUnique({
    where: {
      id,
    },
    include: {
      restaurant: true,
    },
  });

  if (!product) {
    return notFound();
  }

  const juices = await db.product.findMany({
    where: {
      category: {
        name: "Sucos",
      },
      restaurant: {
        id: product?.restaurant.id,
      },
    },
    include: {
      restaurant: true,
    },
  });

  return (
    <div>
      <ProductImage
        product={{
          name: product.name,
          imageUrl: product.imageUrl,
        }}
      />

      {/* TITULO E PRECO */}
      <ProductDetails
        complementaryProducts={juices}
        product={{
          ...product,
          price: Number(product.price) as unknown as Prisma.Decimal,
          restaurant: {
            ...product.restaurant,
            deliveryFee: Number(
              product.restaurant.deliveryFee,
            ) as unknown as Prisma.Decimal,
          },
        }}
      />
    </div>
  );
};

export default ProductPage;
