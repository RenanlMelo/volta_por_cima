import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fixa a raiz do projeto para o Turbopack não subir até a home do usuário
  // ao procurar lockfiles.
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
