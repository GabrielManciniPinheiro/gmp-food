import Header from "@/app/_components/header";
import ProductItem from "@/app/_components/product-item";
import { db } from "@/app/_lib/prisma";
import { Prisma } from "@prisma/client";

interface CategoriesPageProps {
  params: Promise<{
    id: string;
  }>;
}

const CategoriesPage = async ({ params }: CategoriesPageProps) => {
  const { id } = await params;

  const category = await db.category.findUnique({
    where: {
      id,
    },
    include: {
      products: {
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

  if (!category) {
    return <div>Categoria não encontrada</div>;
  }

  return (
    <>
      <Header />
      <div className="px-5 py-6">
        <h2 className="mb-6 text-lg font-semibold">{category.name}</h2>
        <div className="grid grid-cols-2 gap-6">
          {category.products.map((product) => (
            <ProductItem
              key={product.id}
              product={{
                ...product,
                price: Number(product.price) as unknown as Prisma.Decimal,
              }}
              className="min-w-full"
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default CategoriesPage;
