import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// O template string `${}` garante pro TypeScript que isso será uma string e não "undefined"
const connectionString = `${process.env.DATABASE_URL}`;

const prismaClientSingleton = () => {
  // Cria o adaptador do Postgres passando a sua URL de conexão
  const adapter = new PrismaPg({ connectionString });

  // Instancia o PrismaClient exigindo o uso desse adaptador
  return new PrismaClient({ adapter });
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
