import "dotenv/config";
import { defineConfig } from "@prisma/config";

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL,
    // @ts-ignore: Ignoramos o erro do TS aqui devido a um bug conhecido de tipagem na versão 7
    directUrl: process.env.DIRECT_URL,
  },
});
