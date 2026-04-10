import { useState, useEffect } from 'react';
import { Transaction, TransactionSummary, TransactionFilter } from '../types/transaction';

const STORAGE_KEY = 'conta-certa-transactions';


export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState<TransactionFilter>('todos');
  const [loaded, setLoaded] = useState(false);

  // Carregar transações do localStorage
  useEffect(() => {
    const savedTransactions = localStorage.getItem(STORAGE_KEY);
    console.log('[Conta Certa] Lendo do localStorage:', savedTransactions);
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }
    setLoaded(true);
  }, []);

  // Salvar no localStorage quando transações mudarem, mas só depois do carregamento inicial
  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    console.log('[Conta Certa] Salvando no localStorage:', transactions);
  }, [transactions, loaded]);


  const addTransaction = (transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setTransactions(prev => [...prev, newTransaction]);
  };

  const updateTransaction = (updated: Transaction) => {
    setTransactions(prev => prev.map(t => t.id === updated.id ? { ...t, ...updated } : t));
  };

  const removeTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };


  // Filtrar transações apenas para exibição
  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'todos') return true;
    return transaction.type === filter;
  });

  // Calcular resumo financeiro
  const getSummary = (): TransactionSummary => {
    const totalEntradas = transactions
      .filter(t => t.type === 'entrada')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalSaidas = transactions
      .filter(t => t.type === 'saida')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      totalEntradas,
      totalSaidas,
      saldo: totalEntradas - totalSaidas,
    };
  };

  return {
    transactions: filteredTransactions, // para exibição
    allTransactions: transactions,      // sempre o array completo
    addTransaction,
    updateTransaction,
    removeTransaction,
    filter,
    setFilter,
    summary: getSummary(),
  };
};