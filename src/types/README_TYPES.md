# Tipos das Entidades

Este arquivo explica o que foi feito ao criar tipos para as entidades do domínio.

Passos realizados:

1. Criar `src/types/entities.ts`

- Objetivo: centralizar as definições de tipos/interfaces para `Ingredient`, `Portion`, `Snack`, `SnackPortion` e `User`.
- Razão: manter tipagem explícita facilita leitura, manutenção e reduz `any` espalhado.

2. Definições escolhidas

- Usei `interface` para todas as entidades. Interfaces são legíveis e fáceis de estender.
- Campos `cost` e totais são `string` porque o projeto usa `Decimal` do Prisma e frequentemente são serializados como string (evita perda de precisão no frontend).

3. Integração com código existente

- Atualizei `src/services/snackService.ts` para importar `SnackWithTotals` de `src/types/entities.ts`.
- Mantive as inclusões (`snackPortions`, `portion.ingredient`) opcionais (`?`) porque a consulta do Prisma varia conforme `include`.

4. Como usar

- Exemplo de import:

```ts
import type { Portion, SnackWithTotals } from "../types/entities.js";

const func = (s: SnackWithTotals) => console.log(s.totalCost);
```

5. Próximos passos possíveis

- Substituir usos de `any` por tipos concretos nas services e controllers.
- Fazer um pequeno utilitário para converter `Decimal` (Prisma) em `string` ou `number` conforme necessidade.
- Se preferir, podemos exportar tipos diretamente do client Prisma (ex: `Prisma.Portfolio`), mas isso acopla o código ao client gerado.

Se quiser, eu substituo `any` restantes em `src/services` pelos tipos agora criados. Quer que eu faça isso?
