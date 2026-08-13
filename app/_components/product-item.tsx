import { Prisma } from "@prisma/client";
import Image from "next/image";
import { calculateProductTotalPrice, formatCurrency } from "../_helpers/price";
import { ArrowDownIcon } from "lucide-react";
import Link from "next/link";

interface ProductItemProps {
  product: Prisma.ProductGetPayload<{
    include: {
      restaurant: {
        select: {
          name: true;
        };
      };
    };
  }>;
}

const ProductItem = ({ product }: ProductItemProps) => {
  return (
    <Link
      className="w-37.5 min-w-37.5 space-y-2"
      href={`/products/${product.id}`}
    >
      <div className="w-full space-y-2">
        {/* IMAGEM */}
        <div className="relative h-37.5 w-full">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="rounded-lg object-cover shadow-md"
          />

          {product.discountPercentage && (
            <div className="bg-primary absolute top-2 left-2 flex items-center gap-0.5 rounded-full px-2 py-0.5 text-white">
              <ArrowDownIcon size={12} />
              <span className="text-xs font-semibold">
                {product.discountPercentage}%
              </span>
            </div>
          )}
        </div>

        {/* TÍTULO, PREÇO E DESCONTO */}
        <div>
          <h2 className="truncate text-sm">{product.name}</h2>
          <div className="flex items-center gap-1">
            <h3 className="font-semibold">
              {formatCurrency(calculateProductTotalPrice(product))}
            </h3>
            {product.discountPercentage > 0 && (
              <span className="text-muted-foreground text-xs line-through">
                {formatCurrency(Number(product.price))}
              </span>
            )}
          </div>

          <span className="text-muted-foreground block text-xs">
            {product.restaurant.name}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProductItem;
