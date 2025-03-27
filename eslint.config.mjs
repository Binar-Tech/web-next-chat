import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Desativa regras específicas que você não quer mais no seu projeto
      "react-hooks/exhaustive-deps": "off", // Desativa a verificação das dependências no useEffect / useCallback
      "@typescript-eslint/no-explicit-any": "off", // Permite o uso de "any"
      "@typescript-eslint/no-unused-vars": "warn", // Exibe um aviso em vez de um erro
      "@typescript-eslint/no-non-null-assertion": "off", // Desativa o warning sobre a asserção de tipo "non-null"
    },
  },
];

export default eslintConfig;
