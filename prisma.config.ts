import "dotenv/config";
import { defineConfig } from "@prisma/config";

export default defineConfig({
  migrations: {
    // Aqui dizemos para o Prisma como executar o arquivo TypeScript
    seed: "npx tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env.DATABASE_URL,
    // @ts-expect-error: Bug de tipagem do Prisma 7 na propriedade directUrl
    directUrl: process.env.DIRECT_URL,
  },
});
