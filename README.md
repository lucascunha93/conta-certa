# Conta Certa

Aplicativo mobile de controle de fluxo de caixa, desenvolvido com Ionic + React. Permite registrar entradas e saídas financeiras, visualizar resumos mensais e exportar relatórios em PDF ou Excel.

## Funcionalidades

- Registro de movimentações financeiras (entradas e saídas)
- Listagem mensal com navegação por mês
- Filtro por tipo (todos / entradas / saídas)
- Resumo financeiro: total de entradas, saídas e saldo
- Exportação dos dados em PDF e Excel (.xlsx)
- Edição e exclusão de movimentações com confirmação
- Persistência local via `localStorage`
- Suporte a modo escuro (sistema)

## Stack

| Tecnologia | Versão |
|---|---|
| React | 19 |
| Ionic React | 8.5 |
| Capacitor | 7.4 |
| TypeScript | 5 |
| Vite | 5 |
| React Router | 5.3 |

## Pré-requisitos

- Node.js 18+
- npm 9+

## Instalação

```bash
npm install
```

## Scripts

```bash
npm run dev          # Servidor de desenvolvimento (http://localhost:5173)
npm run build        # Compilação para produção
npm run preview      # Preview do build
npm run lint         # Verificação de código com ESLint
npm run test.unit    # Testes unitários com Vitest
npm run test.e2e     # Testes end-to-end com Cypress
```

## Build para mobile (Capacitor)

```bash
npm run build
npx cap sync
npx cap open android   # ou ios
```

## Estrutura do projeto

```
src/
├── App.test.tsx
├── App.tsx
├── main.tsx
├── setupTests.ts
├── vite-env.d.ts
├── components/
│   ├── FinancialSummary/
│   │   ├── FinancialSummary.tsx     # Cards de resumo (entradas, saídas e saldo)
│   │   └── FinancialSummary.css
│   ├── TransactionForm/
│   │   ├── TransactionForm.tsx      # Formulário de adição e edição de movimentações
│   │   └── TransactionForm.css
│   └── TransactionList/
│       ├── TransactionList.tsx      # Listagem mensal com navegador de mês, filtros e exportação
│       └── TransactionList.css
├── hooks/
│   └── useTransactions.ts           # Gerenciamento de estado e persistência das movimentações
├── pages/
│   ├── Home.tsx                     # Página principal — orquestra todos os componentes
│   └── Home.css
├── theme/
│   ├── utilities.css                # Classes utilitárias globais
│   └── variables.css                # Variáveis de cor e tema do Ionic
└── types/
    └── transaction.ts               # Interfaces Transaction, TransactionSummary e TransactionFilter
```

## Licença

Privado.
