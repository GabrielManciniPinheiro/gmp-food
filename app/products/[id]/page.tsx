import {
  calculateProductTotalPrice,
  formatCurrency,
} from "@/app/_helpers/price";
import { db } from "@/app/_lib/prisma";
import Image from "next/image";
import { notFound } from "next/navigation";
import ProductImage from "./_components/product-image";
import DiscountBadge from "@/app/_components/discount-badge";

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

  return (
    <div>
      {/* 4. Enviamos APENAS os dados que o Client Component precisa,
          evitando que objetos 'Decimal' ou 'Date' quebrem o Next.js */}
      <ProductImage
        product={{
          name: product.name,
          imageUrl: product.imageUrl,
        }}
      />

      {/* TITULO E PRECO */}
      <div className="p-5">
        {/* RESTAURANTE */}
        <div className="flex items-center gap-1.5">
          <div className="relative h-6 w-6">
            <Image
              src={product.restaurant.imageUrl}
              alt={product.restaurant.name}
              fill
              className="rounded-full object-cover"
            />
          </div>
          <span className="text-muted-foreground text-xs">
            {product.restaurant.name}
          </span>
        </div>

        {/* NOME DO PRODUTO */}
        <h1 className="mt-1 mb-2 text-xl font-semibold">{product.name}</h1>

        {/* PRECO DO PRODUTO E QUANTIDADE*/}
        <div className="flex justify-between">
          {/* PRECO COM DESCONTO */}
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold">
                {formatCurrency(calculateProductTotalPrice(product))}
              </h2>
              {product.discountPercentage > 0 && (
                <DiscountBadge product={product} />
              )}
            </div>

            {/* PRECO ORIGINAL */}
            {product.discountPercentage > 0 && (
              <p className="text-muted-foreground text-sm">
                De: {formatCurrency(Number(product.price))}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
