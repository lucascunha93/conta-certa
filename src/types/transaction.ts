export interface Transaction {
  id: string;
  type: 'entrada' | 'saida';
  date: string;
  name: string;
  cpf: string;
  amount: number;
  observations?: string;
  createdAt: string;
}

export interface TransactionSummary {
  totalEntradas: number;
  totalSaidas: number;
  saldo: number;
}

export type TransactionFilter = 'todos' | 'entrada' | 'saida';