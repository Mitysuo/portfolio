# Portfolio

## Rodar localmente

Requer Node.js 20 ou superior.

```bash
npm install
npm run dev
```

Abra o endereço exibido pelo Vite, normalmente `http://localhost:5173`.

## Personalização rápida

1. Edite nome, descrição e links em `src/data/portfolio.ts`.
2. Altere as cores no começo de `src/styles.css`, dentro de `:root`.
3. Edite os itens do menu em `src/App.tsx`.
4. Troque o texto `VF` do núcleo pelo seu monograma.

## Estrutura

```text
src/
├── data/portfolio.ts  # conteúdo pessoal
├── App.tsx            # estrutura e interações
├── main.tsx           # inicialização do React
└── styles.css         # visual, responsividade e animações
```

## Build

```bash
npm run build
npm run preview
```
