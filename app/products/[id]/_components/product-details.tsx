"use client";

import Image from "next/image";
import {
  formatCurrency,
  calculateProductTotalPrice,
} from "@/app/_helpers/price";
import DiscountBadge from "@/app/_components/discount-badge";
import { Prisma } from "@prisma/client";
import {
  BikeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  TimerIcon,
} from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import { useState } from "react";
import { Card } from "@/app/_components/ui/card";
import ProductList from "@/app/_components/product-list";

interface ProductDetailsProps {
  product: Prisma.ProductGetPayload<{
    include: {
      restaurant: true;
    };
  }>;
  complementaryProducts: Prisma.ProductGetPayload<{
    include: {
      restaurant: true;
    };
  }>[];
}

const ProductDetails = ({
  product,
  complementaryProducts,
}: ProductDetailsProps) => {
  const [quantity, setQuantity] = useState(1);

  const handleIncreaseQuantityClick = () =>
    setQuantity((currentState) => currentState + 1);

  const handleDecreaseQuantityClick = () =>
    setQuantity((currentState) => {
      if (currentState === 1) return 1;
      return currentState - 1;
    });

  return (
    <div className="py-5">
      {/* RESTAURANTE */}
      <div className="flex items-center gap-1.5 px-5">
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
      <h1 className="mt-1 mb-2 px-5 text-xl font-semibold">{product.name}</h1>

      {/* PRECO DO PRODUTO E QUANTIDADE*/}
      <div className="flex justify-between px-5">
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

        {/* QUANTIDADE */}
        <div className="flex items-center gap-3 text-center">
          <Button
            size="icon"
            variant="ghost"
            className="border-muted-foreground border border-solid"
            onClick={handleDecreaseQuantityClick}
          >
            <ChevronLeftIcon />
          </Button>
          <span className="w-4">{quantity}</span>
          <Button
            size="icon"
            className="border-muted-foreground border border-solid"
            onClick={handleIncreaseQuantityClick}
          >
            <ChevronRightIcon />
          </Button>
        </div>
      </div>

      {/* DADOS DA ENTREGA */}
      <div className="px-5">
        <Card className="mt-6">
          <div className="flex justify-around px-5 py-3">
            {/* Custo */}
            <div className="flex flex-col items-center">
              <div className="text-muted-foreground flex items-center gap-1">
                <span className="text-xs">Entrega </span>
                <BikeIcon size={14} />
              </div>

              {Number(product.restaurant.deliveryFee) > 0 ? (
                <p className="text-xs font-semibold">
                  {formatCurrency(Number(product.restaurant.deliveryFee))}
                </p>
              ) : (
                <p className="text-xs font-semibold">Grátis</p>
              )}
            </div>

            {/* Tempo */}
            <div className="flex flex-col items-center">
              <div className="text-muted-foreground flex items-center gap-1">
                <span className="text-xs">Tempo</span>
                <TimerIcon size={14} />
              </div>

              <p className="text-xs font-semibold">
                {product.restaurant.deliveryTimeMinutes} min
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-6 space-y-3 px-5">
        <h3 className="font-semibold">Sobre</h3>
        <p className="text-muted-foreground text-sm">{product.description}</p>
      </div>

      <div className="mt-6 space-y-3">
        <h3 className="px-5 font-semibold">Sucos</h3>
        <ProductList products={complementaryProducts} />
      </div>
    </div>
  );
};

export default ProductDetails;
